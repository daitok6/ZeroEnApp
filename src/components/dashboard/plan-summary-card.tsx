import { useTranslations } from 'next-intl';
import { PlanChangeTrigger } from './plan-change-trigger';
import { addMonths, formatDate } from '@/lib/date-utils';

interface PlanSummaryCardProps {
  planTier: 'basic' | 'premium';
  commitmentStartsAt: string;
  locale: string;
}

const planPrice = (tier: 'basic' | 'premium', locale: string) =>
  locale === 'ja'
    ? tier === 'premium' ? '¥10,000/月' : '¥5,000/月'
    : tier === 'premium' ? '¥10,000/mo' : '¥5,000/mo';

export function PlanSummaryCard({ planTier, commitmentStartsAt, locale }: PlanSummaryCardProps) {
  const tBilling = useTranslations('billing');
  const commitmentEnd = addMonths(commitmentStartsAt, 6);
  const isPremium = planTier === 'premium';

  const features: string[] = isPremium ? [
    tBilling('hostingIncluded'),
    tBilling('twoChangesPerMonth'),
    tBilling('fullYearAnalytics'),
    tBilling('quarterlyAudits'),
  ] : [
    tBilling('hostingIncluded'),
    tBilling('oneChangePerMonth'),
    tBilling('pdfAnalytics'),
  ];

  return (
    <div className="bg-[#111827] border border-[#374151] rounded-lg p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
            {tBilling('currentPlanLabel')}
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
          {planPrice(planTier, locale)}
        </p>
      </div>

      {/* Features */}
      <ul className="space-y-1.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF]">
            <span className={isPremium ? 'text-[#00E87A]' : 'text-[#6B7280]'}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Commitment */}
      <div className="border-t border-[#374151] pt-4 space-y-1">
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
          {tBilling('commitmentPeriod')}
        </p>
        <p className="text-[#9CA3AF] text-xs font-mono">
          <span className="text-[#6B7280]">{tBilling('started')} </span>
          <span className="text-[#F4F4F2]">{formatDate(commitmentStartsAt, locale)}</span>
        </p>
        <p className="text-[#9CA3AF] text-xs font-mono">
          <span className="text-[#6B7280]">{tBilling('minimumTermEnds')} </span>
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
