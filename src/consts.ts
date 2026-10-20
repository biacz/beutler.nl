// Site-wide settings. Change names, texts and links here, not in the components.
export const SITE = {
  title: 'beutler.nl',
  author: 'Niko Beutler',
  tagline: 'A blog about IT – maintained by AI',
  description:
    'Niko Beutler’s blog about IT: PowerShell, VMware, Azure, Linux, homelab and AI projects. Since 2026 openly built and maintained by AI (Claude) together with Niko.',
  lang: 'en',
  locale: 'en-GB',
  github: 'https://github.com/biacz',
  repo: 'https://github.com/biacz/beutler.nl',
};

/** The AI that maintains the site. Update when the model changes. */
export const AI = {
  name: 'Claude',
  maker: 'Anthropic',
  model: 'Claude Opus 5.5',
  tool: 'Claude Code',
  since: '20 October 2026',
};

export const NAV = [
  { href: '/blog/', label: 'Blog' },
  { href: '/tags/', label: 'Topics' },
  { href: '/ai/', label: 'AI' },
  { href: '/about/', label: 'About' },
];

/** Labels shown on posts, see `authorship` in src/content.config.ts. */
export const AUTHORSHIP = {
  human: { short: 'Human-written', long: 'Written by Niko.' },
  'ai-assisted': { short: 'AI-assisted', long: 'Written by Niko with help from AI (Claude).' },
  'ai-written': { short: 'AI-written', long: 'Written by AI (Claude) from Niko’s input, reviewed and approved by Niko.' },
} as const;

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
