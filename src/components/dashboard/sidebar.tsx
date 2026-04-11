'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { navItems, pendingNavItems, onboardingNavItems, adminNavItems } from './nav-items';
import { SidebarNavLink } from './sidebar-nav-link';

type NavType = 'client' | 'pending' | 'onboarding' | 'admin';

const NAV_MAP = {
  client: navItems,
  pending: pendingNavItems,
  onboarding: onboardingNavItems,
  admin: adminNavItems,
} as const;

interface SidebarProps {
  locale: string;
  navType: NavType;
  basePath: string;
  /** Badge to show on the Messages nav item */
  messagesBadge?: ReactNode;
}

export function Sidebar({ locale, navType, basePath, messagesBadge }: SidebarProps) {
  const items = NAV_MAP[navType];
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-[#0D0D0D] border-r border-[#374151] h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#374151]">
        <Link href={`/${locale}${basePath}`}>
          <Image src="/logo-dark.svg" alt="ZeroEn" width={80} height={22} />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {items.map((item) => (
            <SidebarNavLink
              key={item.key}
              href={`/${locale}${item.path}`}
              icon={item.icon}
              label={locale === 'ja' ? item.labelJa : item.labelEn}
              exact={item.path === basePath}
              badge={item.key === 'messages' ? messagesBadge : undefined}
            />
          ))}
        </div>
      </nav>

      {/* Back to site link */}
      <div className="px-3 py-4 border-t border-[#374151]">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#F4F4F2] text-xs font-mono transition-colors px-3 py-2 rounded hover:bg-[#1F2937]"
        >
          ← {locale === 'ja' ? 'サイトに戻る' : 'Back to site'}
        </Link>
      </div>
    </aside>
  );
}
