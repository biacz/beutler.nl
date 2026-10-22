// schema.org building blocks for JSON-LD (search engines read these; nothing visible on the page).
import { AI, SITE } from '../consts';
import { localize, LOCALE, type Lang } from '../i18n';
import { postLang, postSlug, postUrl, type Post } from './posts';

export const personLd = (site: URL) => ({
  '@type': 'Person',
  name: SITE.author,
  url: new URL('/about/', site).href,
  sameAs: [SITE.github],
});

/** BlogPosting for a post. AI involvement is stated, not hidden: Claude appears as contributor. */
export function postLd(post: Post, site: URL, image: string) {
  const lang: Lang = postLang(post);
  const { title, description, pubDate, updatedDate, tags, authorship, translation } = post.data;
  const url = new URL(postUrl(post), site).href;
  const ai = {
    '@type': 'SoftwareApplication',
    name: `${AI.name} (${AI.model})`,
    applicationCategory: 'AI assistant',
    creator: { '@type': 'Organization', name: AI.maker },
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    inLanguage: LOCALE[lang],
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    image: new URL(image, site).href,
    keywords: tags.join(', '),
    author: personLd(site),
    publisher: personLd(site),
    isAccessibleForFree: true,
    ...(authorship !== 'human' || translation ? { contributor: ai } : {}),
    ...(translation
      ? {
          translationOfWork: { '@id': new URL(localize(`/blog/${postSlug(post)}/`, 'en'), site).href },
          translator: ai,
        }
      : {}),
  };
}
