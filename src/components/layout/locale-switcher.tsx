'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

function persistLocale(locale: 'en' | 'ja') {
  // Persist explicit user choice so server-side detection (e.g. design wizard
  // browser-language redirect) respects the user's manual preference.
  if (typeof document === 'undefined') return;
  document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: 'en' | 'ja') => {
    persistLocale(next);
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      <button
        onClick={() => switchTo('en')}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'en'
            ? 'text-[#00E87A] font-bold'
            : 'text-[#9CA3AF] hover:text-[#F4F4F2]'
        }`}
      >
        EN
      </button>
      <span className="text-[#374151]">/</span>
      <button
        onClick={() => switchTo('ja')}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'ja'
            ? 'text-[#00E87A] font-bold'
            : 'text-[#9CA3AF] hover:text-[#F4F4F2]'
        }`}
      >
        JA
      </button>
    </div>
  );
}
