'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { step2Schema } from '@/lib/validations/onboarding';
import type { OnboardingFormData } from '@/lib/validations/onboarding';

interface Props {
  data: Partial<OnboardingFormData>;
  onNext: (data: Pick<OnboardingFormData, 'auth_method' | 'key_features' | 'integrations' | 'design_references'>) => void;
  onBack: () => void;
  locale: string;
}

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280] resize-none';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';
const errorClass = 'mt-1 text-red-400 text-xs font-mono';
const selectClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A]';

export function Step2Technical({ data, onNext, onBack, locale: _locale }: Props) {
  const t = useTranslations('onboarding.step2');
  const tCommon = useTranslations('common');
  const [formData, setFormData] = useState({
    auth_method: data.auth_method ?? ('' as OnboardingFormData['auth_method']),
    key_features: data.key_features ?? '',
    integrations: data.integrations ?? '',
    design_references: data.design_references ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step2Schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onNext(result.data);
  };

  const authOptions = [
    { value: 'email-password', label: t('authEmailPassword') },
    { value: 'google', label: t('authGoogle') },
    { value: 'both', label: t('authBoth') },
    { value: 'other', label: t('authOther') },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {t('title')}
      </h2>

      <div>
        <label className={labelClass}>
          {t('authMethod')}
        </label>
        <select
          value={formData.auth_method}
          onChange={(e) => setFormData({ ...formData, auth_method: e.target.value as OnboardingFormData['auth_method'] })}
          className={selectClass}
        >
          <option value="" disabled>
            {t('authPlaceholder')}
          </option>
          {authOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.auth_method && <p className={errorClass}>{errors.auth_method}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {t('keyFeatures')}
        </label>
        <textarea
          rows={4}
          value={formData.key_features}
          onChange={(e) => setFormData({ ...formData, key_features: e.target.value })}
          placeholder={t('keyFeaturesPlaceholder')}
          className={inputClass}
        />
        {errors.key_features && <p className={errorClass}>{errors.key_features}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {t('integrations')}
        </label>
        <textarea
          rows={3}
          value={formData.integrations}
          onChange={(e) => setFormData({ ...formData, integrations: e.target.value })}
          placeholder={t('integrationsPlaceholder')}
          className={inputClass}
        />
        {errors.integrations && <p className={errorClass}>{errors.integrations}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {t('designRefs')}
        </label>
        <textarea
          rows={3}
          value={formData.design_references}
          onChange={(e) => setFormData({ ...formData, design_references: e.target.value })}
          placeholder={t('designRefsPlaceholder')}
          className={inputClass}
        />
        {errors.design_references && <p className={errorClass}>{errors.design_references}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-[#9CA3AF] font-mono text-sm px-6 py-3 rounded border border-[#374151] hover:border-[#6B7280] transition-colors"
        >
          {tCommon('back')}
        </button>
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
