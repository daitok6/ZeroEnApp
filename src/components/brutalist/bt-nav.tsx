'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const CAL_URL: Record<string, string> = {
  ja: 'https://cal.com/zeroen/scoping-call-ja',
  en: 'https://cal.com/zeroen/scoping-call',
};

const NAV_LINKS = {
  en: [
    { href: '/',            label: 'Home' },
    { href: '/pricing',     label: 'Pricing' },
    { href: '/how-it-works',label: 'How it works' },
    { href: '/startups',    label: 'Startups' },
    { href: '/cases',       label: 'Cases' },
    { href: '/about',       label: 'About' },
  ],
  ja: [
    { href: '/',            label: 'ホーム' },
    { href: '/pricing',     label: '料金' },
    { href: '/how-it-works',label: '進め方' },
    { href: '/startups',    label: 'スタートアップ' },
    { href: '/cases',       label: '実績' },
    { href: '/about',       label: '私について' },
  ],
};

export function BTNav() {
  const locale = useLocale() as 'en' | 'ja';
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = NAV_LINKS[locale];

  const ctaLabel = locale === 'ja' ? 'スコープ通話を予約 →' : 'BOOK SCOPING CALL →';
  const breadcrumb = '/' + (pathname === '/' ? (locale === 'ja' ? 'ホーム' : 'home') : pathname.replace(/^\//, ''));

  return (
    <>
      <nav
        aria-label="Main navigation"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'var(--color-ink, #0A0A0A)',
          color: 'var(--color-bg, #E8E6DD)',
          borderBottom: '2px solid var(--color-ink, #0A0A0A)',
        }}
      >
        {/* Main bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            height: '44px',
            flexWrap: 'nowrap',
            gap: '16px',
          }}
        >
          {/* Logo chip */}
          <Link
            href="/"
            aria-label="ZeroEn — go to homepage"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-accent, #00E87A)',
              color: 'var(--color-ink, #0A0A0A)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '3px 8px',
              textDecoration: 'none',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            $ ZEROEN
          </Link>

          {/* Page hint (mobile only, truncates) */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--color-ink-dim, #5A584F)',
              letterSpacing: '0.05em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
            }}
            className="md:hidden"
          >
            --page={pathname === '/' ? 'home' : pathname.replace(/^\//, '')}
          </span>

          <div style={{ flex: 1 }} />

          {/* Desktop nav links */}
          <div
            style={{ alignItems: 'center', gap: '20px', flexShrink: 0 }}
            className="hidden md:flex"
          >
            {links.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href as '/'}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: 'var(--color-bg, #E8E6DD)',
                    borderBottom: isActive ? '2px solid var(--color-accent, #00E87A)' : '2px solid transparent',
                    paddingBottom: '2px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <a
            href={CAL_URL[locale] ?? CAL_URL.en}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: 'var(--color-accent, #00E87A)',
              color: 'var(--color-ink, #0A0A0A)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '5px 10px',
              textDecoration: 'none',
              border: '2px solid var(--color-ink, #0A0A0A)',
              boxShadow: '4px 4px 0 var(--color-ink, #0A0A0A)',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
            className="hidden md:inline-block"
          >
            {ctaLabel}
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--color-bg, #E8E6DD)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              padding: '4px 0',
            }}
            className="md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? '✕ CLOSE' : '≡ MENU'}
          </button>
        </div>

        {/* Breadcrumb strip */}
        <div
          style={{
            padding: '3px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-bg, #E8E6DD)',
            opacity: 0.5,
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {breadcrumb}
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            style={{
              borderTop: '2px solid var(--color-bg, #E8E6DD)',
              backgroundColor: 'var(--color-ink, #0A0A0A)',
            }}
            className="md:hidden"
          >
            {links.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href as '/'}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive ? 'var(--color-accent, #00E87A)' : 'var(--color-bg, #E8E6DD)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {label}
                </Link>
              );
            })}
            <a
              href={CAL_URL[locale] ?? CAL_URL.en}
            target="_blank"
            rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '12px 16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: 'var(--color-accent, #00E87A)',
              }}
            >
              ► {ctaLabel}
            </a>
          </div>
        )}
      </nav>
    </>
  );
}
