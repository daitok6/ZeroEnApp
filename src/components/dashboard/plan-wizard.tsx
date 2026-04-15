'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ExternalLink, MessageSquare } from 'lucide-react';

interface PlanWizardProps {
  projectId: string;
  locale: string;
  siteUrl?: string | null;
}

type PlanTier = 'basic' | 'premium';

export function PlanWizard({ projectId, locale, siteUrl }: PlanWizardProps) {
  const t = useTranslations('plan');
  const tBilling = useTranslations('billing');
  const tCommon = useTranslations('common');
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [committed, setCommitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PLANS: Record<PlanTier, { name: string; price: string; features: string[]; popular: boolean }> = {
    basic: {
      name: t('basicName'),
      price: t('basicPrice'),
      features: [
        tBilling('hostingIncluded'),
        tBilling('oneChangePerMonth'),
        tBilling('pdfAnalytics'),
      ],
      popular: false,
    },
    premium: {
      name: t('premiumName'),
      price: t('premiumPrice'),
      features: [
        tBilling('hostingIncluded'),
        tBilling('twoChangesPerMonth'),
        tBilling('fullYearAnalytics'),
        tBilling('quarterlyAudits'),
      ],
      popular: true,
    },
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !committed) return;
    setError(null);
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
      const { url, error: apiError } = await res.json();
      if (apiError) {
        setError(apiError);
        return;
      }
      if (url) window.location.href = url;
    } catch {
      setError(tCommon('somethingWentWrong'));
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
          {t('wizardTitle')}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {t('selectPlanSubtitle')}
        </p>
      </div>

      {/* Live site preview */}
      {siteUrl && (
        <div className="border border-[#00E87A]/20 rounded-lg p-4 bg-[#00E87A]/5">
          <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
            {t('yourWebsite')}
          </p>
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#00E87A] text-sm font-mono font-bold hover:text-[#00E87A]/80 transition-colors"
          >
            {siteUrl.replace(/^https?:\/\//, '')}
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Tweak CTA — shown right under site URL */}
      {siteUrl && (
        <div className="border border-[#374151] rounded-lg p-4 bg-[#111827]">
          <p className="text-[#F4F4F2] text-sm font-heading font-bold mb-1">
            {t('tweaksCtaHeadline')}
          </p>
          <p className="text-[#9CA3AF] text-xs font-mono leading-relaxed mb-3">
            {t('tweaksCtaBody')}
          </p>
          <Link
            href={`/${locale}/dashboard/messages`}
            className="inline-flex items-center gap-2 border border-[#00E87A] text-[#00E87A] text-xs font-mono font-bold uppercase tracking-widest px-4 py-2 rounded hover:bg-[#00E87A]/10 transition-colors"
          >
            <MessageSquare size={13} />
            {t('tweaksCtaButton')}
          </Link>
        </div>
      )}

      {/* Why monthly explainer */}
      <div className="border border-[#374151] rounded-lg p-4 bg-[#111827]">
        <p className="text-[#F4F4F2] text-sm font-heading font-bold mb-1">
          {t('whyMonthlyTitle')}
        </p>
        <p className="text-[#9CA3AF] text-xs font-mono leading-relaxed mb-3">
          {t('whyMonthlyIntro')}
        </p>
        <ul className="space-y-2">
          {[
            t('whyMonthlyHosting'),
            t('whyMonthlyCare'),
            t('whyMonthlyChanges'),
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#00E87A]" />
              <span className="text-[#9CA3AF] text-xs font-mono leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment deadline warning */}
      <div className="border border-[#F59E0B]/20 rounded-lg p-4 bg-[#F59E0B]/5">
        <p className="text-[#F59E0B] text-xs font-mono leading-relaxed">
          {t('subscriptionWarning')}
        </p>
      </div>

      {/* Plan cards */}
      <div className="flex flex-col sm:flex-row gap-4">
        {(['basic', 'premium'] as const).map((tier) => {
          const plan = PLANS[tier];
          const isSelected = selectedPlan === tier;

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
                  {t('mostPopular')}
                </span>
              )}

              {/* Plan name + price */}
              <div className="mb-4">
                <p className="text-[#F4F4F2] font-heading font-bold text-lg">{plan.name}</p>
                <p className="text-[#00E87A] font-mono font-bold text-xl mt-0.5">{plan.price}</p>
              </div>

              {/* Features list */}
              <ul className="space-y-2">
                {plan.features.map((feature) => (
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

              {/* Premium value stack */}
              {tier === 'premium' && (
                <div className="mt-4 pt-4 border-t border-[#374151]/60">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#F4F4F2] text-xs font-mono font-bold uppercase tracking-widest">
                      {t('premiumValueTitle')}
                    </p>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {t('premiumSavingsBadge')}
                    </span>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {[
                      t('premiumValueChanges'),
                      t('premiumValueSecAudit'),
                      t('premiumValueSeoAudit'),
                      t('premiumValuePriority'),
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[#00E87A] text-xs font-mono shrink-0 mt-0.5">→</span>
                        <span className="text-[#6B7280] text-[11px] font-mono leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[#00E87A] text-xs font-mono font-bold leading-relaxed">
                    {t('premiumValueTotal')}
                  </p>
                  <p className="text-[#6B7280] text-[11px] font-mono leading-relaxed mt-1">
                    {t('premiumValueBenchmark')}
                  </p>
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-[#00E87A]/20">
                  <span className="text-[#00E87A] text-xs font-mono font-bold uppercase tracking-widest">
                    {t('selected')}
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
          {t('commitmentCheckboxFull')}
        </span>
      </label>

      {/* Subscribe button */}
      <button
        onClick={handleSubscribe}
        disabled={!canSubscribe || loading}
        className="w-full sm:w-auto bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest text-sm px-8 py-3 rounded hover:bg-[#00E87A]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? '...' : t('subscribeButton')}
      </button>

      {/* Inline error */}
      {error && (
        <p className="text-red-400 text-xs font-mono mt-2">{error}</p>
      )}

      {/* Have questions? */}
      <div className="border border-[#374151] rounded-lg p-4 bg-[#0D0D0D]">
        <p className="text-[#6B7280] text-xs font-mono">
          {t('haveQuestions')}{' '}
          <Link
            href={`/${locale}/dashboard/messages`}
            className="text-[#00E87A] hover:text-[#00E87A]/80 transition-colors underline underline-offset-2"
          >
            {t('messageUs')}
          </Link>
        </p>
      </div>
    </div>
  );
}
