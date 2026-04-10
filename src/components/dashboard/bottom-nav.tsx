'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems, pendingNavItems, onboardingNavItems, adminNavItems } from './nav-items';

type NavType = 'client' | 'pending' | 'onboarding' | 'admin';

const NAV_MAP = {
  client: navItems,
  pending: pendingNavItems,
  onboarding: onboardingNavItems,
  admin: adminNavItems,
} as const;

export function BottomNav({ locale, navType, basePath }: { locale: string; navType: NavType; basePath: string }) {
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
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[48px] ${
                isActive
                  ? 'text-[#00E87A]'
                  : 'text-[#6B7280] hover:text-[#9CA3AF]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
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
