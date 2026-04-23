import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { IBM_Plex_Mono, Syne, Murecho, DM_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { GoogleAds } from '@/components/analytics/google-ads';
import '../globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const murecho = Murecho({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jp',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-logo',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zeroen.dev'),
  title: {
    default: 'ZeroEn — Bilingual SaaS Studio, Tokyo',
    template: '%s | ZeroEn',
  },
  description:
    'Production-grade bilingual Next.js + Supabase + Stripe products for funded founders and serious businesses in Tokyo. Fixed price. No equity. Shipped in weeks.',
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ja' }];
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ja')) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={`${ibmPlexMono.variable} ${syne.variable} ${murecho.variable} ${dmSans.variable}`}
    >
      <body className={locale === 'ja' ? 'font-jp' : 'font-mono'}>
        {children}
        <GoogleAnalytics />
        <GoogleAds />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
