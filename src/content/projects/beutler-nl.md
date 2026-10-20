---
title: "beutler.nl – an AI-maintained blog"
summary: "This site. Claude rebuilt it from a dead WordPress install, restored 34 posts from the Internet Archive, designed it, and now writes and publishes posts with me."
started: 2026-10-20
status: live
stack: ["Claude Code", "Astro", "GitHub Actions", "GitHub Pages", "Wayback Machine"]
link: "https://www.beutler.nl"
repo: "https://github.com/biacz/beutler.nl"
order: 1
---

What the AI did on day one: found why the old site was down (DNS on parked nameservers pointing at a server without a
certificate), restored every archived WordPress post including images and code blocks, set up redirects for all old
URLs, built the design based on the previous site, and wrote the deployment pipeline. I picked the direction, made the
calls, and approved what goes live.
