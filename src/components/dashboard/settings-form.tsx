'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

interface Props {
  currentLocale: 'en' | 'ja';
}

export function SettingsForm({ currentLocale }: Props) {
  const t = useTranslations('settings.language');
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLocaleChange = async (newLocale: 'en' | 'ja') => {
    if (newLocale === currentLocale) return;
    setLoading(true);
    setSaved(false);

    try {
      const supabase = createClient();
      await supabase.from('profiles').update({ locale: newLocale }).eq(
        'id',
        (await supabase.auth.getUser()).data.user?.id ?? ''
      );
      setSaved(true);
      router.replace(pathname, { locale: newLocale });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border border-[#374151] rounded p-6 bg-[#111827]/50 space-y-4">
        <div>
          <h3 className="text-[#F4F4F2] text-sm font-bold font-mono uppercase tracking-widest">
            {t('title')}
          </h3>
          <p className="text-[#6B7280] text-xs font-mono mt-1">
            {t('subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleLocaleChange('en')}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm font-mono font-bold transition-colors border disabled:opacity-50 ${
              currentLocale === 'en'
                ? 'bg-[#00E87A] text-[#0D0D0D] border-[#00E87A]'
                : 'bg-transparent text-[#9CA3AF] border-[#374151] hover:border-[#00E87A] hover:text-[#F4F4F2]'
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLocaleChange('ja')}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm font-mono font-bold transition-colors border disabled:opacity-50 ${
              currentLocale === 'ja'
                ? 'bg-[#00E87A] text-[#0D0D0D] border-[#00E87A]'
                : 'bg-transparent text-[#9CA3AF] border-[#374151] hover:border-[#00E87A] hover:text-[#F4F4F2]'
            }`}
          >
            日本語
          </button>
        </div>
        {saved && (
          <p className="text-[#00E87A] text-xs font-mono">
            {t('saved')}
          </p>
        )}
      </div>
    </div>
  );
}
