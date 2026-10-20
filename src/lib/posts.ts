import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../consts';

export type Post = CollectionEntry<'blog'>;

/** All published posts, newest first. Drafts only show up in dev. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Minutes to read, assuming ~200 words per minute. */
export function readingTime(body = ''): number {
  const words = body.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Map of tag slug -> { name, posts }, sorted by post count. */
export function groupByTag(posts: Post[]) {
  const map = new Map<string, { name: string; posts: Post[] }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      if (!map.has(slug)) map.set(slug, { name: tag, posts: [] });
      map.get(slug)!.posts.push(post);
    }
  }
  return [...map.entries()].sort((a, b) => b[1].posts.length - a[1].posts.length);
}

export const dateFormat = new Intl.DateTimeFormat(SITE.locale, { dateStyle: 'long', timeZone: 'Europe/Berlin' });

export function postUrl(post: Post): string {
  return `/blog/${post.id}/`;
}
