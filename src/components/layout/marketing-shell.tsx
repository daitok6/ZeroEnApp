'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';

export function MarketingShell({ locale, children }: { locale: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppScreen = pathname.includes('/dashboard') || pathname.includes('/admin');

  if (isAppScreen) return <>{children}</>;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer locale={locale} />
    </>
  );
}
