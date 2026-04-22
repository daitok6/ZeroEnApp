import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'ZeroEn — 前金0円。月¥10,000で、LP制作・運用・毎月の改善まで。',
  description:
    '元日立・元楽天エンジニアが、コーチ・コンサルタント・セラピストのランディングページを無料で制作。月¥10,000のサブスクリプションでホスティング・運用・毎月の改善まで。3日で公開。',
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
