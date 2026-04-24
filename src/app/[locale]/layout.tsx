import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Space_Grotesk, JetBrains_Mono, Noto_Sans_JP } from 'next/font/google';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { GoogleAds } from '@/components/analytics/google-ads';
import '../globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zeroen.dev'),
  title: {
    default: 'ZeroEn — Bilingual SaaS. Fixed price. Shipped in weeks.',
    template: '%s | ZeroEn',
  },
  description:
    'Production-grade bilingual Next.js + Supabase + Stripe for funded founders in Tokyo. ¥380k Starter · ¥880k Growth · ¥1.5M+ MVP Build. No equity.',
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${notoSansJP.variable}`}
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
