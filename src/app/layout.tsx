import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZeroEn',
  description: 'ZeroEn — AI-powered technical co-founder.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
