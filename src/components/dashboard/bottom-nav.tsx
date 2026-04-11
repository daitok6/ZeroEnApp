'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { navItems, pendingNavItems, onboardingNavItems, adminNavItems } from './nav-items';

type NavType = 'client' | 'pending' | 'onboarding' | 'admin';

const NAV_MAP = {
  client: navItems,
  pending: pendingNavItems,
  onboarding: onboardingNavItems,
  admin: adminNavItems,
} as const;

interface BottomNavProps {
  locale: string;
  navType: NavType;
  basePath: string;
  /** Badge to show on the Messages nav item */
  messagesBadge?: ReactNode;
}

export function BottomNav({ locale, navType, basePath, messagesBadge }: BottomNavProps) {
  const pathname = usePathname();
  const items = NAV_MAP[navType];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D] border-t border-[#374151] md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const href = `/${locale}${item.path}`;
          const isActive = pathname === href ||
            (item.path !== basePath && pathname.startsWith(`/${locale}${item.path}`));
          const Icon = item.icon;
          const label = locale === 'ja' ? item.labelJa : item.labelEn;

          return (
            <Link
              key={item.key}
              href={href}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[48px] ${
                isActive
                  ? 'text-[#00E87A]'
                  : 'text-[#6B7280] hover:text-[#9CA3AF]'
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                {item.key === 'messages' && messagesBadge && (
                  <div className="absolute -top-1.5 -right-2">
                    {messagesBadge}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-mono leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
