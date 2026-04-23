import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'ZeroEn — Bilingual SaaS Studio, Tokyo',
  description:
    'Production-grade bilingual Next.js + Supabase + Stripe products for funded founders and serious businesses in Tokyo. Fixed price. No equity. Shipped in weeks.',
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
