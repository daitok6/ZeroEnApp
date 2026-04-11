import { PlanChangeTrigger } from './plan-change-trigger';

interface PlanSummaryCardProps {
  planTier: 'basic' | 'premium';
  commitmentStartsAt: string;
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

function formatDate(isoString: string, locale: string): string {
  return new Date(isoString).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PlanSummaryCard({ planTier, commitmentStartsAt, locale }: PlanSummaryCardProps) {
  const commitmentEnd = new Date(commitmentStartsAt);
  commitmentEnd.setMonth(commitmentEnd.getMonth() + 6);

  const features = PLAN_FEATURES[planTier];
  const isPremium = planTier === 'premium';

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-lg p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
            {locale === 'ja' ? '現在のプラン' : 'Current Plan'}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                isPremium
                  ? 'text-[#00E87A] bg-[#00E87A]/10 border-[#00E87A]/30'
                  : 'text-[#9CA3AF] bg-[#374151]/50 border-[#374151]'
              }`}
            >
              {isPremium ? 'Premium' : 'Basic'}
            </span>
          </div>
        </div>
        <p className="text-[#F4F4F2] font-mono font-bold text-lg shrink-0">
          {PLAN_PRICES[planTier]}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-1.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF]">
            <span className={isPremium ? 'text-[#00E87A]' : 'text-[#6B7280]'}>✓</span>
            {locale === 'ja' ? f.ja : f.en}
          </li>
        ))}
      </ul>

      {/* Commitment */}
      <div className="border-t border-[#374151] pt-4 space-y-1">
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
          {locale === 'ja' ? 'コミット期間' : 'Commitment'}
        </p>
        <p className="text-[#9CA3AF] text-xs font-mono">
          <span className="text-[#6B7280]">
            {locale === 'ja' ? '開始: ' : 'Started: '}
          </span>
          <span className="text-[#F4F4F2]">{formatDate(commitmentStartsAt, locale)}</span>
        </p>
        <p className="text-[#9CA3AF] text-xs font-mono">
          <span className="text-[#6B7280]">
            {locale === 'ja' ? '最短終了日: ' : 'Minimum term ends: '}
          </span>
          <span className="text-[#F4F4F2]">{formatDate(commitmentEnd.toISOString(), locale)}</span>
        </p>
      </div>

      {/* Change plan trigger */}
      <div className="pt-1">
        <PlanChangeTrigger
          currentPlan={planTier}
          commitmentStartsAt={commitmentStartsAt}
          locale={locale}
        />
      </div>
    </div>
  );
}
