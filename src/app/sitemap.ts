import type { MetadataRoute } from 'next';

const BASE_URL = 'https://zeroen.dev';
const LOCALES = ['en', 'ja'] as const;

const MARKETING_PAGES = [
  '',
  '/pricing',
  '/how-it-works',
  '/startups',
  '/cases',
  '/about',
  '/book',
  '/terms',
  '/privacy',
  '/tokushoho',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of MARKETING_PAGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === '/pricing' ? 0.9 : 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${page}`,
            ja: `${BASE_URL}/ja${page}`,
          },
        },
      });
    }
  }

  // English-only pilot landing page — no ja equivalent, so it's added
  // separately instead of through the locale loop above.
  entries.push({
    url: `${BASE_URL}/en/meta-ads-audit`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  });

  return entries;
}
