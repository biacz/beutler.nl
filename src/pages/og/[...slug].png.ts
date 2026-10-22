// Share image (Open Graph, 1200×630) for every post, generated at build time: /og/<slug>.png and
// /og/<slug>/de.png. satori lays out the card as SVG (text becomes paths), sharp turns it into PNG.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import satori from 'satori';
import sharp from 'sharp';
import { formatDate, t, tagLabel } from '../../i18n';
import { getPosts, postLang, type Post } from '../../lib/posts';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = [...(await getPosts('en')), ...(await getPosts('de'))];
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
};

// satori needs TTF/OTF/WOFF (not WOFF2); Fontsource ships WOFF next to WOFF2.
const font = (pkg: string, file: string) => readFile(`node_modules/@fontsource/${pkg}/files/${file}`);
const fonts = Promise.all([
  font('raleway', 'raleway-latin-800-normal.woff'),
  font('inter', 'inter-latin-400-normal.woff'),
  font('inter', 'inter-latin-600-normal.woff'),
]).then(([raleway, inter400, inter600]) => [
  { name: 'Raleway', data: raleway, weight: 800 as const, style: 'normal' as const },
  { name: 'Inter', data: inter400, weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: inter600, weight: 600 as const, style: 'normal' as const },
]);

// Minimal hyperscript for satori's React-like element objects.
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
});

function card(post: Post): Node {
  const lang = postLang(post);
  const ui = t(lang);
  const { title, pubDate, tags, authorship, translation } = post.data;
  const size = title.length > 70 ? 52 : title.length > 45 ? 62 : 72;
  const ai = authorship !== 'human';
  const label = ui.authorship[authorship].short + (translation ? ` · ${ui.translated.short}` : '');

  return h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#3d3f45',
      color: '#fff',
      fontFamily: 'Inter',
    },
    // Accent stripe in the old site's red and blue.
    h('div', { display: 'flex', height: 14 }, h('div', { flex: 3, background: '#a62c21' }, ''), h('div', { flex: 2, background: '#1f4e8c' }, '')),
    h(
      'div',
      { display: 'flex', flexDirection: 'column', flex: 1, padding: '56px 72px 60px' },
      h(
        'div',
        { display: 'flex', fontFamily: 'Raleway', fontSize: 40, fontWeight: 800, letterSpacing: -1 },
        'beutler',
        h('span', { color: '#e0544a' }, '.'),
        h('span', { color: '#8db4ec' }, 'nl'),
      ),
      h(
        'div',
        {
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          fontFamily: 'Raleway',
          fontSize: size,
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: -1.5,
        },
        title,
      ),
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: 20, fontSize: 26, color: '#c9cacd' },
        h('span', {}, formatDate(pubDate, lang)),
        h(
          'span',
          {
            display: 'flex',
            padding: '4px 18px',
            borderRadius: 999,
            border: `2px solid ${ai ? '#8db4ec' : '#7d8088'}`,
            color: ai ? '#8db4ec' : '#e5e5e5',
            fontWeight: 600,
            fontSize: 24,
          },
          label,
        ),
        ...(tags.length ? [h('span', {}, tags.slice(0, 3).map((x) => tagLabel(x, lang)).join(' · '))] : []),
      ),
    ),
  );
}

export const GET: APIRoute = async ({ props }) => {
  const svg = await satori(card(props.post as Post) as any, { width: 1200, height: 630, fonts: await fonts });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'content-type': 'image/png' } });
};
