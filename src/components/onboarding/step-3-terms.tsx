'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { step3Schema } from '@/lib/validations/onboarding';
import type { OnboardingFormData } from '@/lib/validations/onboarding';
import { CheckCircle } from 'lucide-react';

interface Props {
  data: Partial<OnboardingFormData>;
  onNext: (data: Pick<OnboardingFormData, 'entity_name' | 'signature_name' | 'terms_accepted'>) => void;
  onBack: () => void;
  locale: string;
  userEmail: string;
  userName: string;
}

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280]';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';

export function Step3Terms({ data, onNext, onBack, locale: _locale }: Props) {
  const t = useTranslations('onboarding.step3');
  const tCommon = useTranslations('common');
  const [entityName, setEntityName] = useState(data.entity_name ?? '');
  const [signatureName, setSignatureName] = useState(data.signature_name ?? '');
  const [accepted, setAccepted] = useState(data.terms_accepted === true);
  const [error, setError] = useState('');

  const terms = t.raw('terms') as Array<{ label: string; value: string }>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step3Schema.safeParse({
      entity_name: entityName || undefined,
      signature_name: signatureName,
      terms_accepted: accepted ? true : undefined,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? t('completeFields'));
      return;
    }
    setError('');
    onNext({ entity_name: entityName || undefined, signature_name: signatureName, terms_accepted: true });
  };

  const canSubmit = signatureName.trim().length >= 2 && accepted;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {t('title')}
      </h2>

      {/* Optional entity name */}
      <div>
        <label className={labelClass}>
          {t('entityName')}
        </label>
        <input
          type="text"
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
          placeholder={t('entityNamePlaceholder')}
          className={inputClass}
        />
      </div>

      {/* Terms display */}
      <div className="border border-[#374151] rounded p-5 space-y-3">
        <p className="text-[#9CA3AF] text-xs font-mono uppercase tracking-widest mb-4">
          {t('partnershipTitle')}
        </p>
        {terms.map((term) => (
          <div key={term.label} className="flex gap-3 text-sm font-mono">
            <span className="text-[#00E87A] shrink-0 w-36">{term.label}</span>
            <span className="text-[#F4F4F2]">{term.value}</span>
          </div>
        ))}
        <div className="pt-3 border-t border-[#374151] mt-3">
          <p className="text-[#6B7280] text-xs font-mono leading-relaxed">
            {t('disclaimer')}
          </p>
        </div>
      </div>

      {/* Typed signature */}
      <div>
        <label className={labelClass}>
          {t('signatureLabel')}
        </label>
        <input
          type="text"
          value={signatureName}
          onChange={(e) => setSignatureName(e.target.value)}
          placeholder={t('signaturePlaceholder')}
          className={inputClass}
          autoComplete="name"
          required
        />
        <p className="text-[#6B7280] text-xs font-mono mt-1.5">
          {t('signatureHelper')}
        </p>
      </div>

      {/* Acceptance checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${accepted ? 'bg-[#00E87A] border-[#00E87A]' : 'bg-transparent border-[#374151] group-hover:border-[#6B7280]'}`}>
            {accepted && <CheckCircle size={14} className="text-[#0D0D0D]" strokeWidth={3} />}
          </div>
        </div>
        <span className="text-[#F4F4F2] text-sm font-mono leading-relaxed">
          {t('checkboxLabel')}
        </span>
      </label>

      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

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
          disabled={!canSubmit}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {tCommon('next')}
        </button>
      </div>
    </form>
  );
}
