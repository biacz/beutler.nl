import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One folder per post: src/content/blog/<slug>/index.md (+ images next to it).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      // Who wrote the text. Required on purpose, so no post goes out unlabeled.
      //   human       – written by Niko (all restored 2014–2022 posts)
      //   ai-assisted – Niko wrote it, AI helped (editing, code, structure)
      //   ai-written  – AI wrote it from Niko's input, Niko reviewed it
      authorship: z.enum(['human', 'ai-assisted', 'ai-written']),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      // Drafts are visible in `npm run dev` but never built for the live site.
      draft: z.boolean().default(false),
      // Path on the old WordPress blog (e.g. /2014/09/22/slug/); gets a redirect to the new URL.
      legacyUrl: z.string().optional(),
    }),
});

// AI projects showcase, shown on /ai/. One file per project: src/content/projects/<slug>.md
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    started: z.coerce.date(),
    status: z.enum(['live', 'in progress', 'experiment', 'retired']),
    stack: z.array(z.string()).default([]),
    link: z.url().optional(),
    repo: z.url().optional(),
    // Related blog post id (folder name), if there is a write-up.
    post: z.string().optional(),
    order: z.number().default(100),
  }),
});

export const collections = { blog, projects };
