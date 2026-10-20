// Site-wide settings. Interface texts (both languages) live in src/i18n.ts.
export const SITE = {
  title: 'beutler.nl',
  author: 'Niko Beutler',
  github: 'https://github.com/biacz',
  repo: 'https://github.com/biacz/beutler.nl',
};

/** The AI that maintains the site. Update when the model changes. */
export const AI = {
  name: 'Claude',
  maker: 'Anthropic',
  model: 'Claude Opus 5.5',
  tool: 'Claude Code',
  since: new Date('2026-10-20'),
};

/** Main navigation; paths are language-neutral, labels come from i18n `nav`. */
export const NAV = [
  { href: '/blog/', key: 'blog' },
  { href: '/tags/', key: 'topics' },
  { href: '/ai/', key: 'ai' },
  { href: '/about/', key: 'about' },
] as const;

/**
 * Data for the Impressum (German law, § 5 DDG / § 18 MStV). Must be a real postal address.
 * The CI build refuses to deploy while any value still contains "TODO".
 */
export const IMPRINT = {
  name: 'Nikolas-Benedikt Beutler',
  street: 'Curtiusstraße 8',
  city: '47053 Duisburg',
  country: 'Deutschland',
  email: 'nbeutler@gmail.com',
};

/** Posts older than this many years get a "may be outdated" note. */
export const OUTDATED_AFTER_YEARS = 3;
