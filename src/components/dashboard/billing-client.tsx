'use client';

import { useState } from 'react';
import { PlanChangeModal } from './plan-change-modal';
import { addMonths, formatDate } from '@/lib/date-utils';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface BillingClientProps {
  planTier: 'basic' | 'premium' | null;
  commitmentStartsAt: string | null;
  stripeSubscriptionId: string | null;
  projectStatus: string | null;
  locale: string;
}

const PLAN_PRICES: Record<'basic' | 'premium', string> = {
  basic: '¥5,000/mo',
  premium: '¥10,000/mo',
};

const PLAN_FEATURES: Record<'basic' | 'premium', { en: string; ja: string }[]> = {
  basic: [
    { en: 'Hosting included', ja: 'ホスティング込み' },
    { en: '1 small change/mo', ja: '月1回の小変更' },
    { en: 'Prior-month PDF analytics', ja: '前月PDFアナリティクス' },
  ],
  premium: [
    { en: 'Hosting included', ja: 'ホスティング込み' },
    { en: '2 small or 1 medium change/mo', ja: '月2回の小変更または1回の中変更' },
    { en: 'Full-year analytics dashboard', ja: '年間アナリティクスダッシュボード' },
    { en: 'Quarterly security & SEO audits', ja: '四半期ごとのセキュリティ・SEO監査' },
  ],
};

export function BillingClient({
  planTier,
  commitmentStartsAt,
  stripeSubscriptionId,
  projectStatus,
  locale,
}: BillingClientProps) {
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [cancelStep, setCancelStep] = useState<'idle' | 'confirm' | 'loading' | 'done' | 'error'>('idle');
  const [cancelError, setCancelError] = useState('');

  const isJa = locale === 'ja';
  const isPaused = projectStatus === 'paused' || projectStatus === 'terminated';

  // No subscription yet
  if (!planTier || !stripeSubscriptionId) {
    return (
      <div className="border border-[#374151] rounded-lg bg-[#111827] p-6">
        <p className="text-[#9CA3AF] text-sm font-mono">
          {isJa
            ? 'アクティブなサブスクリプションはありません。ダッシュボードからプランを選択してください。'
            : 'No active subscription. Select a plan from your dashboard to get started.'}
        </p>
      </div>
    );
  }

  const isPremium = planTier === 'premium';
  const features = PLAN_FEATURES[planTier];
  const commitmentEnd = commitmentStartsAt ? addMonths(commitmentStartsAt, 6) : null;
  const isWithinCommitment = commitmentEnd ? commitmentEnd > new Date() : false;

  // Calculate early termination cost
  let remainingMonths = 0;
  let earlyCancelCost = '';
  if (isWithinCommitment && commitmentEnd) {
    remainingMonths = Math.ceil(
      (commitmentEnd.getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000)
    );
    const monthlyPrice = planTier === 'premium' ? 10000 : 5000;
    const remainingCost = remainingMonths * monthlyPrice;
    const buyout = 80000;
    const actualCost = Math.min(remainingCost, buyout);
    earlyCancelCost = `¥${actualCost.toLocaleString()}`;
  }

  const handleCancel = async () => {
    setCancelStep('loading');
    setCancelError('');
    try {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      });
      if (!res.ok) {
        const data = await res.json();
        setCancelError(data.error ?? 'Failed to cancel');
        setCancelStep('error');
        return;
      }
      setCancelStep('done');
    } catch {
      setCancelError(isJa ? '予期しないエラーが発生しました' : 'An unexpected error occurred');
      setCancelStep('error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
              {isJa ? '現在のプラン' : 'Current Plan'}
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
                  {isJa ? '一時停止中' : 'Paused'}
                </span>
              )}
            </div>
          </div>
          <p className="text-[#F4F4F2] font-mono font-bold text-lg shrink-0">
            {PLAN_PRICES[planTier]}
          </p>
        </div>

        <ul className="space-y-1.5">
          {features.map((f) => (
            <li key={f.en} className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF]">
              <CheckCircle2 size={12} className={isPremium ? 'text-[#00E87A]' : 'text-[#6B7280]'} />
              {isJa ? f.ja : f.en}
            </li>
          ))}
        </ul>

        {/* Commitment period */}
        {commitmentStartsAt && commitmentEnd && (
          <div className="border-t border-[#374151] pt-4 space-y-1">
            <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
              {isJa ? 'コミット期間' : 'Commitment Period'}
            </p>
            <p className="text-[#9CA3AF] text-xs font-mono">
              <span className="text-[#6B7280]">{isJa ? '開始: ' : 'Started: '}</span>
              <span className="text-[#F4F4F2]">{formatDate(commitmentStartsAt, locale)}</span>
            </p>
            <p className="text-[#9CA3AF] text-xs font-mono">
              <span className="text-[#6B7280]">{isJa ? '最短終了日: ' : 'Minimum term ends: '}</span>
              <span className="text-[#F4F4F2]">{formatDate(commitmentEnd.toISOString(), locale)}</span>
            </p>
            {isWithinCommitment && (
              <p className="text-[#F59E0B] text-xs font-mono mt-2">
                {isJa
                  ? `残り約${remainingMonths}ヶ月のコミット期間があります`
                  : `${remainingMonths} month${remainingMonths === 1 ? '' : 's'} remaining in commitment`}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Change Plan */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-6 space-y-3">
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest">
          {isJa ? 'プラン変更' : 'Change Plan'}
        </p>
        <p className="text-[#9CA3AF] text-xs font-mono leading-relaxed">
          {isPremium
            ? isJa
              ? 'Basicプランにダウングレードできます。ただし、6ヶ月のコミット期間が満了している必要があります。ダウングレードすると、監査やフルアナリティクスなどのPremium機能が利用できなくなります。'
              : 'You can downgrade to the Basic plan once your 6-month commitment period has ended. Downgrading will remove Premium features including audits and full-year analytics.'
            : isJa
              ? 'Premiumプランにアップグレードすると、より多くの変更リクエスト、フルアナリティクス、四半期ごとの監査が利用できます。アップグレードすると6ヶ月のコミット期間がリセットされます。'
              : 'Upgrade to Premium for more change requests, full analytics dashboard, and quarterly audits. Note: upgrading resets your 6-month commitment period.'}
        </p>

        {/* Upgrade warning */}
        {!isPremium && (
          <div className="border border-[#F59E0B]/20 rounded-lg p-3 bg-[#F59E0B]/5">
            <p className="text-[#F59E0B] text-xs font-mono leading-relaxed flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              {isJa
                ? 'アップグレードすると、新たに6ヶ月のコミット期間が開始されます。日割り計算で即座に適用されます。'
                : 'Upgrading starts a new 6-month commitment period. The price difference is prorated and applied immediately.'}
            </p>
          </div>
        )}

        {/* Downgrade lock warning */}
        {isPremium && isWithinCommitment && commitmentEnd && (
          <div className="border border-[#F59E0B]/20 rounded-lg p-3 bg-[#F59E0B]/5">
            <p className="text-[#F59E0B] text-xs font-mono leading-relaxed flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              {isJa
                ? `ダウングレードは${formatDate(commitmentEnd.toISOString(), locale)}以降に可能です。`
                : `Downgrading is available after ${formatDate(commitmentEnd.toISOString(), locale)}.`}
            </p>
          </div>
        )}

        <button
          onClick={() => setChangeModalOpen(true)}
          className="text-[#00E87A] text-xs font-mono font-bold hover:text-[#00E87A]/80 transition-colors underline underline-offset-2"
        >
          {isPremium
            ? isJa ? 'Basicにダウングレード' : 'Downgrade to Basic'
            : isJa ? 'Premiumにアップグレード' : 'Upgrade to Premium'}
        </button>
      </section>

      {/* Cancel Subscription */}
      <section className="border border-red-400/20 rounded-lg bg-[#111827] p-6 space-y-3">
        <p className="text-red-400 text-xs font-mono uppercase tracking-widest font-bold">
          {isJa ? 'サブスクリプションの解約' : 'Cancel Subscription'}
        </p>

        {cancelStep === 'done' ? (
          <div className="border border-[#00E87A]/30 bg-[#00E87A]/10 rounded-lg p-4">
            <p className="text-[#00E87A] text-sm font-mono font-bold">
              {isJa ? '解約が完了しました' : 'Subscription cancelled'}
            </p>
            <p className="text-[#9CA3AF] text-xs font-mono mt-1">
              {isJa
                ? '現在の請求期間の終了までサービスをご利用いただけます。その後、ウェブサイトはオフラインになります。'
                : 'You will have access until the end of your current billing period. After that, your website will be taken offline.'}
            </p>
          </div>
        ) : cancelStep === 'error' ? (
          <>
            <div className="border border-red-400/30 bg-red-400/10 rounded-lg p-4">
              <p className="text-red-400 text-sm font-mono font-bold">
                {isJa ? 'エラーが発生しました' : 'An error occurred'}
              </p>
              <p className="text-[#9CA3AF] text-xs font-mono mt-1">{cancelError}</p>
            </div>
            <button
              onClick={() => setCancelStep('idle')}
              className="text-[#9CA3AF] text-xs font-mono hover:text-[#F4F4F2] transition-colors"
            >
              {isJa ? '戻る' : 'Go back'}
            </button>
          </>
        ) : cancelStep === 'confirm' ? (
          <div className="space-y-4">
            {/* Final warning */}
            <div className="border border-red-400/30 bg-red-400/10 rounded-lg p-4 space-y-2">
              <p className="text-red-400 text-sm font-mono font-bold flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                {isJa ? '本当に解約しますか？' : 'Are you sure you want to cancel?'}
              </p>
              <ul className="text-[#9CA3AF] text-xs font-mono space-y-1.5 ml-5">
                <li>
                  {isJa
                    ? '• 現在の請求期間の終了後、ウェブサイトはオフラインになります'
                    : '• Your website will be taken offline after the current billing period ends'}
                </li>
                <li>
                  {isJa
                    ? '• 90日以内であれば未払い分を支払うことで再開可能です'
                    : '• You can reactivate within 90 days by paying any outstanding balance'}
                </li>
                <li>
                  {isJa
                    ? '• 90日を過ぎるとデータは削除されます'
                    : '• After 90 days, your project data will be permanently deleted'}
                </li>
                {isWithinCommitment && (
                  <li className="text-red-400 font-bold">
                    {isJa
                      ? `• 早期解約料が発生します: ${earlyCancelCost}（残り${remainingMonths}ヶ月分または¥80,000の少ない方）`
                      : `• Early termination fee applies: ${earlyCancelCost} (${remainingMonths} remaining month${remainingMonths === 1 ? '' : 's'} or ¥80,000 buyout, whichever is less)`}
                  </li>
                )}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                disabled={cancelStep === 'loading'}
                className="px-4 py-2 text-xs font-mono font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {cancelStep === 'loading'
                  ? isJa ? '処理中...' : 'Processing...'
                  : isJa ? '解約を確定する' : 'Confirm Cancellation'}
              </button>
              <button
                onClick={() => setCancelStep('idle')}
                className="px-4 py-2 text-xs font-mono text-[#9CA3AF] hover:text-[#F4F4F2] transition-colors"
              >
                {isJa ? 'キャンセル' : 'Go Back'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[#9CA3AF] text-xs font-mono leading-relaxed">
              {isJa
                ? '解約すると、現在の請求期間の終了後にウェブサイトがオフラインになります。コードの買い取り（¥80,000）も可能です。'
                : 'Cancelling will take your website offline after the current billing period. You may also purchase the source code for ¥80,000.'}
            </p>
            {isWithinCommitment && (
              <div className="border border-red-400/30 bg-red-400/10 rounded-lg p-3">
                <p className="text-red-400 text-xs font-mono leading-relaxed flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  {isJa
                    ? `コミット期間内のため、早期解約料（${earlyCancelCost}）が発生します。`
                    : `You are within your commitment period. Early termination fee of ${earlyCancelCost} applies.`}
                </p>
              </div>
            )}
            <button
              onClick={() => setCancelStep('confirm')}
              className="text-red-400 text-xs font-mono font-bold hover:text-red-300 transition-colors underline underline-offset-2"
            >
              {isJa ? 'サブスクリプションを解約する' : 'Cancel my subscription'}
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
