'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { step0Schema } from '@/lib/validations/application';
import type { ApplicationFormData } from '@/lib/validations/application';

interface Step0Props {
  data: Partial<ApplicationFormData>;
  onNext: (data: Pick<ApplicationFormData, 'nda_accepted' | 'nda_signature_name'>) => void;
  locale: string;
}

const errorClass = 'mt-1 text-red-400 text-xs font-mono';


export function Step0Nda({ data, onNext, locale }: Step0Props) {
  const t = useTranslations('apply');
  const [accepted, setAccepted] = useState<boolean>(data.nda_accepted === true);
  const [signatureName, setSignatureName] = useState<string>(data.nda_signature_name ?? '');
  const [hasScrolled, setHasScrolled] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    // Consider scrolled when within 16px of the bottom
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 16) {
      setHasScrolled(true);
    }
  };

  const canContinue = accepted && signatureName.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step0Schema.safeParse({
      nda_accepted: accepted || undefined,
      nda_signature_name: signatureName,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? t('step0.ndaError'));
      return;
    }
    setError('');
    onNext({ nda_accepted: true, nda_signature_name: signatureName.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-2">
          {t('step0.title')}
        </h2>
        <p className="text-[#9CA3AF] text-sm font-mono">
          {t('step0.subtitle')}
        </p>
      </div>

      {/* Scrollable NDA text block — scroll gate */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="border border-[#374151] rounded p-4 overflow-y-auto max-h-72 bg-[#111827]"
      >
        <p className="text-[#9CA3AF] text-xs font-mono uppercase tracking-wider mb-3">
          Confidentiality Agreement — Key Terms
        </p>
        <ul className="space-y-3">
          {(t.raw('step0.ndaPoints') as string[]).map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-mono text-[#F4F4F2]">
              <span className="text-[#00E87A] mt-0.5 shrink-0">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        {!hasScrolled && (
          <p className="mt-4 text-[#9CA3AF] text-xs font-mono text-center animate-pulse">
            {t('step0.scrollHint')}
          </p>
        )}
      </div>

      <div>
        <Link
          href={`/${locale}/terms#confidentiality`}
          target="_blank"
          className="text-[#00E87A] text-xs font-mono underline underline-offset-2 hover:text-[#00d070]"
        >
          {t('step0.linkText')} →
        </Link>
      </div>

      <div className="border border-[#374151] rounded p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={accepted}
              disabled={!hasScrolled}
              onChange={(e) => {
                setAccepted(e.target.checked);
                if (e.target.checked) setError('');
              }}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                accepted
                  ? 'bg-[#00E87A] border-[#00E87A]'
                  : hasScrolled
                  ? 'bg-transparent border-[#374151]'
                  : 'bg-transparent border-[#374151] opacity-40'
              }`}
            >
              {accepted && (
                <svg className="w-3 h-3 text-[#0D0D0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className={`text-sm font-mono leading-relaxed transition-colors ${hasScrolled ? 'text-[#F4F4F2]' : 'text-[#9CA3AF]'}`}>
            {t('step0.checkboxLabel')}
          </span>
        </label>
        {error && <p className={errorClass}>{error}</p>}
      </div>

      {/* Typed signature field */}
      <div className="space-y-2">
        <label className="block text-sm font-mono text-[#F4F4F2]">
          {t('step0.signatureLabel')}
        </label>
        <input
          type="text"
          value={signatureName}
          onChange={(e) => setSignatureName(e.target.value)}
          placeholder={t('step0.signaturePlaceholder')}
          className="w-full bg-[#111827] border border-[#374151] rounded px-4 py-2.5 text-[#F4F4F2] font-mono text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#00E87A] transition-colors"
        />
        <p className="text-[#9CA3AF] text-xs font-mono">
          {t('step0.signatureHelper')}
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!canContinue}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('step0.continueButton')}
        </button>
      </div>
    </form>
  );
}
