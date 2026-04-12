'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PlanChangeModal } from './plan-change-modal';
import { formatDate } from '@/lib/date-utils';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PLAN_MONTHLY_JPY } from '@/lib/billing/plan-prices';
import { computeCommitmentStatus } from '@/lib/billing/commitment';

interface BillingClientProps {
  planTier: 'basic' | 'premium' | null;
  commitmentStartsAt: string | null;
  stripeSubscriptionId: string | null;
  projectStatus: string | null;
  pendingPlanTier: 'basic' | 'premium' | null;
  pendingPlanEffectiveAt: string | null;
  stripeSubscriptionScheduleId: string | null;
  locale: string;
}

const PLAN_PRICES: Record<'basic' | 'premium', string> = {
  basic: '¥5,000/mo',
  premium: '¥10,000/mo',
};

export function BillingClient({
  planTier,
  commitmentStartsAt,
  stripeSubscriptionId,
  projectStatus,
  pendingPlanTier,
  pendingPlanEffectiveAt,
  stripeSubscriptionScheduleId,
  locale,
}: BillingClientProps) {
  const t = useTranslations('billing');
  const tCommon = useTranslations('common');
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [cancelStep, setCancelStep] = useState<'idle' | 'confirm' | 'loading' | 'done' | 'error' | 'payment_failed'>('idle');
  const [cancelError, setCancelError] = useState('');
  const [cancelInvoiceUrl, setCancelInvoiceUrl] = useState('');
  const [cancelConfirmText, setCancelConfirmText] = useState('');
  const [cancelPendingLoading, setCancelPendingLoading] = useState(false);
  const [pendingCancelled, setPendingCancelled] = useState(false);

  const isPaused = projectStatus === 'paused' || projectStatus === 'terminated';

  // No subscription yet
  if (!planTier || !stripeSubscriptionId) {
    return (
      <div className="border border-[#374151] rounded-lg bg-[#111827] p-6">
        <p className="text-[#9CA3AF] text-sm font-mono">
          {t('noSubscription')}
        </p>
      </div>
    );
  }

  const isPremium = planTier === 'premium';
  const { end: commitmentEnd, withinCommitment, remainingMonths } = computeCommitmentStatus(commitmentStartsAt);

  const PLAN_FEATURES: Record<'basic' | 'premium', string[]> = {
    basic: [
      t('hostingIncluded'),
      t('oneChangePerMonth'),
      t('pdfAnalytics'),
    ],
    premium: [
      t('hostingIncluded'),
      t('twoChangesPerMonth'),
      t('fullYearAnalytics'),
      t('quarterlyAudits'),
    ],
  };

  const features = PLAN_FEATURES[planTier];

  // Early termination cost (full remaining months, no cap)
  const monthlyPrice = PLAN_MONTHLY_JPY[planTier];
  const earlyCancelCost = withinCommitment ? `¥${(remainingMonths * monthlyPrice).toLocaleString()}` : '';

  const cancelConfirmWord = 'CANCEL';
  const canConfirmCancel = cancelConfirmText.trim().toUpperCase() === cancelConfirmWord;

  const handleCancel = async () => {
    setCancelStep('loading');
    setCancelError('');
    try {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await res.json();
      if (res.status === 402 && data.error === 'payment_failed') {
        setCancelInvoiceUrl(data.invoice_url ?? '');
        setCancelStep('payment_failed');
        return;
      }
      if (!res.ok) {
        setCancelError(data.error ?? tCommon('somethingWentWrong'));
        setCancelStep('error');
        return;
      }
      setCancelStep('done');
    } catch {
      setCancelError(tCommon('somethingWentWrong'));
      setCancelStep('error');
    }
  };

  const handleCancelPendingChange = async () => {
    setCancelPendingLoading(true);
    try {
      const res = await fetch('/api/stripe/cancel-pending-change', {
        method: 'POST',
      });
      if (res.ok) {
        setPendingCancelled(true);
      }
    } finally {
      setCancelPendingLoading(false);
    }
  };

  const hasPendingDowngrade = !pendingCancelled && !!pendingPlanTier && !!stripeSubscriptionScheduleId;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
              {t('currentPlanLabel')}
            </p>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                  isPremium
                    ? 'text-[#00E87A] bg-[#00E87A]/10 border-[#00E87A]/30'
                    : 'text-[#9CA3AF] bg-[#374151]/50 border-[#374151]'
                }`}
              >
                {isPremium ? 'Premium' : 'Basic'}
              </span>
              {isPaused && (
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded border text-red-400 bg-red-400/10 border-red-400/30">
                  {tCommon('status.paused')}
                </span>
              )}
            </div>
          </div>
          <p className="text-[#F4F4F2] font-mono font-bold text-lg shrink-0">
            {PLAN_PRICES[planTier]}
          </p>
        </div>

        <ul className="space-y-1.5">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF]">
              <CheckCircle2 size={12} className={isPremium ? 'text-[#00E87A]' : 'text-[#6B7280]'} />
              {f}
            </li>
          ))}
        </ul>

        {/* Commitment period */}
        {commitmentStartsAt && commitmentEnd && (
          <div className="border-t border-[#374151] pt-4 space-y-1">
            <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
              {t('commitmentPeriod')}
            </p>
            <p className="text-[#9CA3AF] text-xs font-mono">
              <span className="text-[#6B7280]">{t('started')} </span>
              <span className="text-[#F4F4F2]">{formatDate(commitmentStartsAt, locale)}</span>
            </p>
            <p className="text-[#9CA3AF] text-xs font-mono">
              <span className="text-[#6B7280]">{t('minimumTermEnds')} </span>
              <span className="text-[#F4F4F2]">{formatDate(commitmentEnd.toISOString(), locale)}</span>
            </p>
            {withinCommitment && (
              <p className="text-[#F59E0B] text-xs font-mono mt-2">
                {t('monthsRemaining', { n: remainingMonths })}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Pending downgrade banner */}
      {hasPendingDowngrade && pendingPlanEffectiveAt && (
        <section className="border border-[#F59E0B]/30 rounded-lg bg-[#F59E0B]/5 p-4 space-y-2">
          <p className="text-[#F59E0B] text-xs font-mono font-bold">
            {t('scheduledDowngradeTitle')}
          </p>
          <p className="text-[#9CA3AF] text-xs font-mono">
            {t('scheduledDowngradeDesc', { date: formatDate(pendingPlanEffectiveAt, locale) })}
          </p>
          <button
            onClick={handleCancelPendingChange}
            disabled={cancelPendingLoading}
            className="text-[#00E87A] text-xs font-mono font-bold hover:text-[#00E87A]/80 transition-colors underline underline-offset-2 disabled:opacity-50"
          >
            {cancelPendingLoading ? tCommon('processing') : t('cancelScheduledDowngrade')}
          </button>
        </section>
      )}

      {/* Change Plan */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-6 space-y-3">
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest">
          {t('changePlan')}
        </p>
        <p className="text-[#9CA3AF] text-xs font-mono leading-relaxed">
          {isPremium ? t('downgradeNote') : t('upgradeNote')}
        </p>

        {/* Upgrade warning */}
        {!isPremium && (
          <div className="border border-[#F59E0B]/20 rounded-lg p-3 bg-[#F59E0B]/5">
            <p className="text-[#F59E0B] text-xs font-mono leading-relaxed flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              {t('upgradeDetail')}
            </p>
          </div>
        )}

        {/* Downgrade within commitment — inform, don't block */}
        {isPremium && withinCommitment && commitmentEnd && !hasPendingDowngrade && (
          <div className="border border-[#374151]/50 rounded-lg p-3 bg-[#0D0D0D]">
            <p className="text-[#9CA3AF] text-xs font-mono leading-relaxed flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5 text-[#6B7280]" />
              {t('downgradeScheduleNote', { date: formatDate(commitmentEnd.toISOString(), locale) })}
            </p>
          </div>
        )}

        {!hasPendingDowngrade && (
          <button
            onClick={() => setChangeModalOpen(true)}
            className="text-[#00E87A] text-xs font-mono font-bold hover:text-[#00E87A]/80 transition-colors underline underline-offset-2"
          >
            {isPremium ? t('downgradeButton') : t('upgradeButton')}
          </button>
        )}
      </section>

      {/* Cancel Subscription */}
      <section className="border border-red-400/20 rounded-lg bg-[#111827] p-6 space-y-3">
        <p className="text-red-400 text-xs font-mono uppercase tracking-widest font-bold">
          {t('cancelSubscription')}
        </p>

        {cancelStep === 'done' ? (
          <div className="border border-[#00E87A]/30 bg-[#00E87A]/10 rounded-lg p-4">
            <p className="text-[#00E87A] text-sm font-mono font-bold">
              {t('subscriptionCancelled')}
            </p>
            <p className="text-[#9CA3AF] text-xs font-mono mt-1">
              {t('cancelledDesc')}
            </p>
          </div>
        ) : cancelStep === 'payment_failed' ? (
          <div className="space-y-3">
            <div className="border border-red-400/30 bg-red-400/10 rounded-lg p-4 space-y-2">
              <p className="text-red-400 text-sm font-mono font-bold flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                {t('paymentFailed')}
              </p>
              <p className="text-[#9CA3AF] text-xs font-mono">
                {t('paymentFailedDesc')}
              </p>
              {cancelInvoiceUrl && (
                <a
                  href={cancelInvoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#00E87A] text-xs font-mono font-bold underline underline-offset-2 hover:text-[#00E87A]/80 transition-colors"
                >
                  {t('payInvoice')}
                </a>
              )}
            </div>
            <button
              onClick={() => { setCancelStep('idle'); setCancelConfirmText(''); }}
              className="text-[#9CA3AF] text-xs font-mono hover:text-[#F4F4F2] transition-colors"
            >
              {t('goBack')}
            </button>
          </div>
        ) : cancelStep === 'error' ? (
          <>
            <div className="border border-red-400/30 bg-red-400/10 rounded-lg p-4">
              <p className="text-red-400 text-sm font-mono font-bold">
                {tCommon('somethingWentWrong')}
              </p>
              <p className="text-[#9CA3AF] text-xs font-mono mt-1">{cancelError}</p>
            </div>
            <button
              onClick={() => setCancelStep('idle')}
              className="text-[#9CA3AF] text-xs font-mono hover:text-[#F4F4F2] transition-colors"
            >
              {t('goBack')}
            </button>
          </>
        ) : (cancelStep === 'confirm' || cancelStep === 'loading') ? (
          <div className="space-y-4">
            {/* Final warning */}
            <div className="border border-red-400/30 bg-red-400/10 rounded-lg p-4 space-y-2">
              <p className="text-red-400 text-sm font-mono font-bold flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                {t('confirmCancel')}
              </p>
              <ul className="text-[#9CA3AF] text-xs font-mono space-y-1.5 ml-5">
                <li>• {t('cancelWarning1')}</li>
                <li>• {t('cancelWarning2')}</li>
                <li>• {t('cancelWarning3')}</li>
                {withinCommitment && (
                  <li className="text-red-400 font-bold">
                    • {t('earlyTerminationFee', { cost: earlyCancelCost, n: remainingMonths })}
                  </li>
                )}
                {withinCommitment && (
                  <li className="text-red-400 font-bold">
                    • {t('earlyTerminationChargeImmediate')}
                  </li>
                )}
              </ul>
            </div>

            {/* Typed confirmation */}
            <div className="space-y-2">
              <p className="text-[#9CA3AF] text-xs font-mono">
                {t('typedConfirmPrompt', { word: cancelConfirmWord })}
              </p>
              <input
                type="text"
                value={cancelConfirmText}
                onChange={(e) => setCancelConfirmText(e.target.value)}
                placeholder={cancelConfirmWord}
                disabled={cancelStep === 'loading'}
                className="w-full bg-[#0D0D0D] border border-[#374151] rounded-lg px-3 py-2 text-xs font-mono text-[#F4F4F2] placeholder-[#4B5563] focus:outline-none focus:border-red-400/50 disabled:opacity-50"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                disabled={cancelStep === 'loading' || !canConfirmCancel}
                className="px-4 py-2 text-xs font-mono font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelStep === 'loading' ? tCommon('processing') : t('confirmCancellation')}
              </button>
              <button
                onClick={() => { setCancelStep('idle'); setCancelConfirmText(''); }}
                disabled={cancelStep === 'loading'}
                className="px-4 py-2 text-xs font-mono text-[#9CA3AF] hover:text-[#F4F4F2] transition-colors disabled:opacity-50"
              >
                {t('goBackButton')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[#9CA3AF] text-xs font-mono leading-relaxed">
              {t('cancellationNote')}
            </p>
            {withinCommitment && (
              <div className="border border-red-400/30 bg-red-400/10 rounded-lg p-3">
                <p className="text-red-400 text-xs font-mono leading-relaxed flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  {t('commitmentPeriodNote', { cost: earlyCancelCost })}
                </p>
              </div>
            )}
            <button
              onClick={() => setCancelStep('confirm')}
              className="text-red-400 text-xs font-mono font-bold hover:text-red-300 transition-colors underline underline-offset-2"
            >
              {t('cancelLink')}
            </button>
          </>
        )}
      </section>

      {/* Plan change modal */}
      {commitmentStartsAt && (
        <PlanChangeModal
          currentPlan={planTier}
          commitmentStartsAt={commitmentStartsAt}
          locale={locale}
          open={changeModalOpen}
          onClose={() => setChangeModalOpen(false)}
        />
      )}
    </div>
  );
}
