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
      cover: image().optional(),
      coverAlt: z.string().optional(),
      // Drafts are visible in `npm run dev` but never built for the live site.
      draft: z.boolean().default(false),
      // Path on the old WordPress blog (e.g. /2014/09/22/slug/); gets a redirect to the new URL.
      legacyUrl: z.string().optional(),
    }),
});

export const collections = { blog };
