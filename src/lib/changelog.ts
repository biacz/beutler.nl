// The site's change history, read from git at build time (CI checks out the full history).
import { execFileSync } from 'node:child_process';

export type ChangeKind = 'ai' | 'human' | 'bot';

export interface Change {
  sha: string;
  date: Date;
  subject: string;
  kind: ChangeKind;
  /** Slugs of posts whose text changed in this commit. */
  posts: string[];
  files: number;
}

const RS = '\x1e';
const US = '\x1f';

let cache: Change[] | undefined;

/** Commits on the current branch, newest first, without merges. Empty if git isn't available. */
export function getChanges(limit = 300): Change[] {
  if (cache) return cache;
  let out = '';
  try {
    out = execFileSync(
      'git',
      [
        'log',
        '--no-merges',
        `-n${limit}`,
        `--format=${RS}%H${US}%aI${US}%an${US}%s${US}%(trailers:key=Co-authored-by,valueonly,separator=;)${US}`,
        '--name-only',
      ],
      { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
    );
  } catch (err) {
    console.warn(`[changelog] git log failed: ${(err as Error).message}`);
    return (cache = []);
  }
  cache = out
    .split(RS)
    .filter((r) => r.trim())
    .map((record) => {
      const [sha, date, author, subject, coauthors, rest = ''] = record.split(US);
      const files = rest.split('\n').map((f) => f.trim()).filter(Boolean);
      const posts = new Set<string>();
      for (const f of files) {
        const m = f.match(/^src\/content\/blog\/([^/]+)\/(index|de)\.md$/);
        if (m) posts.add(m[1]);
      }
      const kind: ChangeKind = /\[bot\]$/.test(author)
        ? 'bot'
        : /claude|anthropic/i.test(coauthors) || /claude/i.test(author)
          ? 'ai'
          : 'human';
      return { sha, date: new Date(date), subject, kind, posts: [...posts], files: files.length };
    });
  return cache;
}
