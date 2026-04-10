'use client';

import { X } from 'lucide-react';

export type ApplicationData = {
  idea_name: string;
  idea_description: string;
  problem_solved: string;
  target_users: string;
  competitors: string | null;
  monetization_plan: string;
  founder_name: string;
  founder_background: string;
  founder_commitment: string;
  linkedin_url: string | null;
  score_viability: number | null;
  score_commitment: number | null;
  score_feasibility: number | null;
  score_market: number | null;
  score_rationale: {
    viability?: string;
    commitment?: string;
    feasibility?: string;
    market?: string;
    summary?: string;
  } | null;
  created_at: string;
};

interface Props {
  application: ApplicationData;
  locale: string;
  open: boolean;
  onClose: () => void;
}

function ScorePips({ score }: { score: number | null }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((pip) => (
        <div
          key={pip}
          className={`h-1 w-4 rounded-full ${score !== null && pip <= score ? 'bg-[#00E87A]' : 'bg-[#374151]'}`}
        />
      ))}
    </div>
  );
}

export function ApplicationDrawer({ application, locale, open, onClose }: Props) {
  const isJa = locale === 'ja';

  const total = [
    application.score_viability,
    application.score_commitment,
    application.score_feasibility,
    application.score_market,
  ].every((s) => s !== null)
    ? (application.score_viability! + application.score_commitment! + application.score_feasibility! + application.score_market!)
    : null;

  const scoreDimensions = [
    { label: isJa ? 'アイデア' : 'Idea Viability', score: application.score_viability, rationale: application.score_rationale?.viability },
    { label: isJa ? 'コミット' : 'Commitment', score: application.score_commitment, rationale: application.score_rationale?.commitment },
    { label: isJa ? '実現性' : 'Feasibility', score: application.score_feasibility, rationale: application.score_rationale?.feasibility },
    { label: isJa ? '市場性' : 'Market', score: application.score_market, rationale: application.score_rationale?.market },
  ];

  const fields = [
    { label: isJa ? 'アイデア名' : 'Idea Name', value: application.idea_name },
    { label: isJa ? 'アイデアの説明' : 'Description', value: application.idea_description },
    { label: isJa ? '解決する問題' : 'Problem Solved', value: application.problem_solved },
    { label: isJa ? 'ターゲットユーザー' : 'Target Users', value: application.target_users },
    { label: isJa ? '収益化計画' : 'Monetization', value: application.monetization_plan },
    ...(application.competitors ? [{ label: isJa ? '競合' : 'Competitors', value: application.competitors }] : []),
    { label: isJa ? '創業者名' : 'Founder', value: application.founder_name },
    { label: isJa ? 'バックグラウンド' : 'Background', value: application.founder_background },
    { label: isJa ? 'コミット' : 'Commitment', value: application.founder_commitment },
    ...(application.linkedin_url ? [{ label: 'LinkedIn', value: application.linkedin_url }] : []),
  ];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-[#0D0D0D] border-l border-[#374151] flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151] shrink-0">
          <div>
            <p className="text-[#F4F4F2] font-mono font-bold text-sm">
              {isJa ? 'あなたの応募内容' : 'Your Application'}
            </p>
            <p className="text-[#6B7280] font-mono text-xs mt-0.5">
              {application.idea_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#F4F4F2] transition-colors p-1 rounded"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Fields */}
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.label}>
                <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-1">
                  {field.label}
                </p>
                <p className="text-[#F4F4F2] text-sm font-mono leading-relaxed whitespace-pre-wrap">
                  {field.value}
                </p>
              </div>
            ))}
          </div>

          {/* AI Evaluation */}
          {total !== null && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest">
                  {isJa ? 'AI評価' : 'AI Evaluation'}
                </p>
                <span className={`text-sm font-mono font-bold ${
                  total >= 15 ? 'text-[#00E87A]' : total >= 12 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {total}/20
                </span>
              </div>

              <div className="border border-[#374151] rounded divide-y divide-[#374151]">
                {scoreDimensions.map((dim) => (
                  <div key={dim.label} className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#F4F4F2] font-mono text-xs font-bold">{dim.label}</span>
                      <div className="flex items-center gap-2">
                        <ScorePips score={dim.score} />
                        <span className="text-[#6B7280] font-mono text-xs">{dim.score}/5</span>
                      </div>
                    </div>
                    {dim.rationale && (
                      <p className="text-[#9CA3AF] font-mono text-xs leading-relaxed">{dim.rationale}</p>
                    )}
                  </div>
                ))}

                {application.score_rationale?.summary && (
                  <div className="p-3">
                    <p className="text-[#9CA3AF] font-mono text-xs leading-relaxed">
                      {application.score_rationale.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
