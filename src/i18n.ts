// Languages: English lives at /, German under /de/. All interface texts are here.

export const LANGS = ['en', 'de'] as const;
export type Lang = (typeof LANGS)[number];

export const LOCALE: Record<Lang, string> = { en: 'en-GB', de: 'de-DE' };

/** '/blog/' + 'de' → '/de/blog/' */
export function localize(path: string, lang: Lang): string {
  return lang === 'de' ? `/de${path}` : path;
}

/** '/de/blog/' → '/blog/' */
export function unlocalize(pathname: string): string {
  return pathname.replace(/^\/de(?=\/|$)/, '') || '/';
}

export function langFromPath(pathname: string): Lang {
  return /^\/de(\/|$)/.test(pathname) ? 'de' : 'en';
}

const dateFormats = Object.fromEntries(
  LANGS.map((l) => [l, new Intl.DateTimeFormat(LOCALE[l], { dateStyle: 'long', timeZone: 'Europe/Berlin' })]),
) as Record<Lang, Intl.DateTimeFormat>;
const monthFormats = Object.fromEntries(
  LANGS.map((l) => [l, new Intl.DateTimeFormat(LOCALE[l], { month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' })]),
) as Record<Lang, Intl.DateTimeFormat>;

export const formatDate = (d: Date, lang: Lang) => dateFormats[lang].format(d);
export const formatMonth = (d: Date, lang: Lang) => monthFormats[lang].format(d);

/** Tag names are stored in English; these get a German label. */
const TAG_DE: Record<string, string> = {
  'FPV & Drones': 'FPV & Drohnen',
  'Mail Server': 'Mailserver',
  Personal: 'Persönliches',
  Automation: 'Automatisierung',
  AI: 'KI',
};
export const tagLabel = (tag: string, lang: Lang) => (lang === 'de' ? (TAG_DE[tag] ?? tag) : tag);

export type Authorship = 'human' | 'ai-assisted' | 'ai-written';

export const UI = {
  en: {
    tagline: 'A blog about IT – maintained by AI',
    description:
      'Niko Beutler’s blog about IT: PowerShell, VMware, Azure, Linux, homelab and AI projects. Since 2026 openly built and maintained by AI (Claude) together with Niko.',
    nav: { blog: 'Blog', topics: 'Topics', ai: 'AI', about: 'About' },
    skip: 'Skip to content',
    toggleTheme: 'Toggle dark mode',
    language: 'Language',
    homeLabel: 'home',
    footerAi: 'Built and maintained by AI (Claude) with Niko.',
    howItWorks: 'How this works',
    minRead: (n: number) => `${n} min read`,
    draft: 'Draft',
    topics: 'Topics',
    authorship: {
      human: { short: 'Human-written', long: 'Written by Niko.' },
      'ai-assisted': { short: 'AI-assisted', long: 'Written by Niko with help from AI (Claude).' },
      'ai-written': {
        short: 'AI-written',
        long: 'Written by AI (Claude) from Niko’s input, reviewed and approved by Niko.',
      },
    } satisfies Record<Authorship, { short: string; long: string }>,
    translated: { short: 'AI-translated', long: 'Translated by AI (Claude).' },
    home: {
      hi: 'Hi, I’m Niko.',
      lead: 'I write down what I figure out along the way: PowerShell and PowerCLI scripts, VMware, Azure, Linux servers, and whatever else I’m tinkering with. Some of it dates back to 2014 – it’s all still here.',
      aiNoteStrong: 'Heads up: this blog is maintained by AI.',
      aiNote: 'Since October 2026, Claude builds and runs this site and writes posts with me. Every post is labeled.',
      aiNoteLink: 'What that means →',
      latest: 'Latest posts',
      allPosts: (n: number) => `All ${n} posts →`,
      allTopics: 'All topics →',
    },
    blog: {
      title: 'Blog',
      description: 'All posts on beutler.nl, newest first.',
      intro: (n: number) => `${n} posts since 2014, newest first.`,
    },
    tags: {
      title: 'Topics',
      description: 'All topics on beutler.nl.',
      intro: (n: number) => `${n} topics, most-used first.`,
      eyebrow: 'Topic',
      pageTitle: (name: string) => `Posts about ${name}`,
      pageDescription: (name: string) => `All posts on beutler.nl about ${name}.`,
      count: (n: number) => `${n} ${n === 1 ? 'post' : 'posts'}`,
      all: 'all topics',
    },
    post: {
      updated: 'updated',
      contents: 'Contents',
      older: '← Older',
      newer: 'Newer →',
      more: 'More posts',
      howMade: 'How this site is made →',
      restored: (year: number) =>
        `on the old WordPress blog. Restored by AI from the Internet Archive in 2026 – the text is as written back then; only formatting, tags and dead links were touched.`,
      restoredStrong: (year: number) => `Written by Niko in ${year}`,
      outdated: ' Versions, links and best practices may have changed since.',
      translatedNote: '',
      copy: 'Copy',
      copied: 'Copied ✓',
      failed: 'Failed',
    },
    notFound: {
      title: 'Not found',
      heading: 'This page doesn’t exist (anymore).',
    },
  },
  de: {
    tagline: 'Ein Blog über IT – gepflegt von KI',
    description:
      'Niko Beutlers Blog über IT: PowerShell, VMware, Azure, Linux, Homelab und KI-Projekte. Seit 2026 offen von KI (Claude) gemeinsam mit Niko gebaut und gepflegt.',
    nav: { blog: 'Blog', topics: 'Themen', ai: 'KI', about: 'Über mich' },
    skip: 'Zum Inhalt springen',
    toggleTheme: 'Dunkelmodus umschalten',
    language: 'Sprache',
    homeLabel: 'Startseite',
    footerAi: 'Gebaut und gepflegt von KI (Claude) zusammen mit Niko.',
    howItWorks: 'So funktioniert das',
    minRead: (n: number) => `${n} Min. Lesezeit`,
    draft: 'Entwurf',
    topics: 'Themen',
    authorship: {
      human: { short: 'Von Niko geschrieben', long: 'Von Niko geschrieben.' },
      'ai-assisted': { short: 'KI-unterstützt', long: 'Von Niko geschrieben, mit Hilfe von KI (Claude).' },
      'ai-written': {
        short: 'KI-geschrieben',
        long: 'Von KI (Claude) nach Nikos Vorgaben geschrieben, von Niko geprüft und freigegeben.',
      },
    } satisfies Record<Authorship, { short: string; long: string }>,
    translated: { short: 'KI-übersetzt', long: 'Von KI (Claude) aus dem Englischen übersetzt.' },
    home: {
      hi: 'Hallo, ich bin Niko.',
      lead: 'Hier schreibe ich auf, was ich unterwegs herausfinde: PowerShell- und PowerCLI-Skripte, VMware, Azure, Linux-Server und alles, woran ich sonst gerade bastle. Manches stammt noch aus 2014 – es ist alles noch da.',
      aiNoteStrong: 'Vorweg: Dieser Blog wird von KI gepflegt.',
      aiNote: 'Seit Oktober 2026 baut und betreibt Claude diese Seite und schreibt Beiträge mit mir. Jeder Beitrag ist gekennzeichnet.',
      aiNoteLink: 'Was das bedeutet →',
      latest: 'Neueste Beiträge',
      allPosts: (n: number) => `Alle ${n} Beiträge →`,
      allTopics: 'Alle Themen →',
    },
    blog: {
      title: 'Blog',
      description: 'Alle Beiträge auf beutler.nl, die neuesten zuerst.',
      intro: (n: number) => `${n} Beiträge seit 2014, die neuesten zuerst.`,
    },
    tags: {
      title: 'Themen',
      description: 'Alle Themen auf beutler.nl.',
      intro: (n: number) => `${n} Themen, die häufigsten zuerst.`,
      eyebrow: 'Thema',
      pageTitle: (name: string) => `Beiträge zu ${name}`,
      pageDescription: (name: string) => `Alle Beiträge auf beutler.nl zum Thema ${name}.`,
      count: (n: number) => `${n} ${n === 1 ? 'Beitrag' : 'Beiträge'}`,
      all: 'alle Themen',
    },
    post: {
      updated: 'aktualisiert',
      contents: 'Inhalt',
      older: '← Älter',
      newer: 'Neuer →',
      more: 'Weitere Beiträge',
      howMade: 'Wie diese Seite entsteht →',
      restored: (year: number) =>
        `für den alten WordPress-Blog. 2026 von KI aus dem Internet Archive wiederhergestellt und ins Deutsche übersetzt – inhaltlich wie damals geschrieben; nur Formatierung, Tags und tote Links wurden angepasst.`,
      restoredStrong: (year: number) => `Von Niko ${year} auf Englisch geschrieben`,
      outdated: ' Versionen, Links und Best Practices können sich seitdem geändert haben.',
      translatedNote: ' Die deutsche Fassung ist eine KI-Übersetzung des englischen Originals.',
      copy: 'Kopieren',
      copied: 'Kopiert ✓',
      failed: 'Fehler',
    },
    notFound: {
      title: 'Nicht gefunden',
      heading: 'Diese Seite gibt es nicht (mehr).',
    },
  },
} as const;

export const t = (lang: Lang) => UI[lang];
