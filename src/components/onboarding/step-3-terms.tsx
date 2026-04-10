'use client';

import { useState } from 'react';
import { step3Schema } from '@/lib/validations/onboarding';
import type { OnboardingFormData } from '@/lib/validations/onboarding';

interface Props {
  data: Partial<OnboardingFormData>;
  onNext: (data: Pick<OnboardingFormData, 'entity_name' | 'terms_accepted'>) => void;
  onBack: () => void;
  locale: string;
}

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280]';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';
const errorClass = 'mt-1 text-red-400 text-xs font-mono';

export function Step3Terms({ data, onNext, onBack, locale }: Props) {
  const isJa = locale === 'ja';
  const [entityName, setEntityName] = useState(data.entity_name ?? '');
  const [accepted, setAccepted] = useState(data.terms_accepted === true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step3Schema.safeParse({
      entity_name: entityName || undefined,
      terms_accepted: accepted || undefined,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? (isJa ? '利用規約に同意する必要があります' : 'You must accept the partnership terms to continue'));
      return;
    }
    setError('');
    onNext({ entity_name: entityName || undefined, terms_accepted: true });
  };

  const terms = isJa
    ? [
        { label: 'エクイティ', value: 'SAFE note経由で10%（法人化時に転換）' },
        { label: 'レベニューシェア', value: 'アプリ収益の約10%（柔軟に交渉可能）' },
        { label: 'プラットフォーム料金', value: 'ローンチ後 $50/月（ホスティング＋月1回の小修正）' },
        { label: 'MVPスコープ', value: 'キックオフ時に確定。変更は別途料金' },
        { label: 'IP所有権', value: '共有（エクイティ割合に比例）' },
        { label: 'キルスイッチ', value: '90日未払いで契約終了、コードの権利はオペレーターへ' },
      ]
    : [
        { label: 'Equity', value: '10% via SAFE note (converts on incorporation)' },
        { label: 'Revenue Share', value: '~10% of app revenue (flexible per deal)' },
        { label: 'Platform Fee', value: '$50/mo after launch (hosting + 1 fix/mo)' },
        { label: 'MVP Scope', value: 'Locked at kickoff. Changes are charged separately.' },
        { label: 'IP Ownership', value: 'Shared — proportional to equity stake' },
        { label: 'Kill Switch', value: '90 days unpaid → agreement terminates, code rights to operator' },
      ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {isJa ? 'ビジネス・契約条件' : 'Business & Legal'}
      </h2>

      <div>
        <label className={labelClass}>
          {isJa ? '会社・プロジェクト名（任意）' : 'Company / Entity Name (optional)'}
        </label>
        <input
          type="text"
          value={entityName}
          onChange={(e) => setEntityName(e.target.value)}
          placeholder={isJa ? '株式会社〇〇 または個人名' : 'Your company name, or personal name'}
          className={inputClass}
        />
      </div>

      <div className="border border-[#374151] rounded p-5 space-y-3">
        <p className="text-[#9CA3AF] text-xs font-mono uppercase tracking-widest mb-4">
          {isJa ? 'パートナーシップの主要条件' : 'Key Partnership Terms'}
        </p>
        {terms.map((term) => (
          <div key={term.label} className="flex gap-3 text-sm font-mono">
            <span className="text-[#00E87A] shrink-0 w-32">{term.label}</span>
            <span className="text-[#F4F4F2]">{term.value}</span>
          </div>
        ))}
      </div>

      <div className="border border-[#374151] rounded p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={accepted}
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
                  : 'bg-transparent border-[#374151]'
              }`}
            >
              {accepted && (
                <svg className="w-3 h-3 text-[#0D0D0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-[#F4F4F2] text-sm font-mono leading-relaxed">
            {isJa
              ? '上記の条件を読み、予備的な合意として同意します。正式な契約書は追って送付されます。'
              : 'I have read and accept the above terms as a preliminary agreement. A formal agreement will follow.'}
          </span>
        </label>
        {error && <p className={errorClass}>{error}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-[#9CA3AF] font-mono text-sm px-6 py-3 rounded border border-[#374151] hover:border-[#6B7280] transition-colors"
        >
          ← {isJa ? '戻る' : 'Back'}
        </button>
        <button
          type="submit"
          disabled={!accepted}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isJa ? '次へ →' : 'Next →'}
        </button>
      </div>
    </form>
  );
}
