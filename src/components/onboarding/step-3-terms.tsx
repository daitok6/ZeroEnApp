'use client';

import { useState } from 'react';
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

export function Step3Terms({ data, onNext, onBack, locale }: Props) {
  const isJa = locale === 'ja';
  const [entityName, setEntityName] = useState(data.entity_name ?? '');
  const [signatureName, setSignatureName] = useState(data.signature_name ?? '');
  const [accepted, setAccepted] = useState(data.terms_accepted === true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step3Schema.safeParse({
      entity_name: entityName || undefined,
      signature_name: signatureName,
      terms_accepted: accepted ? true : undefined,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? (isJa ? '全ての必須項目を入力してください' : 'Please complete all required fields'));
      return;
    }
    setError('');
    onNext({ entity_name: entityName || undefined, signature_name: signatureName, terms_accepted: true });
  };

  const terms = isJa
    ? [
        { label: 'エクイティ', value: 'SAFE note経由で10%（法人化時に転換）' },
        { label: 'レベニューシェア', value: 'アプリ収益の約10%（柔軟に交渉可能）' },
        { label: 'プラットフォーム料金', value: 'ローンチ後 $50/月（ホスティング＋月1回の小修正）' },
        { label: 'MVPスコープ', value: 'キックオフ時に確定。変更は別途料金' },
        { label: 'IP所有権', value: '共有（エクイティ割合に比例）' },
        { label: 'キルスイッチ', value: '90日未払いで契約終了、コードの権利はオペレーターへ' },
        { label: '権利復帰', value: '6ヶ月以内にローンチしない場合、コードの権利はオペレーターへ' },
        { label: 'ポートフォリオ権', value: 'オペレーターは常に本プロジェクトの作品を紹介する権利を保持' },
      ]
    : [
        { label: 'Equity', value: '10% via SAFE note (converts on incorporation)' },
        { label: 'Revenue Share', value: '~10% of app revenue (flexible per deal)' },
        { label: 'Platform Fee', value: '$50/mo after launch (hosting + 1 fix/mo)' },
        { label: 'MVP Scope', value: 'Locked at kickoff. Changes are charged separately.' },
        { label: 'IP Ownership', value: 'Shared — proportional to equity stake' },
        { label: 'Kill Switch', value: '90 days unpaid → agreement terminates, code rights to operator' },
        { label: 'Reversion', value: 'No launch within 6 months → code rights revert to operator' },
        { label: 'Portfolio Rights', value: 'Operator retains right to showcase this work at all times' },
      ];

  const canSubmit = signatureName.trim().length >= 2 && accepted;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {isJa ? 'ビジネス・契約条件' : 'Business & Legal'}
      </h2>

      {/* Optional entity name */}
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

      {/* Terms display */}
      <div className="border border-[#374151] rounded p-5 space-y-3">
        <p className="text-[#9CA3AF] text-xs font-mono uppercase tracking-widest mb-4">
          {isJa ? 'パートナーシップの主要条件' : 'Key Partnership Terms'}
        </p>
        {terms.map((term) => (
          <div key={term.label} className="flex gap-3 text-sm font-mono">
            <span className="text-[#00E87A] shrink-0 w-36">{term.label}</span>
            <span className="text-[#F4F4F2]">{term.value}</span>
          </div>
        ))}
        <div className="pt-3 border-t border-[#374151] mt-3">
          <p className="text-[#6B7280] text-xs font-mono leading-relaxed">
            {isJa
              ? '本条件は、ZeroEnとの標準パートナーシップ契約（Terms v1.0）の主要項目です。電子的に同意することで、法的拘束力を持つ合意が成立します。'
              : 'These are the key terms of the standard ZeroEn partnership agreement (Terms v1.0). Your electronic acceptance constitutes a legally binding agreement.'}
          </p>
        </div>
      </div>

      {/* Typed signature */}
      <div>
        <label className={labelClass}>
          {isJa ? 'フルネームを入力して署名 *' : 'Type Your Full Name to Sign *'}
        </label>
        <input
          type="text"
          value={signatureName}
          onChange={(e) => setSignatureName(e.target.value)}
          placeholder={isJa ? '例: 山田 太郎' : 'e.g. Jane Smith'}
          className={inputClass}
          autoComplete="name"
          required
        />
        <p className="text-[#6B7280] text-xs font-mono mt-1.5">
          {isJa
            ? 'これが法的署名として機能します。'
            : 'This serves as your legal electronic signature.'}
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
          {isJa
            ? '上記の条件を読み、理解し、同意します。本同意は電子署名として法的拘束力を持つことを認識しています。'
            : 'I have read, understood, and agree to the terms above. I acknowledge that this acceptance constitutes a legally binding electronic agreement.'}
        </span>
      </label>

      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

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
          disabled={!canSubmit}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isJa ? '次へ →' : 'Next →'}
        </button>
      </div>
    </form>
  );
}
