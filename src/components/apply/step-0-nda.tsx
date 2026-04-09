'use client';

import { useState } from 'react';
import Link from 'next/link';
import { step0Schema } from '@/lib/validations/application';
import type { ApplicationFormData } from '@/lib/validations/application';

interface Step0Props {
  data: Partial<ApplicationFormData>;
  onNext: (data: Pick<ApplicationFormData, 'nda_accepted'>) => void;
  locale: string;
}

const errorClass = 'mt-1 text-red-400 text-xs font-mono';

export function Step0Nda({ data, onNext, locale }: Step0Props) {
  const [accepted, setAccepted] = useState<boolean>(data.nda_accepted === true);
  const [error, setError] = useState('');

  const isJa = locale === 'ja';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step0Schema.safeParse({ nda_accepted: accepted || undefined });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'You must agree to the confidentiality agreement');
      return;
    }
    setError('');
    onNext({ nda_accepted: true });
  };

  const points = isJa
    ? [
        '書面による合意なしに、あなたのアイデアを共有・複製・使用しません',
        'これは相互のものです — 私たちも同じ条件に縛られています',
        'いつでも全データの削除を依頼できます',
        '不採択の申し込みは30日以内に削除されます',
      ]
    : [
        'We will not share, copy, or use your idea without written agreement',
        "This is mutual — we're bound by the same terms",
        'You can request deletion of all your data at any time',
        'Rejected applications are wiped within 30 days',
      ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-2">
          {isJa ? 'アイデアを共有する前に' : 'Before you share your idea'}
        </h2>
        <p className="text-[#9CA3AF] text-sm font-mono">
          {isJa
            ? 'あなたの信頼を大切にします。私たちの約束：'
            : 'We take your trust seriously. Here\'s our commitment:'}
        </p>
      </div>

      <ul className="space-y-3">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-mono text-[#F4F4F2]">
            <span className="text-[#00E87A] mt-0.5 shrink-0">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div>
        <Link
          href={`/${locale}/terms#confidentiality`}
          target="_blank"
          className="text-[#00E87A] text-xs font-mono underline underline-offset-2 hover:text-[#00d070]"
        >
          {isJa ? '秘密保持条項の全文を読む →' : 'Read full confidentiality terms →'}
        </Link>
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
              ? '相互秘密保持契約を読み、同意しました'
              : "I've read and agree to the mutual confidentiality agreement"}
          </span>
        </label>
        {error && <p className={errorClass}>{error}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!accepted}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isJa ? '申し込みを続ける →' : 'Continue to application →'}
        </button>
      </div>
    </form>
  );
}
