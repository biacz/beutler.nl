// Build-time data from GitHub: post comments (GitHub Discussions) and repo stats for project cards.
// Everything is fetched while building and baked into static HTML – readers' browsers never talk to GitHub.
// Needs GITHUB_TOKEN (set in CI). Without it, comments and stats are simply left out.
import { SITE, COMMENTS } from '../consts';

const token = process.env.GITHUB_TOKEN;
const [owner, name] = new URL(SITE.repo).pathname.slice(1).split('/');

async function graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GitHub GraphQL: ${res.status} ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}

export interface Comment {
  author: string;
  authorUrl?: string;
  createdAt: Date;
  html: string;
  replies: Comment[];
}
export interface Thread {
  url: string;
  comments: Comment[];
  count: number;
}

/**
 * GitHub sanitises bodyHTML already. We additionally drop images (they would load from GitHub's
 * image proxy – a third-party request) and mark links as user content.
 */
function clean(html: string): string {
  return html
    .replace(/<a\b[^>]*>\s*(<img\b[^>]*>)\s*<\/a>/gi, '$1')
    .replace(/<img\b[^>]*>/gi, '<em>[image – see on GitHub]</em>')
    .replace(/<(video|picture|source|iframe)\b[^>]*>(?:[\s\S]*?<\/\1>)?/gi, '')
    .replace(/<a\b([^>]*?)\s+rel="[^"]*"/gi, '<a$1')
    .replace(/<a\b/gi, '<a rel="nofollow ugc noopener"')
    // Safety net: whatever embedding tag is left (nested or malformed) becomes plain text.
    .replace(/<(?=\/?(?:img|video|audio|picture|source|track|iframe|frame|object|embed|script|style|link|meta|base|form)\b)/gi, '&lt;');
}

type RawComment = {
  author: { login: string; url: string } | null;
  createdAt: string;
  bodyHTML: string;
  isMinimized: boolean;
  replies?: { nodes: RawComment[] };
};

function toComment(c: RawComment): Comment {
  return {
    author: c.author?.login ?? 'ghost',
    authorUrl: c.author?.url,
    createdAt: new Date(c.createdAt),
    html: clean(c.bodyHTML),
    replies: (c.replies?.nodes ?? []).filter((r) => !r.isMinimized).map(toComment),
  };
}

let threads: Promise<Map<string, Thread>> | undefined;

/** All comment threads, keyed by discussion title (= post slug). Fetched once per build. */
export function getThreads(): Promise<Map<string, Thread>> {
  threads ??= loadThreads().catch((err) => {
    console.warn(`[comments] skipped: ${err.message}`);
    return new Map();
  });
  return threads;
}

async function loadThreads(): Promise<Map<string, Thread>> {
  const map = new Map<string, Thread>();
  if (!token) {
    console.warn('[comments] GITHUB_TOKEN not set – building without comments');
    return map;
  }
  let after: string | null = null;
  do {
    const data: any = await graphql(
      `query($owner: String!, $name: String!, $after: String) {
        repository(owner: $owner, name: $name) {
          discussions(first: 50, after: $after) {
            pageInfo { hasNextPage endCursor }
            nodes {
              title url category { name }
              comments(first: 100) {
                totalCount
                nodes {
                  author { login url } createdAt bodyHTML isMinimized
                  replies(first: 50) { nodes { author { login url } createdAt bodyHTML isMinimized } }
                }
              }
            }
          }
        }
      }`,
      { owner, name, after },
    );
    const page = data.repository.discussions;
    for (const d of page.nodes) {
      if (d.category.name !== COMMENTS.category || !d.title.startsWith(COMMENTS.prefix)) continue;
      const comments = d.comments.nodes.filter((c: RawComment) => !c.isMinimized).map(toComment);
      const count = comments.reduce((n: number, c: Comment) => n + 1 + c.replies.length, 0);
      map.set(d.title.slice(COMMENTS.prefix.length), { url: d.url, comments, count });
    }
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after);
  return map;
}

export interface RepoStats {
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: Date;
}

const repoCache = new Map<string, Promise<RepoStats | undefined>>();

/** Public stats of a GitHub repo (stars, last push). Undefined if not reachable. */
export function getRepoStats(repoUrl: string): Promise<RepoStats | undefined> {
  const m = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!m) return Promise.resolve(undefined);
  const key = `${m[1]}/${m[2]}`;
  if (!repoCache.has(key)) {
    repoCache.set(
      key,
      fetch(`https://api.github.com/repos/${key}`, {
        headers: token ? { authorization: `bearer ${token}` } : {},
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`${res.status}`);
          const r = await res.json();
          return { stars: r.stargazers_count, forks: r.forks_count, language: r.language, pushedAt: new Date(r.pushed_at) };
        })
        .catch((err) => {
          console.warn(`[repo stats] ${key} skipped: ${err.message}`);
          return undefined;
        }),
    );
  }
  return repoCache.get(key)!;
}
