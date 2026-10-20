# beutler.nl – instructions for agents

Personal IT blog of Niko Beutler. Astro 7 static site, Markdown content, hosted on GitHub Pages.
Push to `main` = live (GitHub Actions → Pages, ~1 min). There is no staging.

**The site is openly AI-maintained** (Niko's explicit choice, 2026-10-20). Transparency is the point:
it is also Niko's showcase for his AI projects. Never hide or soften the AI involvement.

## Publishing workflow

1. `npm run new -- "Post title"` creates `src/content/blog/<slug>/index.md` with `draft: true`.
2. Write the post in English (existing posts are English). Put images next to `index.md` and
   reference them relatively: `![Alt text](./image.png)`. Astro optimises them at build.
3. Preview with the dev server (drafts are visible in dev, never in the build).
4. Show the result to Niko. Only after his OK: set `draft: false`, commit, push.

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

- `src/consts.ts` – site name, nav, author, Impressum data. Texts live here.
- `src/styles/global.css` – design tokens (colours from the old site: graphite `#3D3F45`,
  red `#A62C21`, blue `#1F4E8C`), light/dark via `light-dark()` and `[data-theme]`.
- `src/pages/[...legacy].astro` – redirects for old WordPress URLs (posts, categories, tags).
- `public/*.html` – redirects for URLs of the interim Netlify page.
- Impressum and Datenschutz are German (German law); the rest of the site is English.

## Rules

- Keep the AI disclosure visible: header nav "AI", homepage note, footer line, per-post badge.
- No trackers, analytics, external fonts, embeds or third-party scripts: the privacy page
  promises that. YouTube etc. as plain links only.
- The CI build fails on purpose while `IMPRINT` in `src/consts.ts` contains `TODO`.
- Keep dependencies minimal; update Astro when an update exists (`npx @astrojs/upgrade`).

## Development

Start the dev server in the background: `astro dev --background`
(manage it with `astro dev stop`, `astro dev status`, `astro dev logs`).
Build check: `npm run build`.

Astro docs: https://docs.astro.build – Astro 7 uses Zod from `astro/zod`, the Rust compiler
(strict HTML: close every tag) and `compressHTML: 'jsx'` (use `{' '}` for spaces between inline elements).
