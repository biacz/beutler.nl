// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.beutler.nl',
  trailingSlash: 'always',
  // Astro 7 default 'jsx' drops line breaks between text and inline tags ("theLink"); keep spaces.
  compressHTML: true,
  // Content Security Policy as <meta> tag (GitHub Pages can't send headers). Astro hashes its own
  // inline scripts and styles. Only our own domain is allowed – the site promises no third parties.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ],
      // 'self': Pagefind's UI script in /pagefind/. 'wasm-unsafe-eval': Pagefind's search runs as WebAssembly.
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
      styleDirective: {
        resources: [
          "'self'",
          // Shiki colours code via style="--shiki-light:…" attributes. This only allows style
          // attributes; <style> elements still need Astro's hashes.
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en-GB', de: 'de-DE' } } })],
  markdown: {
    shikiConfig: {
      // Both themes are emitted as CSS variables; global.css picks one via light-dark().
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
  // Fonts are downloaded at build time and served from our own domain (no Google requests).
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Raleway',
      cssVariable: '--font-heading',
      weights: [600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
