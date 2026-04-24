import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'ZeroEn — Bilingual SaaS. Fixed price. Shipped in weeks.',
  description:
    'Production-grade bilingual Next.js + Supabase + Stripe for funded founders in Tokyo. ¥380k Starter · ¥880k Growth · ¥1.5M+ MVP Build. No equity.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
