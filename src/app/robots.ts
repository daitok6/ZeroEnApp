import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/en/dashboard/',
          '/ja/dashboard/',
          '/en/startups',
          '/ja/startups',
          '/startups',
        ],
      },
    ],
    sitemap: 'https://zeroen.dev/sitemap.xml',
  };
}
