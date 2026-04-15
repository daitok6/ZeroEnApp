'use client';

import { useState } from 'react';
import { step1Schema, type DesignWizardFormData } from '@/lib/validations/design-wizard';
import { errorMsg } from '@/lib/wizard-errors';

interface Step1Props {
  initialValues: Partial<DesignWizardFormData>;
  onNext: (data: Partial<DesignWizardFormData>) => void;
  locale: string;
  isAdvancing?: boolean;
}

const TIMEZONES = [
  'Asia/Tokyo',
  'Asia/Singapore',
  'Asia/Bangkok',
  'Asia/Seoul',
  'US/Eastern',
  'US/Pacific',
  'Europe/London',
  'Europe/Berlin',
  'Australia/Sydney',
];

const LABEL_CLASS = 'block text-[#F4F4F2] text-xs font-mono uppercase tracking-widest mb-2';
const INPUT_CLASS =
  'w-full bg-[#0D0D0D] border border-[#1F2937] rounded px-3 py-2 text-[#F4F4F2] text-sm font-mono focus:outline-none focus:border-[#00E87A] transition-colors';
const ERROR_CLASS = 'text-red-400 text-xs font-mono mt-1';

export function Step1Business({ initialValues, onNext, locale, isAdvancing = false }: Step1Props) {
  const [state, setState] = useState({
    business_name: (initialValues.business_name as string) ?? '',
    industry: (initialValues.industry as string) ?? '',
    location: (initialValues.location as string) ?? '',
    tagline: (initialValues.tagline as string) ?? '',
    entity_name: (initialValues.entity_name as string) ?? '',
    timezone: (initialValues.timezone as string) ?? 'Asia/Tokyo',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (k: keyof typeof state) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setState((s) => ({ ...s, [k]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = step1Schema.safeParse(state);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onNext(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="business_name" className={LABEL_CLASS}>
          {locale === 'ja' ? '事業名' : 'Business name'} *
        </label>
        <input
          id="business_name"
          type="text"
          value={state.business_name}
          onChange={handleChange('business_name')}
          className={INPUT_CLASS}
          required
        />
        {errors.business_name && <p className={ERROR_CLASS}>{errorMsg(errors.business_name, locale)}</p>}
      </div>

      <div>
        <label htmlFor="industry" className={LABEL_CLASS}>
          {locale === 'ja' ? '業種' : 'Industry'} *
        </label>
        <input
          id="industry"
          type="text"
          value={state.industry}
          onChange={handleChange('industry')}
          placeholder={locale === 'ja' ? '例: 飲食、コンサル、EC' : 'e.g. Restaurant, Consulting, E-commerce'}
          className={INPUT_CLASS}
          required
        />
        {errors.industry && <p className={ERROR_CLASS}>{errorMsg(errors.industry, locale)}</p>}
      </div>

      <div>
        <label htmlFor="location" className={LABEL_CLASS}>
          {locale === 'ja' ? '所在地 (都市 / 国)' : 'Location (city/country)'}
        </label>
        <input
          id="location"
          type="text"
          value={state.location}
          onChange={handleChange('location')}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="tagline" className={LABEL_CLASS}>
          {locale === 'ja' ? 'キャッチコピー' : 'Tagline'}
        </label>
        <input
          id="tagline"
          type="text"
          value={state.tagline}
          onChange={handleChange('tagline')}
          placeholder={
            locale === 'ja' ? '事業を一言で表すフレーズ' : 'One line that captures your business'
          }
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="entity_name" className={LABEL_CLASS}>
          {locale === 'ja' ? '法人名 (任意)' : 'Legal entity name (optional)'}
        </label>
        <input
          id="entity_name"
          type="text"
          value={state.entity_name}
          onChange={handleChange('entity_name')}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="timezone" className={LABEL_CLASS}>
          {locale === 'ja' ? 'タイムゾーン' : 'Your timezone'} *
        </label>
        <select
          id="timezone"
          value={state.timezone}
          onChange={handleChange('timezone')}
          className={INPUT_CLASS}
          required
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        {errors.timezone && <p className={ERROR_CLASS}>{errorMsg(errors.timezone, locale)}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isAdvancing}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest text-sm px-6 py-3 rounded hover:bg-[#00E87A]/90 active:bg-[#00C96A] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isAdvancing ? (locale === 'ja' ? '保存中...' : 'Saving...') : (locale === 'ja' ? '次へ' : 'Next')}
        </button>
      </div>
    </form>
  );
}
