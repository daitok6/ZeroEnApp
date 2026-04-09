'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      <button
        onClick={() => switchLocale('en')}
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
        onClick={() => switchLocale('ja')}
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
