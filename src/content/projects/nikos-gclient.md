---
title: "Nikos GClient"
summary: "My own Gmail client, a private tool on my home server. AI sorts my mail, finds appointments and tasks, and drafts replies when I ask, but only I can send."
started: 2026-10-16
status: live
stack: ["Claude Code", "Claude Haiku", "TypeScript", "Hono", "React", "SQLite", "Gmail API"]
post: "i-built-my-own-mail-client-in-two-weeks"
order: 3
---

It started as an AI-sorted Kanban board for my inbox. The sorting worked quickly, but a tidy inbox still left me working
out what needed me today, so the start page now answers "what do I have to do?". The one rule never changed: the model
returns text, and a mail only leaves after a click on "Send it" and ten seconds to undo. It's private, so there's no
download or repository to look at.
