# beutler.nl – instructions for agents

Personal IT blog of Niko Beutler. Astro 7 static site, Markdown content, hosted on GitHub Pages.
Push to `main` = live (GitHub Actions → Pages, ~1 min). There is no staging.

**The site is openly AI-maintained** (Niko's explicit choice, 2026-10-20). Transparency is the point:
it is also Niko's showcase for his AI projects. Never hide or soften the AI involvement.

## Publishing workflow

1. `npm run new -- "Post title"` creates `src/content/blog/<slug>/index.md` with `draft: true`.
2. Write the post in English first (the original). Put images next to `index.md` and
   reference them relatively: `![Alt text](./image.png)`. Astro optimises them at build.
3. Preview with the dev server (drafts are visible in dev, never in the build).
4. Show the result to Niko. Only after his OK: set `draft: false`, commit, push.
5. Every post exists in **both languages**: English `index.md` + German `de.md` in the same folder
   (same images). The German file copies the frontmatter (without `legacyUrl`), translates
   `title`/`description`/text, keeps code blocks unchanged and adds `translation: ai`.
   Write German with "du", in Niko's voice. Project cards: `projects/<slug>.md` + `projects/de/<slug>.md`.

Frontmatter fields (schema in `src/content.config.ts`): `title`, `description` (1–2 sentences,
used in lists, RSS and link previews), `pubDate`, optional `updatedDate`, `tags`, **`authorship`**
(required), `cover` + `coverAlt`, `draft`, `legacyUrl`.

### Authorship label – be honest

- `ai-written`: AI wrote the text from Niko's input; Niko reviewed it. Default for new posts.
- `ai-assisted`: Niko wrote it himself, AI helped (editing, code samples, structure).
- `human`: Niko wrote it without AI. All restored 2014–2022 posts. Never change those.
- When unsure, pick the label with more AI, not less.
- If the AI model changes, update `AI` in `src/consts.ts` (shown on `/ai/`).

### AI projects showcase

`src/content/projects/<slug>.md` → listed on `/ai/`. Only add a project after Niko said it may be
public. Never publish internal details: IPs, hostnames, ports, tokens, home network layout,
family names.

### Writing conventions

- Reuse existing tag names (see `/tags/`), e.g. `PowerShell`, `Azure`, `Linux`, `FPV & Drones`.
- Code blocks always with a language (`powershell`, `bash`, `json`, …) – Shiki highlights them.
- Never change a published post's folder name: it is the URL.
- `legacyUrl` = the post's path on the old WordPress blog; it generates a redirect page.
  Only restored posts have it. Do not add it to new posts.

## Structure

- `src/consts.ts` – site name, nav, author, AI model, Impressum data. Interface texts: `src/i18n.ts`.
- `src/styles/global.css` – design tokens (colours from the old site: graphite `#3D3F45`,
  red `#A62C21`, blue `#1F4E8C`), light/dark via `light-dark()` and `[data-theme]`.
- `src/pages/[...legacy].astro` – redirects for old WordPress URLs (posts, categories, tags).
- `public/*.html` – redirects for URLs of the interim Netlify page.
- Bilingual: English at `/`, German under `/de/`. Interface texts for both languages are in
  `src/i18n.ts`; page layouts are in `src/views/` (one view, two thin route files in `src/pages/`
  and `src/pages/de/`). The header switch links to the same page in the other language.
- Impressum and Datenschutz exist only in German (German law), at `/impressum/` and `/datenschutz/`.

## Built-in features (since 2026-10-22)

- **Search** (`/search/`, `/de/search/`): Pagefind indexes the built HTML after `astro build`
  (`npm run build` runs both). Only post bodies are indexed (`data-pagefind-body` in `PostView`);
  tags are a filter. Works only after a build: use `npm run preview`, not `npm run dev`.
- **Share images**: `src/pages/og/[...slug].png.ts` renders a 1200×630 PNG per post and language
  (satori + sharp, fonts from `@fontsource` WOFF files). Nothing to do per post.
- **Comments**: one GitHub Discussion per post in category `COMMENTS.category` (`src/consts.ts`),
  titled `blog/<slug>`, shared by both languages. The deploy workflow creates missing threads
  (`scripts/sync-discussions.mjs`) and rebuilds on every new comment. Comments are fetched at build
  time (`src/lib/github.ts`) and rendered as static HTML: no avatars, no images, no GitHub requests
  from readers. Moderate on GitHub: hidden ("minimized") comments are not shown.
  Never rename a post discussion's title – it links the thread to the post.
- **Changelog** (`/changelog/`): generated from `git log` at build time. Commits with a
  `Co-Authored-By: Claude` trailer are shown as AI – so **always keep that trailer** on AI commits.
- **Project stats** on `/ai/`: stars and last change of each project's `repo`, fetched at build time.
- **JSON-LD** (`src/lib/seo.ts`): BlogPosting per post, WebSite on the home page. AI involvement is
  stated there too (`contributor` / `translator`).
- **Content Security Policy** (`security.csp` in `astro.config.mjs`), as a meta tag: only this
  domain; Astro hashes its inline scripts and styles. Consequences: no inline event handlers
  (`onclick=`), no external scripts/styles/fonts/images, no `<ClientRouter />`. Check the browser
  console after `npm run preview` (CSP is not active in `npm run dev`).

Build-time GitHub data needs `GITHUB_TOKEN` (CI sets it). Locally:
`GITHUB_TOKEN=$(gh auth token) npm run build` – without it, comments and stats are left out.

## CI/CD and security (GitHub Actions, all free for public repos)

- `deploy.yml`: push to `main`, daily at 04:17 UTC, and on every discussion comment → build + Pages.
- `ci.yml` (pull requests): build, internal link check (lychee), Lighthouse (accessibility/SEO
  must stay ≥ 95), ZAP baseline DAST against the built site, dependency review.
- `codeql.yml` (SAST), `zizmor.yml` (workflow security), `scorecard.yml` (OpenSSF Scorecard):
  results under Security → Code scanning.
- `weekly-checks.yml` (Mondays): external links in posts → issue "Broken links"; ZAP scan of the
  live site → issue "ZAP report (live site)".
- `.github/dependabot.yml`: weekly update PRs for npm and actions.
- `.zap/rules.tsv`: ZAP findings GitHub Pages can't fix (headers) are ignored; cookies and
  cross-domain scripts **fail** the check – they would break the privacy promise.
- All actions are pinned to a commit SHA with the version as comment; Dependabot updates both.
  Workflows use `permissions: {}` at the top and grant per job.

Work on a branch and open a pull request for anything beyond a post: CI only runs on PRs.

## Rules

- Keep the AI disclosure visible: header nav "AI", homepage note, footer line, per-post badge.
- No trackers, analytics, external fonts, embeds or third-party scripts: the privacy page
  promises that (and the CSP and the ZAP scan enforce it). YouTube etc. as plain links only.
- A new feature that processes visitor data (even indirectly, like comments) needs a section in
  `src/pages/datenschutz.astro`.
- The CI build fails on purpose while `IMPRINT` in `src/consts.ts` contains `TODO`.
- Keep dependencies minimal; update Astro when an update exists (`npx @astrojs/upgrade`).

## Development

Start the dev server in the background: `astro dev --background`
(manage it with `astro dev stop`, `astro dev status`, `astro dev logs`).
Build check: `npm run build`.

Astro docs: https://docs.astro.build – Astro 7 uses Zod from `astro/zod`, the Rust compiler
(strict HTML: close every tag) and `compressHTML: 'jsx'` (use `{' '}` for spaces between inline elements).
