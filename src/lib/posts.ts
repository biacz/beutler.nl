import { getCollection, type CollectionEntry } from 'astro:content';
import { localize, type Lang } from '../i18n';

export type Post = CollectionEntry<'blog'>;
export type Project = CollectionEntry<'projects'>;

// English post: blog/<slug>/index.md (id "<slug>"); German: blog/<slug>/de.md (id "<slug>/de").
export const postLang = (p: Post): Lang => (p.id.endsWith('/de') ? 'de' : 'en');
export const postSlug = (p: Post): string => p.id.replace(/\/de$/, '');

/** Published posts of one language, newest first. Drafts only show up in dev. */
export async function getPosts(lang: Lang = 'en'): Promise<Post[]> {
  const posts = await getCollection(
    'blog',
    (p) => postLang(p) === lang && (import.meta.env.DEV || !p.data.draft),
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postUrl(post: Post): string {
  return localize(`/blog/${postSlug(post)}/`, postLang(post));
}

// English project: projects/<slug>.md; German: projects/de/<slug>.md.
export async function getProjects(lang: Lang = 'en'): Promise<Project[]> {
  const all = await getCollection('projects', (p) => (lang === 'de') === p.id.startsWith('de/'));
  return all.sort((a, b) => a.data.order - b.data.order);
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
