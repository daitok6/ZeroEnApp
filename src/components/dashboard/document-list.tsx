'use client';

import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

export type DocumentItem = {
  id: string;
  type: 'nda' | 'partnership';
  signedAt: string;
  details?: {
    signature_name?: string;
    entity_name?: string | null;
    terms_version?: string;
    ip_address?: string;
  };
};

interface Props {
  documents: DocumentItem[];
  locale: string;
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const NDA_POINTS_EN = [
  'We will not share, copy, or use your idea without written agreement',
  "This is mutual — we're bound by the same terms",
  'You can request deletion of all your data at any time',
  'Rejected applications are wiped within 30 days',
];

const NDA_POINTS_JA = [
  '書面による合意なしに、あなたのアイデアを共有・複製・使用しません',
  'これは相互のものです — 私たちも同じ条件に縛られています',
  'いつでも全データの削除を依頼できます',
  '不採択の申し込みは30日以内に削除されます',
];

const PARTNERSHIP_TERMS_EN = [
  { label: 'Equity', value: '10% via SAFE note (converts on incorporation)' },
  { label: 'Revenue Share', value: '~10% of app revenue (flexible per deal)' },
  { label: 'Platform Fee', value: '$50/mo after launch (hosting + 1 fix/mo)' },
  { label: 'MVP Scope', value: 'Locked at kickoff. Changes are charged separately.' },
  { label: 'IP Ownership', value: 'Shared — proportional to equity stake' },
  { label: 'Kill Switch', value: '90 days unpaid → agreement terminates, code rights to operator' },
  { label: 'Reversion', value: 'No launch within 6 months → code rights revert to operator' },
  { label: 'Portfolio Rights', value: 'Operator retains right to showcase this work at all times' },
];

const PARTNERSHIP_TERMS_JA = [
  { label: 'エクイティ', value: 'SAFE note経由で10%（法人化時に転換）' },
  { label: 'レベニューシェア', value: 'アプリ収益の約10%（柔軟に交渉可能）' },
  { label: 'プラットフォーム料金', value: 'ローンチ後 $50/月（ホスティング＋月1回の小修正）' },
  { label: 'MVPスコープ', value: 'キックオフ時に確定。変更は別途料金' },
  { label: 'IP所有権', value: '共有（エクイティ割合に比例）' },
  { label: 'キルスイッチ', value: '90日未払いで契約終了、コードの権利はオペレーターへ' },
  { label: '権利復帰', value: '6ヶ月以内にローンチしない場合、コードの権利はオペレーターへ' },
  { label: 'ポートフォリオ権', value: 'オペレーターは常に本プロジェクトの作品を紹介する権利を保持' },
];

export function DocumentList({ documents, locale }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const isJa = locale === 'ja';

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (documents.length === 0) {
    return (
      <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
        <p className="text-[#9CA3AF] font-mono text-sm">
          {isJa
            ? 'プロジェクト開始後に書類が表示されます'
            : 'Documents will appear once your project is underway'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const isOpen = expanded[doc.id] ?? false;
        const title =
          doc.type === 'nda'
            ? isJa
              ? '相互秘密保持契約'
              : 'Mutual Confidentiality Agreement'
            : isJa
            ? 'パートナーシップ契約'
            : 'Partnership Agreement';

        return (
          <div
            key={doc.id}
            className="border border-[#374151] rounded-lg bg-[#111827] overflow-hidden"
          >
            {/* Card header */}
            <div className="flex items-center gap-4 p-4">
              <div className="shrink-0 w-9 h-9 rounded bg-[#00E87A]/10 flex items-center justify-center">
                <FileText size={16} className="text-[#00E87A]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[#F4F4F2] text-sm font-mono font-bold truncate">{title}</p>
                <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                  {isJa ? '署名日: ' : 'Signed: '}
                  {formatDate(doc.signedAt, locale)}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/20">
                  {isJa ? '署名済み' : 'Signed'}
                </span>
                <button
                  onClick={() => toggle(doc.id)}
                  className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#F4F4F2] text-xs font-mono transition-colors"
                >
                  {isOpen ? (
                    <>
                      {isJa ? '閉じる' : 'Close'}
                      <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      {isJa ? '詳細' : 'View'}
                      <ChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Expanded content */}
            {isOpen && (
              <div className="border-t border-[#374151] p-4 space-y-4 bg-[#0D0D0D]">
                {doc.type === 'nda' ? (
                  <div className="space-y-3">
                    <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest">
                      {isJa ? '秘密保持の約束' : 'Confidentiality Commitments'}
                    </p>
                    <ul className="space-y-2">
                      {(isJa ? NDA_POINTS_JA : NDA_POINTS_EN).map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-mono text-[#F4F4F2]">
                          <span className="text-[#00E87A] mt-0.5 shrink-0">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[#6B7280] text-xs font-mono pt-2 border-t border-[#374151]">
                      {isJa
                        ? `${formatDate(doc.signedAt, locale)} に電子的に同意しました`
                        : `Electronically accepted on ${formatDate(doc.signedAt, locale)}`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest">
                      {isJa ? 'パートナーシップの主要条件' : 'Key Partnership Terms'}
                    </p>
                    <div className="space-y-2">
                      {(isJa ? PARTNERSHIP_TERMS_JA : PARTNERSHIP_TERMS_EN).map((term) => (
                        <div key={term.label} className="flex gap-3 text-sm font-mono">
                          <span className="text-[#00E87A] shrink-0 w-32 sm:w-36">{term.label}</span>
                          <span className="text-[#F4F4F2]">{term.value}</span>
                        </div>
                      ))}
                    </div>
                    {doc.details && (
                      <div className="pt-3 border-t border-[#374151] space-y-1.5">
                        {doc.details.signature_name && (
                          <div className="flex gap-3 text-xs font-mono">
                            <span className="text-[#6B7280] shrink-0 w-32">
                              {isJa ? '電子署名' : 'Signature'}
                            </span>
                            <span className="text-[#F4F4F2]">{doc.details.signature_name}</span>
                          </div>
                        )}
                        {doc.details.entity_name && (
                          <div className="flex gap-3 text-xs font-mono">
                            <span className="text-[#6B7280] shrink-0 w-32">
                              {isJa ? '会社・プロジェクト名' : 'Entity'}
                            </span>
                            <span className="text-[#F4F4F2]">{doc.details.entity_name}</span>
                          </div>
                        )}
                        {doc.details.terms_version && (
                          <div className="flex gap-3 text-xs font-mono">
                            <span className="text-[#6B7280] shrink-0 w-32">
                              {isJa ? '条件バージョン' : 'Terms Version'}
                            </span>
                            <span className="text-[#F4F4F2]">{doc.details.terms_version}</span>
                          </div>
                        )}
                        <div className="flex gap-3 text-xs font-mono">
                          <span className="text-[#6B7280] shrink-0 w-32">
                            {isJa ? '署名日時' : 'Signed At'}
                          </span>
                          <span className="text-[#F4F4F2]">
                            {new Date(doc.signedAt).toLocaleString(isJa ? 'ja-JP' : 'en-US')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
