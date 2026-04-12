'use client';

import { useState, useRef } from 'react';
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

const AGREEMENT_SECTIONS = [
  {
    title: '1. Equity Agreement',
    body: 'ZeroEn receives 10% equity via a SAFE note. Converts on incorporation or qualifying financing event. If never incorporated, ~10% net revenue profit-share applies instead. Anti-dilution floor maintained if client raises external funding.',
  },
  {
    title: '2. Revenue Share',
    body: '~10% of app revenue, negotiated at kickoff and fixed in writing before build begins.',
  },
  {
    title: '3. Platform Fee',
    body: 'USD $50/mo after MVP launch. Covers hosting, 1 small fix/mo, monthly analytics report. Begins 30 days after launch. Payment via Stripe. Site stays live only while fee is paid.',
  },
  {
    title: '4. Scope Freeze',
    body: 'MVP scope locked at kickoff. Features beyond agreed scope = per-request charges, quoted upfront, paid before work begins.',
  },
  {
    title: '5. Per-Request Charges',
    body: 'Small (1–4 hrs): $50–100 · Medium (1–3 days): $200–500 · Large (1–2 wks): $500–2,000',
  },
  {
    title: '6. Kill Switch',
    body: '90 days unpaid → agreement terminates automatically. Site taken offline. ZeroEn retains full code rights. Equity and revenue share voided.',
  },
  {
    title: '7. Reversion Clause',
    body: 'Failure to launch within 6 months of build completion → full code rights revert to ZeroEn. Extensions available in writing at ZeroEn\'s discretion.',
  },
  {
    title: '8. IP Ownership',
    body: 'IP shared proportionally to equity stake (ZeroEn 10% / client 90%). ZeroEn always retains portfolio and marketing rights.',
  },
  {
    title: '9. Founder Vesting',
    body: 'Client equity vests over time. 6+ months no communication or active use = equity reduces proportionally.',
  },
  {
    title: '10. Governing Law',
    body: 'Ontario, Canada. Disputes: good-faith negotiation first, then binding arbitration.',
  },
  {
    title: '11. Confidentiality & NDA',
    body: 'Both parties keep each other\'s confidential information private. Survives termination (3 years general / indefinitely for personal data). Data deletion on request.',
  },
];

export function Step3Terms({ data, onNext, onBack, locale }: Props) {
  const t = useTranslations('onboarding.step3');
  const tCommon = useTranslations('common');
  const [entityName, setEntityName] = useState(data.entity_name ?? '');
  const [signatureName, setSignatureName] = useState(data.signature_name ?? '');
  const [accepted, setAccepted] = useState(data.terms_accepted === true);
  const [error, setError] = useState('');
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const terms = t.raw('terms') as Array<{ label: string; value: string }>;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolled(true);
    }
  };

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

      {/* Full agreement text — scrollable with gate */}
      <div className="space-y-2">
        {!hasScrolled && (
          <p className="text-[#6B7280] text-xs font-mono text-center animate-pulse">
            ↓ Scroll to read full agreement
          </p>
        )}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto max-h-64 border border-[#374151] rounded p-4 space-y-4 bg-[#111827]"
        >
          {AGREEMENT_SECTIONS.map((section) => (
            <section key={section.title}>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">
                {section.title}
              </p>
              <p className="text-sm font-mono text-[#D1D5DB] leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
          <div className="pt-2 border-t border-[#374151]">
            <a
              href={`/${locale}/terms`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00E87A] text-sm font-mono hover:underline"
            >
              View full terms →
            </a>
          </div>
        </div>
      </div>

      {/* Key/value summary (TL;DR) */}
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

      {/* Acceptance checkbox — gated until full scroll */}
      <label className={`flex items-start gap-3 group ${!hasScrolled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
        <div className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            disabled={!hasScrolled}
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
