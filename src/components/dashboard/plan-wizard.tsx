'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

interface PlanWizardProps {
  projectId: string;
  locale: string;
}

type PlanTier = 'basic' | 'premium';

const PLANS = {
  basic: {
    nameEn: 'Basic',
    nameJa: 'ベーシック',
    priceEn: '~$35/mo',
    priceJa: '¥5,000/月',
    featuresEn: [
      'Hosting included',
      '1 small change per month',
      'Prior-month PDF analytics',
    ],
    featuresJa: [
      'ホスティング込み',
      '月1回の小規模変更',
      '前月PDFアナリティクス',
    ],
    popular: false,
  },
  premium: {
    nameEn: 'Premium',
    nameJa: 'プレミアム',
    priceEn: '~$70/mo',
    priceJa: '¥10,000/月',
    featuresEn: [
      'Hosting included',
      '2 small changes OR 1 medium change per month',
      'Full-year dashboard analytics',
      'Quarterly security & SEO audits',
    ],
    featuresJa: [
      'ホスティング込み',
      '月2回の小規模変更 または 1回の中規模変更',
      '年間ダッシュボードアナリティクス',
      '四半期ごとのセキュリティ・SEO監査',
    ],
    popular: true,
  },
} as const;

export function PlanWizard({ projectId, locale }: PlanWizardProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [committed, setCommitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isJa = locale === 'ja';

  const handleSubscribe = async () => {
    if (!selectedPlan || !committed) return;
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          planTier: selectedPlan,
          locale,
          projectId,
        }),
      });
      const { url, error } = await res.json();
      if (error) {
        alert(error);
        return;
      }
      if (url) window.location.href = url;
    } catch {
      alert(isJa ? 'エラーが発生しました' : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const canSubscribe = selectedPlan !== null && committed;

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {isJa ? 'プランを選択' : 'Choose Your Plan'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {isJa
            ? 'プロジェクトに合ったプランをお選びください'
            : 'Select the plan that fits your project'}
        </p>
      </div>

      {/* Plan cards */}
      <div className="flex flex-col sm:flex-row gap-4">
        {(['basic', 'premium'] as const).map((tier) => {
          const plan = PLANS[tier];
          const isSelected = selectedPlan === tier;
          const features = isJa ? plan.featuresJa : plan.featuresEn;
          const name = isJa ? plan.nameJa : plan.nameEn;
          const price = isJa ? plan.priceJa : plan.priceEn;

          return (
            <button
              key={tier}
              onClick={() => setSelectedPlan(tier)}
              className={`relative flex-1 text-left p-6 rounded-lg border transition-all ${
                isSelected
                  ? 'border-[#00E87A] bg-[#00E87A]/5'
                  : 'border-[#374151] bg-[#111827] hover:border-[#374151]/80'
              }`}
            >
              {/* Most Popular badge */}
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#00E87A] text-[#0D0D0D] px-3 py-0.5 rounded-full whitespace-nowrap">
                  {isJa ? '人気No.1' : 'Most Popular'}
                </span>
              )}

              {/* Plan name + price */}
              <div className="mb-4">
                <p className="text-[#F4F4F2] font-heading font-bold text-lg">{name}</p>
                <p className="text-[#00E87A] font-mono font-bold text-xl mt-0.5">{price}</p>
              </div>

              {/* Features list */}
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2
                      size={14}
                      className={`mt-0.5 shrink-0 ${isSelected ? 'text-[#00E87A]' : 'text-[#374151]'}`}
                    />
                    <span className="text-[#9CA3AF] text-xs font-mono leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Selected indicator */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-[#00E87A]/20">
                  <span className="text-[#00E87A] text-xs font-mono font-bold uppercase tracking-widest">
                    {isJa ? '選択中' : 'Selected'}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 6-month commitment checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={committed}
          onChange={(e) => setCommitted(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-[#374151] bg-[#0D0D0D] accent-[#00E87A] cursor-pointer shrink-0"
        />
        <span className="text-[#9CA3AF] text-xs font-mono leading-relaxed group-hover:text-[#F4F4F2] transition-colors">
          {isJa
            ? '6ヶ月間の最低利用期間に同意します。早期解約の場合は残月分または¥80,000（少ない方）をお支払いいただきます。'
            : 'I agree to the 6-month minimum commitment. Early cancellation = remaining months or ¥80,000 buyout (whichever is less).'}
        </span>
      </label>

      {/* Subscribe button */}
      <button
        onClick={handleSubscribe}
        disabled={!canSubscribe || loading}
        className="w-full sm:w-auto bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest text-sm px-8 py-3 rounded hover:bg-[#00E87A]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading
          ? '...'
          : isJa
          ? '登録する'
          : 'Subscribe'}
      </button>

      {/* Have questions? */}
      <div className="border border-[#374151] rounded-lg p-4 bg-[#0D0D0D]">
        <p className="text-[#6B7280] text-xs font-mono">
          {isJa ? 'ご質問はありますか？' : 'Have questions?'}{' '}
          <Link
            href={`/${locale}/dashboard/messages`}
            className="text-[#00E87A] hover:text-[#00E87A]/80 transition-colors underline underline-offset-2"
          >
            {isJa ? 'メッセージでお問い合わせ' : 'Send us a message'}
          </Link>
        </p>
      </div>
    </div>
  );
}
