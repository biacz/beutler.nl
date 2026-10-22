// Creates a GitHub Discussion for every published post that doesn't have one yet (comment thread).
// Runs in the deploy workflow before the build. Never edits or deletes anything.
// Usage: GITHUB_TOKEN=… GITHUB_REPOSITORY=owner/name node scripts/sync-discussions.mjs
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const SITE = 'https://www.beutler.nl';
const CATEGORY = 'Announcements'; // keep in sync with COMMENTS in src/consts.ts
const PREFIX = 'blog/';

const token = process.env.GITHUB_TOKEN;
const [owner, name] = (process.env.GITHUB_REPOSITORY ?? 'biacz/beutler.nl').split('/');
if (!token) {
  console.log('GITHUB_TOKEN not set – nothing to do.');
  process.exit(0);
}

async function graphql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`${res.status} ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}

// Published English posts (index.md) – German translations share the thread.
const dir = 'src/content/blog';
const posts = [];
for (const slug of await readdir(dir)) {
  let text;
  try {
    text = await readFile(join(dir, slug, 'index.md'), 'utf8');
  } catch {
    continue;
  }
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  if (/^draft:\s*true\s*$/m.test(fm)) continue;
  const title = fm.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1] ?? slug;
  posts.push({ slug, title });
}

const repo = await graphql(
  `query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id hasDiscussionsEnabled
      discussionCategories(first: 25) { nodes { id name } }
    }
  }`,
  { owner, name },
);
const r = repo.repository;
if (!r.hasDiscussionsEnabled) {
  console.log('Discussions are disabled for this repo – skipping.');
  process.exit(0);
}
const category = r.discussionCategories.nodes.find((c) => c.name === CATEGORY);
if (!category) {
  console.log(`Discussion category "${CATEGORY}" not found – skipping.`);
  process.exit(0);
}

const existing = new Set();
let after = null;
do {
  const data = await graphql(
    `query($owner: String!, $name: String!, $cat: ID!, $after: String) {
      repository(owner: $owner, name: $name) {
        discussions(first: 100, after: $after, categoryId: $cat) {
          pageInfo { hasNextPage endCursor }
          nodes { title }
        }
      }
    }`,
    { owner, name, cat: category.id, after },
  );
  const page = data.repository.discussions;
  for (const d of page.nodes) existing.add(d.title);
  after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
} while (after);

let created = 0;
for (const { slug, title } of posts) {
  const key = PREFIX + slug;
  if (existing.has(key)) continue;
  const body = [
    `Comments on **[${title}](${SITE}/blog/${slug}/)** ([Deutsch](${SITE}/de/blog/${slug}/)).`,
    '',
    'Replies here show up under the post on beutler.nl within a few minutes.',
    '<!-- Created automatically by scripts/sync-discussions.mjs – the title links this thread to the post. -->',
  ].join('\n');
  try {
    await graphql(
      `mutation($repo: ID!, $cat: ID!, $title: String!, $body: String!) {
        createDiscussion(input: { repositoryId: $repo, categoryId: $cat, title: $title, body: $body }) { discussion { url } }
      }`,
      { repo: r.id, cat: category.id, title: key, body },
    );
  } catch (err) {
    console.log(`::warning::could not create discussion ${key}: ${err.message}`);
    continue;
  }
  created++;
  console.log(`created discussion ${key}`);
  // GitHub's secondary rate limit dislikes bursts of content creation.
  await new Promise((r) => setTimeout(r, 1500));
}
console.log(`${posts.length} posts, ${existing.size} threads existed, ${created} created.`);
