'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { LocaleSwitcher } from './locale-switcher';

export function Header() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#374151]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image src="/logo-dark.svg" alt="ZeroEn" width={100} height={28} priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href={`/${locale}/how-it-works`}
            className="text-[#9CA3AF] hover:text-[#F4F4F2] text-sm transition-colors font-mono"
          >
            {t('howItWorks')}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="text-[#9CA3AF] hover:text-[#F4F4F2] text-sm transition-colors font-mono"
          >
            {t('blog')}
          </Link>
        </nav>

        {/* Right: locale switcher + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href={`/${locale}/apply`}
            className="bg-[#00E87A] text-[#0D0D0D] text-xs font-bold px-4 py-2 rounded tracking-widest hover:bg-[#00E87A]/90 transition-colors uppercase"
          >
            {t('apply')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#F4F4F2]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-t border-[#374151] px-6 py-4 flex flex-col gap-1">
          <Link
            href={`/${locale}/how-it-works`}
            className="flex items-center min-h-[44px] text-[#F4F4F2] text-sm font-mono"
            onClick={() => setMobileOpen(false)}
          >
            {t('howItWorks')}
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="flex items-center min-h-[44px] text-[#F4F4F2] text-sm font-mono"
            onClick={() => setMobileOpen(false)}
          >
            {t('blog')}
          </Link>
          <LocaleSwitcher />
          <Link
            href={`/${locale}/apply`}
            className="flex items-center justify-center min-h-[44px] bg-[#00E87A] text-[#0D0D0D] text-xs font-bold px-4 py-3 rounded tracking-widest text-center uppercase mt-2"
            onClick={() => setMobileOpen(false)}
          >
            {t('apply')}
          </Link>
        </div>
      )}
    </header>
  );
}
