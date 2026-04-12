'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { step3Schema } from '@/lib/validations/application';
import type { ApplicationFormData } from '@/lib/validations/application';

interface Step3Props {
  data: Partial<ApplicationFormData>;
  onNext: (data: Pick<ApplicationFormData, 'founder_name' | 'founder_background' | 'founder_commitment' | 'linkedin_url'>) => void;
  onBack: () => void;
  locale: string;
}

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280] resize-none';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';
const errorClass = 'mt-1 text-red-400 text-xs font-mono';

export function Step3Founder({ data, onNext, onBack }: Step3Props) {
  const t = useTranslations('apply');
  const tCommon = useTranslations('common');
  const [formData, setFormData] = useState({
    founder_name: data.founder_name || '',
    founder_background: data.founder_background || '',
    founder_commitment: data.founder_commitment || ('' as 'full-time' | 'part-time' | 'side-project' | ''),
    linkedin_url: data.linkedin_url || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step3Schema.safeParse(formData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {t('step3.title')}
      </h2>

      <div>
        <label className={labelClass}>
          {t('step3.founderName')}
        </label>
        <input
          type="text"
          value={formData.founder_name}
          onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
          placeholder={t('step3.founderNamePlaceholder')}
          className={inputClass}
        />
        {errors.founder_name && <p className={errorClass}>{errors.founder_name}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {t('step3.founderBackground')}
        </label>
        <textarea
          rows={4}
          value={formData.founder_background}
          onChange={(e) => setFormData({ ...formData, founder_background: e.target.value })}
          placeholder={t('step3.founderBackgroundPlaceholder')}
          className={inputClass}
        />
        {errors.founder_background && <p className={errorClass}>{errors.founder_background}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {t('step3.commitment')}
        </label>
        <select
          value={formData.founder_commitment}
          onChange={(e) => setFormData({ ...formData, founder_commitment: e.target.value as 'full-time' | 'part-time' | 'side-project' })}
          className="w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A]"
        >
          <option value="" disabled>
            {t('step3.commitmentPlaceholder')}
          </option>
          <option value="full-time">{t('step3.commitmentFullTime')}</option>
          <option value="part-time">{t('step3.commitmentPartTime')}</option>
          <option value="side-project">{t('step3.commitmentSideProject')}</option>
        </select>
        {errors.founder_commitment && <p className={errorClass}>{errors.founder_commitment}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {t('step3.linkedin')}
        </label>
        <input
          type="url"
          value={formData.linkedin_url}
          onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
          placeholder="https://linkedin.com/in/yourprofile"
          className={inputClass}
        />
        {errors.linkedin_url && <p className={errorClass}>{errors.linkedin_url}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="border border-[#374151] text-[#9CA3AF] font-mono px-8 py-3 rounded hover:border-[#6B7280] transition-colors"
        >
          ← {tCommon('back')}
        </button>
        <button
          type="submit"
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors"
        >
          {tCommon('next')} →
        </button>
      </div>
    </form>
  );
}
