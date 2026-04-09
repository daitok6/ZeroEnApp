import type { Metadata } from 'next';

const BASE_URL = 'https://zeroen.dev';
const SITE_NAME = 'ZeroEn';
const DEFAULT_OG_IMAGE = `${BASE_URL}/api/og?title=ZeroEn&subtitle=Free+MVP.+10%25+Equity.`;

export interface PageSEO {
  title: string;
  description: string;
  path: string;
  locale: string;
  ogTitle?: string;
  ogSubtitle?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  locale,
  ogTitle,
  ogSubtitle,
}: PageSEO): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;
  const altLocale = locale === 'en' ? 'ja' : 'en';
  const altPath = `${BASE_URL}/${altLocale}${path}`;

  const ogImageTitle = encodeURIComponent(ogTitle ?? title);
  const ogImageSubtitle = ogSubtitle ? encodeURIComponent(ogSubtitle) : '';
  const ogImageUrl = `${BASE_URL}/api/og?title=${ogImageTitle}${ogImageSubtitle ? `&subtitle=${ogImageSubtitle}` : ''}&locale=${locale}`;

  // next-intl locale format for OG (en_US / ja_JP)
  const ogLocale = locale === 'ja' ? 'ja_JP' : 'en_US';

  return {
    title: {
      default: `${title} | ${SITE_NAME}`,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${path}`,
        ja: `${BASE_URL}/ja${path}`,
        [locale]: url,
        [altLocale]: altPath,
      },
    },
  };
}

export { BASE_URL, DEFAULT_OG_IMAGE };
