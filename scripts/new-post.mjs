// Create a new draft post: npm run new -- "My post title"
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new -- "My post title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/ä/g, 'ae')
  .replace(/ö/g, 'oe')
  .replace(/ü/g, 'ue')
  .replace(/ß/g, 'ss')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const dir = `src/content/blog/${slug}`;
if (existsSync(dir)) {
  console.error(`${dir} already exists.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
mkdirSync(dir, { recursive: true });
writeFileSync(
  `${dir}/index.md`,
  `---
title: ${JSON.stringify(title)}
description: "One or two sentences for the post list, search results and link previews."
pubDate: ${today}
tags: []
# human | ai-assisted | ai-written – who wrote the text (shown on the post)
authorship: ai-written
draft: true
---

<!-- Images go next to this file and are linked like this: ![Alt text](./photo.jpg) -->

Write here.
`,
);
console.log(`Created ${dir}/index.md (draft). Preview with: npm run dev`);
