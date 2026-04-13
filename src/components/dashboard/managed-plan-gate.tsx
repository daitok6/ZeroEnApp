'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ExternalLink } from 'lucide-react';

interface ManagedPlanGateProps {
  projectId: string;
  locale: string;
  siteUrl?: string | null;
  scopeMd?: string | null;
}

type PlanTier = 'basic' | 'premium';

const t = (locale: string, en: string, ja: string) => (locale === 'ja' ? ja : en);

type Feature = {
  en: string;
  ja: string;
  noteEn?: string;
  noteJa?: string;
};

const PLANS: Record<PlanTier, {
  nameEn: string;
  nameJa: string;
  priceEn: string;
  priceJa: string;
  popular: boolean;
  features: Feature[];
  valueEn: string;
  valueJa: string;
}> = {
  basic: {
    nameEn: 'Basic',
    nameJa: 'ベーシック',
    priceEn: '¥5,000 / mo',
    priceJa: '¥5,000 / 月',
    popular: false,
    features: [
      {
        en: '1 small change/mo',
        ja: '小変更1回/月',
        noteEn: '≈¥7,500 at agency rates (WebMori Tier A)',
        noteJa: '代行費 ¥7,500相当 (WebMori Tier A)',
      },
      {
        en: 'Monthly analytics PDF',
        ja: '月次PDFレポート',
        noteEn: '¥10,000+ to produce manually',
        noteJa: '手動作成 ¥10,000+相当',
      },
      {
        en: 'Hosting included',
        ja: 'ホスティング込み',
        noteEn: '¥3,000/mo (Vercel Pro)',
        noteJa: '¥3,000相当 (Vercel Pro)',
      },
    ],
    valueEn: '≈¥20,500+/mo in equivalent services — yours for ¥5,000',
    valueJa: '実質¥20,500+/月相当のサービスが ¥5,000 で',
  },
  premium: {
    nameEn: 'Premium',
    nameJa: 'プレミアム',
    priceEn: '¥10,000 / mo',
    priceJa: '¥10,000 / 月',
    popular: true,
    features: [
      {
        en: '2 small or 1 medium change/mo',
        ja: '小変更2回 or 中変更1回/月',
        noteEn: '¥9,000–18,000 at agency rates (WebMori Tier B)',
        noteJa: '代行費 ¥9,000〜18,000相当 (WebMori Tier B)',
      },
      {
        en: 'Full-year analytics dashboard',
        ja: '年間ダッシュボード',
        noteEn: '¥4,000/mo for comparable SaaS tools',
        noteJa: '類似SaaS ¥4,000/月相当',
      },
      {
        en: 'Quarterly audits (security + SEO)',
        ja: '四半期監査（セキュリティ + SEO）',
        noteEn: '¥39,800/audit at WebMori Growth — included every 3 months',
        noteJa: '¥39,800/回 (WebMori Growth相当) — 3ヶ月毎に実施',
      },
      {
        en: 'Hosting included',
        ja: 'ホスティング込み',
        noteEn: '¥3,000/mo (Vercel Pro)',
        noteJa: '¥3,000相当 (Vercel Pro)',
      },
    ],
    valueEn: '≈¥29,000+/mo in equivalent services — yours for ¥10,000',
    valueJa: '実質¥29,000+/月相当のサービスが ¥10,000 で',
  },
};

export function ManagedPlanGate({ projectId, locale, siteUrl, scopeMd }: ManagedPlanGateProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [scopeAck, setScopeAck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canProceed = selectedPlan !== null && scopeAck;

  const handleSubscribe = async () => {
    if (!canProceed) return;
    setError(null);
    setLoading(true);
    try {
      // Save acks to managed_client_intake before checkout
      const ackRes = await fetch('/api/coconala-onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope_ack: true,
          commitment_ack_at: new Date().toISOString(),
          plan_tier: selectedPlan,
        }),
      });
      if (!ackRes.ok) {
        const j = await ackRes.json().catch(() => ({}));
        setError(j.error || t(locale, 'Failed to save acknowledgements', '確認の保存に失敗しました'));
        return;
      }

      // Start Stripe checkout
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subscription', planTier: selectedPlan, locale, projectId }),
      });
      const { url, error: apiError } = await res.json();
      if (apiError) { setError(apiError); return; }
      if (url) window.location.href = url;
    } catch {
      setError(t(locale, 'Something went wrong', 'エラーが発生しました'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Heading */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {t(locale, 'Your site is ready', 'サイトの準備ができました')}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {t(locale, 'Preview your site and choose a subscription plan to activate it.', 'サイトをプレビューして、プランを選択して有効化してください。')}
        </p>
      </div>

      {/* Site preview */}
      {siteUrl && (
        <div className="border border-[#00E87A]/30 rounded-lg p-4 bg-[#00E87A]/5">
          <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
            {t(locale, 'Your Website', 'あなたのウェブサイト')}
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

      {/* Scope summary (read-only) */}
      {scopeMd && (
        <div>
          <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
            {t(locale, 'Agreed Scope', '合意されたスコープ')}
          </p>
          <div className="bg-[#111827] border border-[#374151] rounded p-4 max-h-48 overflow-auto">
            <pre className="text-[#9CA3AF] text-xs font-mono whitespace-pre-wrap leading-relaxed">{scopeMd}</pre>
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div>
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-3">
          {t(locale, 'Choose Your Plan', 'プランを選択')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {(['basic', 'premium'] as const).map((tier) => {
            const plan = PLANS[tier];
            const isSelected = selectedPlan === tier;
            return (
              <button
                key={tier}
                onClick={() => {
                  setSelectedPlan(tier);
                  setScopeAck(false);
                }}
                className={`relative flex-1 text-left p-6 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-[#00E87A] bg-[#00E87A]/5'
                    : 'border-[#374151] bg-[#111827] hover:border-[#374151]/80'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#00E87A] text-[#0D0D0D] px-3 py-0.5 rounded-full whitespace-nowrap">
                    {t(locale, 'Most popular', '人気')}
                  </span>
                )}
                <div className="mb-4">
                  <p className="text-[#F4F4F2] font-heading font-bold text-lg">
                    {locale === 'ja' ? plan.nameJa : plan.nameEn}
                  </p>
                  <p className="text-[#00E87A] font-mono font-bold text-xl mt-0.5">{locale === 'ja' ? plan.priceJa : plan.priceEn}</p>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => {
                    const label = locale === 'ja' ? feature.ja : feature.en;
                    const note = locale === 'ja' ? feature.noteJa : feature.noteEn;
                    return (
                      <li key={label} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${isSelected ? 'text-[#00E87A]' : 'text-[#374151]'}`} />
                        <div>
                          <span className="text-[#9CA3AF] text-xs font-mono leading-relaxed">{label}</span>
                          {note && (
                            <p className="text-[10px] sm:text-[11px] text-[#4B5563] font-mono leading-relaxed mt-0.5">{note}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Value summary */}
                <div className="mt-4 pt-4 border-t border-[#374151]/60">
                  <p className="text-[10px] sm:text-[11px] text-[#00E87A]/70 font-mono leading-relaxed">
                    {locale === 'ja' ? plan.valueJa : plan.valueEn}
                  </p>
                  <a
                    href="https://www.webmori.jp/ja/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-[#4B5563] font-mono hover:text-[#6B7280] transition-colors mt-1"
                  >
                    {t(locale, 'Pricing source: WebMori', '価格参照: WebMori')}
                    <ExternalLink size={9} />
                  </a>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-[#00E87A]/20">
                    <span className="text-[#00E87A] text-xs font-mono font-bold uppercase tracking-widest">
                      {t(locale, 'Selected', '選択中')}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scope acknowledgement — only shown after plan selection */}
      {selectedPlan && (
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={scopeAck}
              onChange={(e) => setScopeAck(e.target.checked)}
              className="mt-0.5 accent-[#00E87A] shrink-0"
            />
            <span className="text-[#9CA3AF] text-xs font-mono leading-relaxed">
              {t(
                locale,
                'I confirm the scope above and commit to the 6-month minimum subscription. Early cancellation will be billed for the remaining months.',
                '上記スコープを確認し、６ヶ月の最低契約に同意します。早期解約は残月数分ご請求させていただきます。'
              )}
            </span>
          </label>
        </div>
      )}

      {/* Subscribe button */}
      <button
        onClick={handleSubscribe}
        disabled={!canProceed || loading}
        className="w-full sm:w-auto bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest text-sm px-8 py-3 rounded hover:bg-[#00E87A]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading
          ? t(locale, 'Redirecting...', 'リダイレクト中...')
          : t(locale, 'Activate — Choose payment', '有効化 — 支払い方法を選択')}
      </button>

      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

      <div className="border border-[#374151] rounded-lg p-4 bg-[#0D0D0D]">
        <p className="text-[#6B7280] text-xs font-mono">
          {t(locale, 'Questions?', 'ご質問は')}{' '}
          <Link
            href={`/${locale}/dashboard/messages`}
            className="text-[#00E87A] hover:text-[#00E87A]/80 transition-colors underline underline-offset-2"
          >
            {t(locale, 'Message us', 'メッセージ')}
          </Link>
        </p>
      </div>
    </div>
  );
}
