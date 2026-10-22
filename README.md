# beutler.nl

Niko Beutler's blog about IT – [www.beutler.nl](https://www.beutler.nl).

Static site built with [Astro](https://astro.build), hosted on GitHub Pages. Posts from 2014–2022
were restored from the old WordPress blog via the Internet Archive.

```sh
npm install
npm run dev                      # local preview at http://localhost:4321
npm run new -- "My post title"   # new draft post
npm run build                    # production build into dist/ (+ search index)
npm run preview                  # serve dist/ (search and CSP only work here)
```

Push to `main` deploys automatically. Features (search, comments via GitHub Discussions, share
images, changelog, CSP) and the CI/security workflows are described in [AGENTS.md](AGENTS.md);
how to report a security problem in [SECURITY.md](SECURITY.md). Details for writing and publishing: [AGENTS.md](AGENTS.md).
