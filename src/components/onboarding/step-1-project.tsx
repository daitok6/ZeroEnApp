'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { useRouter } from '@/i18n/navigation';
import { step1Schema } from '@/lib/validations/onboarding';
import type { OnboardingFormData } from '@/lib/validations/onboarding';

interface Props {
  data: Partial<OnboardingFormData>;
  onNext: (data: Pick<OnboardingFormData, 'app_name' | 'app_description' | 'target_launch_date' | 'preferred_locale'>) => void;
  locale: string;
}

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280] resize-none';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';
const errorClass = 'mt-1 text-red-400 text-xs font-mono';

export function Step1Project({ data, onNext, locale }: Props) {
  const t = useTranslations('onboarding.step1');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();

  const [preferredLocale, setPreferredLocale] = useState<'en' | 'ja'>(
    (data.preferred_locale as 'en' | 'ja') ?? (locale as 'en' | 'ja') ?? 'en'
  );
  const [formData, setFormData] = useState({
    app_name: data.app_name ?? '',
    app_description: data.app_description ?? '',
    target_launch_date: data.target_launch_date ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLocaleSwitch = (newLocale: 'en' | 'ja') => {
    if (newLocale === locale) return;
    setPreferredLocale(newLocale);
    router.replace(pathname, { locale: newLocale });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step1Schema.safeParse({ ...formData, preferred_locale: preferredLocale });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onNext({
      app_name: result.data.app_name,
      app_description: result.data.app_description,
      target_launch_date: result.data.target_launch_date,
      preferred_locale: result.data.preferred_locale,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {t('title')}
      </h2>

      {/* Language selector — first field */}
      <div className="border border-[#374151] rounded p-4 bg-[#0D0D0D]/50">
        <label className={labelClass}>
          {t('languageLabel')}
        </label>
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={() => handleLocaleSwitch('en')}
            className={`px-4 py-2 rounded text-sm font-mono font-bold transition-colors border ${
              preferredLocale === 'en'
                ? 'bg-[#00E87A] text-[#0D0D0D] border-[#00E87A]'
                : 'bg-transparent text-[#9CA3AF] border-[#374151] hover:border-[#00E87A] hover:text-[#F4F4F2]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLocaleSwitch('ja')}
            className={`px-4 py-2 rounded text-sm font-mono font-bold transition-colors border ${
              preferredLocale === 'ja'
                ? 'bg-[#00E87A] text-[#0D0D0D] border-[#00E87A]'
                : 'bg-transparent text-[#9CA3AF] border-[#374151] hover:border-[#00E87A] hover:text-[#F4F4F2]'
            }`}
          >
            日本語
          </button>
        </div>
        <p className="text-[#6B7280] text-xs font-mono mt-2">
          {t('languageHelper')}
        </p>
      </div>

      <div>
        <label className={labelClass}>
          {t('appName')}
        </label>
        <input
          type="text"
          value={formData.app_name}
          onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
          placeholder={t('appNamePlaceholder')}
          className={inputClass}
        />
        {errors.app_name && <p className={errorClass}>{errors.app_name}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {t('appDescription')}
        </label>
        <textarea
          rows={4}
          value={formData.app_description}
          onChange={(e) => setFormData({ ...formData, app_description: e.target.value })}
          placeholder={t('appDescriptionPlaceholder')}
          className={inputClass}
        />
        {errors.app_description && <p className={errorClass}>{errors.app_description}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {t('targetLaunch')}
        </label>
        <input
          type="month"
          value={formData.target_launch_date}
          onChange={(e) => setFormData({ ...formData, target_launch_date: e.target.value })}
          className={inputClass}
          style={{ colorScheme: 'dark' }}
        />
        {errors.target_launch_date && <p className={errorClass}>{errors.target_launch_date}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors"
        >
          {tCommon('next')}
        </button>
      </div>
    </form>
  );
}
