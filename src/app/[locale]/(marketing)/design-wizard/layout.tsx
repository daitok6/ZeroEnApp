import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';

export const metadata: Metadata = {
  title: 'Design Wizard — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DesignWizardLayout({ children, params }: Props) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Header: brand mark + locale switcher */}
      <header className="w-full px-4 sm:px-8 py-5 border-b border-[#1F2937] flex items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="inline-block text-[#00E87A] text-xs font-mono uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          ZeroEn
        </Link>
        <LocaleSwitcher />
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
