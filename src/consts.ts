// Site-wide settings. Change names, texts and links here, not in the components.
export const SITE = {
  title: 'beutler.nl',
  author: 'Niko Beutler',
  tagline: 'A blog about IT',
  description:
    'Niko Beutler’s blog about IT: PowerShell, VMware, Azure, Linux, homelab – and the occasional FPV drone.',
  lang: 'en',
  locale: 'en-GB',
  github: 'https://github.com/biacz',
};

export const NAV = [
  { href: '/blog/', label: 'Blog' },
  { href: '/tags/', label: 'Topics' },
  { href: '/about/', label: 'About' },
];

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
