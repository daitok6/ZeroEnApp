import type { MetadataRoute } from 'next';
import { getPostSlugs } from '@/lib/mdx/utils';

const BASE_URL = 'https://zeroen.dev';
const LOCALES = ['en', 'ja'] as const;

const MARKETING_PAGES = [
  '',
  '/how-it-works',
  '/pricing',
  '/apply',
  '/blog',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Marketing pages
  for (const page of MARKETING_PAGES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === '/apply' ? 0.9 : 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${page}`,
            ja: `${BASE_URL}/ja${page}`,
          },
        },
      });
    }
  }

  // Blog posts
  for (const locale of LOCALES) {
    const slugs = getPostSlugs(locale);
    for (const slug of slugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${BASE_URL}/en/blog/${slug}`,
            ja: `${BASE_URL}/ja/blog/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
