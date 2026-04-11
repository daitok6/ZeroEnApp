import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { IBM_Plex_Mono, Syne, Murecho, DM_Sans, DM_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { MarketingShell } from '@/components/layout/marketing-shell';
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
    default: "ZeroEn — Free MVP. 10% Equity. Your AI Technical Co-Founder.",
    template: '%s | ZeroEn',
  },
  description:
    'ZeroEn builds free MVPs for founders in exchange for equity. No upfront cost. No hourly billing. We become your technical co-founder.',
};

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
          <MarketingShell locale={locale}>{children}</MarketingShell>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
