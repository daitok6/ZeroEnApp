import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { IBM_Plex_Mono, Syne, Murecho, DM_Sans, DM_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { routing } from '@/i18n/routing';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { GoogleAds } from '@/components/analytics/google-ads';
import { UtmCapture } from '@/components/analytics/utm-capture';
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
  weight: ['400', '500', '700'],
  variable: '--font-jp',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-logo',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zeroen.dev'),
  title: {
    default: 'ZeroEn — 前金0円。月¥5,000で、LP制作・運用・毎月の改善まで。',
    template: '%s | ZeroEn',
  },
  description:
    '元日立・元楽天エンジニアが、コーチ・コンサルタント・セラピストのランディングページを無料で制作。月¥5,000のサブスクリプションでホスティング・運用・毎月の改善まで。3日で公開。',
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

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${ibmPlexMono.variable} ${syne.variable} ${murecho.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className={locale === 'ja' ? 'font-jp' : 'font-mono'}>
        <NextIntlClientProvider messages={messages}>
          <Suspense>
            <UtmCapture />
          </Suspense>
          <MarketingShell locale={locale}>{children}</MarketingShell>
        </NextIntlClientProvider>
        <GoogleAnalytics />
        <GoogleAds />
        <Analytics />
      </body>
    </html>
  );
}
