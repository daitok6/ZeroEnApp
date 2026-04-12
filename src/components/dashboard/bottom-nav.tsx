'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  /** Keys that should render as locked/disabled */
  lockedKeys?: Set<string>;
}

export function BottomNav({ locale, navType, basePath, messagesBadge, lockedKeys }: BottomNavProps) {
  const pathname = usePathname();
  const tDash = useTranslations('dashboard.nav');
  const tAdmin = useTranslations('admin');

  const items = NAV_MAP[navType];

  const getLabel = (key: string): string => {
    if (navType === 'admin') return tAdmin(key as Parameters<typeof tAdmin>[0]);
    return tDash(key as Parameters<typeof tDash>[0]);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D] border-t border-[#374151] md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const href = `/${locale}${item.path}`;
          const isLocked = lockedKeys?.has(item.key) ?? false;
          const isActive = !isLocked && (pathname === href ||
            (item.path !== basePath && pathname.startsWith(`/${locale}${item.path}`)));
          const Icon = item.icon;

          if (isLocked) {
            return (
              <div
                key={item.key}
                title="Available once your project is ready"
                className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[48px] opacity-30 cursor-not-allowed select-none text-[#6B7280]"
              >
                <Icon size={20} strokeWidth={1.5} />
                <span className="text-[10px] font-mono leading-none">
                  {getLabel(item.key)}
                </span>
              </div>
            );
          }

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
                {getLabel(item.key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
