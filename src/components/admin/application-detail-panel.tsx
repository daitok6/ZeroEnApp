'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CheckCircle, XCircle, Clock, Search, Sparkles, ExternalLink } from 'lucide-react';

const STATUS_ICONS = {
  pending: Clock,
  reviewing: Search,
  accepted: CheckCircle,
  rejected: XCircle,
};

const STATUS_STYLES = {
  pending: { color: 'text-yellow-400', bgColor: 'bg-yellow-400/10 border-yellow-400/20' },
  reviewing: { color: 'text-blue-400', bgColor: 'bg-blue-400/10 border-blue-400/20' },
  accepted: { color: 'text-[#00E87A]', bgColor: 'bg-[#00E87A]/10 border-[#00E87A]/20' },
  rejected: { color: 'text-red-400', bgColor: 'bg-red-400/10 border-red-400/20' },
};

const RECOMMENDATION_CONFIG = {
  ACCEPT: { color: 'text-[#00E87A]', bg: 'bg-[#00E87A]/10 border-[#00E87A]/30' },
  BORDERLINE: { color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  REJECT: { color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
};

const SCORE_DIMENSION_KEYS = [
  { key: 'viability' as const, labelKey: 'ideaViability' as const, scoreKey: 'score_viability' as const },
  { key: 'commitment' as const, labelKey: 'founderCommitment' as const, scoreKey: 'score_commitment' as const },
  { key: 'feasibility' as const, labelKey: 'techFeasibility' as const, scoreKey: 'score_feasibility' as const },
  { key: 'market' as const, labelKey: 'marketPotential' as const, scoreKey: 'score_market' as const },
];

export type ScoreRationale = {
  viability: string;
  commitment: string;
  feasibility: string;
  market: string;
  recommendation: string;
  summary: string;
};

export type Application = {
  id: string;
  idea_name: string;
  idea_description: string;
  problem_solved: string;
  target_users: string;
  competitors: string | null;
  monetization_plan: string;
  founder_name: string;
  founder_email: string;
  founder_background: string;
  founder_commitment: string;
  linkedin_url: string | null;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  score_viability: number | null;
  score_commitment: number | null;
  score_feasibility: number | null;
  score_market: number | null;
  score_rationale: ScoreRationale | null;
  user_id: string | null;
  created_at: string;
};

type Props = {
  application: Application | null;
  open: boolean;
  onClose: () => void;
  onScored: (updated: Partial<Application>) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  actionLoading: string | null;
};

function ScoreBar({ score }: { score: number | null }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((pip) => (
        <div
          key={pip}
          className={`h-1.5 w-5 rounded-full transition-colors ${
            score !== null && pip <= score
              ? 'bg-[#00E87A]'
              : 'bg-[#374151]'
          }`}
        />
      ))}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-[#6B7280] font-mono text-xs uppercase tracking-wide">{label}</p>
      <p className="text-[#F4F4F2] font-mono text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function totalScore(app: Application) {
  const scores = [app.score_viability, app.score_commitment, app.score_feasibility, app.score_market].filter((s) => s !== null) as number[];
  return scores.length === 4 ? scores.reduce((a, b) => a + b, 0) : null;
}

function scoreColor(total: number | null) {
  if (total === null) return 'text-[#6B7280]';
  if (total >= 15) return 'text-[#00E87A]';
  if (total >= 12) return 'text-yellow-400';
  return 'text-red-400';
}

export function ApplicationDetailPanel({
  application,
  open,
  onClose,
  onScored,
  onApprove,
  onReject,
  actionLoading,
}: Props) {
  const t = useTranslations('admin');
  const tStatus = useTranslations('common.status');
  const [scoring, setScoring] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);

  async function handleScore() {
    if (!application) return;
    setScoring(true);
    setScoreError(null);
    try {
      const res = await fetch(`/api/admin/applications/${application.id}/score`, { method: 'POST' });
      if (!res.ok) {
        const json = await res.json();
        setScoreError(json.error ?? t('scoringFailed'));
        return;
      }
      const data = await res.json();
      onScored(data);
    } catch {
      setScoreError(t('networkError'));
    } finally {
      setScoring(false);
    }
  }

  if (!application) return null;

  const statusStyle = STATUS_STYLES[application.status];
  const StatusIcon = STATUS_ICONS[application.status];
  const total = totalScore(application);
  const isActioning = actionLoading?.startsWith(application.id);
  const recommendation = application.score_rationale?.recommendation as keyof typeof RECOMMENDATION_CONFIG | undefined;
  const recConfig = recommendation ? RECOMMENDATION_CONFIG[recommendation] : null;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] bg-[#0D0D0D] border-[#374151] p-0 overflow-y-auto"
        showCloseButton={true}
      >
        <SheetHeader className="p-5 border-b border-[#374151] sticky top-0 bg-[#0D0D0D] z-10">
          <div className="flex items-start justify-between gap-3 pr-8">
            <SheetTitle className="text-[#F4F4F2] font-mono font-bold text-base leading-tight">
              {application.idea_name}
            </SheetTitle>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-mono font-bold shrink-0 ${statusStyle.bgColor} ${statusStyle.color}`}>
              <StatusIcon size={11} />
              {tStatus(application.status as Parameters<typeof tStatus>[0])}
            </div>
          </div>
          <p className="text-[#6B7280] font-mono text-xs mt-1">
            {application.founder_name} · {application.founder_email}
          </p>
          <p className="text-[#6B7280] font-mono text-xs">
            {new Date(application.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </SheetHeader>

        <div className="p-5 space-y-6">

          {/* Application Details */}
          <section className="space-y-4">
            <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest">{t('application')}</p>
            <div className="space-y-4 border border-[#374151] rounded-lg bg-[#111827] p-4">
              <DetailField label={t('idea')} value={application.idea_description} />
              <DetailField label={t('problemSolved')} value={application.problem_solved} />
              <DetailField label={t('targetUsers')} value={application.target_users} />
              {application.competitors && <DetailField label={t('competitors')} value={application.competitors} />}
              <DetailField label={t('monetization')} value={application.monetization_plan} />
            </div>
          </section>

          {/* Founder Details */}
          <section className="space-y-4">
            <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest">{t('founder')}</p>
            <div className="space-y-4 border border-[#374151] rounded-lg bg-[#111827] p-4">
              <DetailField label={t('background')} value={application.founder_background} />
              <DetailField label={t('commitment')} value={application.founder_commitment} />
              {application.linkedin_url && (
                <div className="space-y-1">
                  <p className="text-[#6B7280] font-mono text-xs uppercase tracking-wide">LinkedIn</p>
                  <a
                    href={application.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[#00E87A] font-mono text-sm hover:underline"
                  >
                    {t('viewProfile')}
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Score Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest">{t('aiScore')}</p>
              {total !== null && (
                <span className={`font-mono text-sm font-bold ${scoreColor(total)}`}>
                  {total}/20
                </span>
              )}
            </div>

            {total !== null && application.score_rationale ? (
              <div className="space-y-3">
                {/* Recommendation badge */}
                {recConfig && recommendation && (
                  <div className={`flex items-center justify-between px-3 py-2 rounded border font-mono text-sm font-bold ${recConfig.bg} ${recConfig.color}`}>
                    <span>{t('recommendation')}</span>
                    <span>{recommendation}</span>
                  </div>
                )}

                {/* Dimension scores */}
                <div className="border border-[#374151] rounded-lg bg-[#111827] divide-y divide-[#374151]">
                  {SCORE_DIMENSION_KEYS.map((dim) => {
                    const score = application[dim.scoreKey];
                    const rationale = application.score_rationale?.[dim.key];
                    return (
                      <div key={dim.key} className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#F4F4F2] font-mono text-xs font-bold">
                            {t(dim.labelKey as Parameters<typeof t>[0])}
                          </span>
                          <div className="flex items-center gap-2">
                            <ScoreBar score={score} />
                            <span className="text-[#6B7280] font-mono text-xs w-6 text-right">{score}/5</span>
                          </div>
                        </div>
                        {rationale && (
                          <p className="text-[#9CA3AF] font-mono text-xs leading-relaxed">{rationale}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                {application.score_rationale.summary && (
                  <div className="border border-[#374151] rounded-lg bg-[#111827] p-3">
                    <p className="text-[#9CA3AF] font-mono text-xs leading-relaxed">{application.score_rationale.summary}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-[#374151] rounded-lg bg-[#111827] p-4 text-center">
                <p className="text-[#6B7280] font-mono text-xs">{t('notScoredYet')}</p>
              </div>
            )}

            {/* Score button */}
            {scoreError && (
              <p className="text-red-400 font-mono text-xs">{scoreError}</p>
            )}
            <button
              onClick={handleScore}
              disabled={scoring || !!isActioning}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#374151] text-[#F4F4F2] rounded font-mono text-xs hover:border-[#00E87A]/50 hover:text-[#00E87A] disabled:opacity-50 transition-colors"
            >
              <Sparkles size={13} />
              {scoring ? t('scoring') : total !== null ? t('rescoreWithAI') : t('scoreWithAI')}
            </button>
          </section>

          {/* Actions */}
          {(application.status === 'pending' || application.status === 'reviewing') && (
            <section className="flex gap-2 pt-1">
              <button
                onClick={() => onApprove(application.id)}
                disabled={!!isActioning || scoring}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#00E87A] text-[#0D0D0D] rounded font-mono text-xs font-bold hover:bg-[#00E87A]/90 disabled:opacity-50 transition-colors"
              >
                <CheckCircle size={13} />
                {actionLoading === application.id + '-approve' ? t('approving') : t('approve')}
              </button>
              <button
                onClick={() => onReject(application.id)}
                disabled={!!isActioning || scoring}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border border-red-400/30 text-red-400 rounded font-mono text-xs hover:bg-red-400/10 disabled:opacity-50 transition-colors"
              >
                <XCircle size={13} />
                {actionLoading === application.id + '-reject' ? t('rejecting') : t('reject')}
              </button>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
