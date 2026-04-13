'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { WizardHeader } from '@/components/shared/wizard/WizardHeader';
import { ErrorBanner } from '@/components/shared/wizard/ErrorBanner';
import { BrandKitStep } from '@/components/shared/wizard/BrandKitStep';
import { AssetsStep } from '@/components/shared/wizard/AssetsStep';
import { DomainStep } from '@/components/shared/wizard/DomainStep';
import { useWizardSave } from '@/hooks/useWizardSave';
import { useWizardBrandKit } from '@/hooks/useWizardBrandKit';
import { useWizardAssets } from '@/hooks/useWizardAssets';
import { labelClass, t } from '@/components/shared/wizard/constants';
import type { BrandKit, AssetsData, DomainData } from '@/types/managed-client-intake';

const TOTAL_STEPS = 4;

interface InitialIntake {
  scope_ack: boolean;
  commitment_ack_at: string | null;
  brand_kit: BrandKit | null;
  assets: AssetsData | null;
  domain: DomainData | null;
  plan_tier: string | null;
}

interface Props {
  locale: string;
  profileId: string;
  scopeMd: string;
  initialIntake: InitialIntake | null;
}

const PLANS = [
  {
    id: 'basic' as const,
    nameEn: 'Basic',      nameJa: 'ベーシック',
    priceEn: '¥5,000 / mo',
    priceJa: '¥5,000 / 月',
    featuresEn: ['1 small change/mo', 'Monthly analytics PDF', 'Hosting included'],
    featuresJa: ['小変更1回/月', '月次PDFレポート', 'ホスティング込み'],
  },
  {
    id: 'premium' as const,
    nameEn: 'Premium',    nameJa: 'プレミアム',
    priceEn: '¥10,000 / mo',
    priceJa: '¥10,000 / 月',
    featuresEn: ['2 small or 1 medium change/mo', 'Full-year dashboard', 'Quarterly audits', 'Hosting included'],
    featuresJa: ['小変更2回 or 中変更1回/月', '年間ダッシュボード', '四半期監査', 'ホスティング込み'],
  },
];

export function CoconalaOnboardingWizard({ locale, profileId, scopeMd, initialIntake }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const { isSaving, error, setError, savePatch } = useWizardSave(locale);
  const brandKitHook = useWizardBrandKit(initialIntake?.brand_kit ?? null);
  const assetsHook = useWizardAssets(profileId, initialIntake?.assets ?? null);
  const [domain, setDomain] = useState<DomainData>(
    initialIntake?.domain ?? { type: 'own', value: '' }
  );

  // Step 1 state
  const [scopeAck, setScopeAck] = useState(initialIntake?.scope_ack ?? false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<'basic' | 'premium'>(
    (initialIntake?.plan_tier as 'basic' | 'premium') ?? 'basic'
  );

  async function handleStep1Next() {
    if (!scopeAck) return;
    const ok = await savePatch({
      scope_ack: true,
      commitment_ack_at: new Date().toISOString(),
      plan_tier: selectedPlanTier,
    });
    if (ok) setCurrentStep(2);
  }

  async function handleStep2Next() {
    if (brandKitHook.brandKit.sample_sites.length < 1) {
      setError(t(locale, 'Add at least one sample website', 'サンプルサイトを1つ以上追加してください'));
      return;
    }
    const ok = await savePatch({ brand_kit: brandKitHook.brandKit });
    if (ok) setCurrentStep(3);
  }

  async function handleStep3Next() {
    if (!assetsHook.assets.copy.trim()) {
      setError(t(locale, 'Brand description is required', 'ブランドの説明は必須です'));
      return;
    }
    const ok = await savePatch({ assets: assetsHook.assets });
    if (ok) setCurrentStep(4);
  }

  async function handleStep4Next() {
    if (!domain.value.trim()) {
      setError(t(locale, 'Please provide a value', '値を入力してください'));
      return;
    }
    const ok = await savePatch({ domain });
    if (!ok) return;

    try {
      const done = await fetch('/api/coconala-onboarding/complete', { method: 'POST' });
      if (!done.ok) {
        const j = await done.json().catch(() => ({}));
        setError(j.error || t(locale, 'Failed to complete', '完了できませんでした'));
        return;
      }
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      setError(t(locale, 'Network error', 'ネットワークエラー'));
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <WizardHeader locale={locale} currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      <ErrorBanner error={error} />

      {currentStep === 1 && (
        <section>
          <h2 className="font-heading text-2xl md:text-3xl text-[#F4F4F2] mb-4">
            {t(locale, 'Scope & Commitment', 'スコープと契約')}
          </h2>
          <div className="bg-[#111827] border border-[#374151] rounded p-4 mb-6 max-h-96 overflow-auto">
            <pre className="text-[#F4F4F2] text-xs md:text-sm font-mono whitespace-pre-wrap">
              {scopeMd || t(locale, '(No scope provided)', '(スコープ未記入)')}
            </pre>
          </div>

          <div className="mb-6">
            <h3 className={labelClass}>{t(locale, 'Choose Your Plan', 'プランを選択')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLANS.map((plan) => {
                const selected = selectedPlanTier === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanTier(plan.id)}
                    className={`rounded border p-4 text-left transition-colors ${
                      selected ? 'border-[#00E87A] bg-[#00E87A]/5' : 'border-[#374151] hover:border-[#6B7280]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#F4F4F2] text-sm font-mono font-bold">
                        {t(locale, plan.nameEn, plan.nameJa)}
                      </span>
                      {selected && (
                        <span className="text-[#00E87A] text-[10px] font-mono uppercase tracking-widest">
                          {t(locale, 'Selected', '選択中')}
                        </span>
                      )}
                    </div>
                    <div className="text-[#00E87A] text-base font-mono font-bold mb-3">{locale === 'ja' ? plan.priceJa : plan.priceEn}</div>
                    <ul className="space-y-1">
                      {(locale === 'ja' ? plan.featuresJa : plan.featuresEn).map((f) => (
                        <li key={f} className="text-[#6B7280] text-xs font-mono flex items-start gap-1.5">
                          <span className="text-[#00E87A] mt-0.5">—</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-start gap-3 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={scopeAck}
              onChange={(e) => setScopeAck(e.target.checked)}
              className="mt-1 accent-[#00E87A]"
            />
            <span className="text-[#F4F4F2] text-sm font-mono leading-relaxed">
              {t(
                locale,
                'I confirm the scope above and commit to the 6-month minimum subscription (¥5,000/mo Basic or ¥10,000/mo Premium). Early cancellation will be billed for the remaining months.',
                '上記のスコープを確認し、6ヶ月の最低契約期間（ベーシック¥5,000/月 または プレミアム¥10,000/月）に同意します。早期解約は残月数分ご請求させていただきます。'
              )}
            </span>
          </label>
          <Button
            onClick={handleStep1Next}
            disabled={!scopeAck || isSaving}
            className="bg-[#00E87A] text-[#0D0D0D] hover:bg-[#00E87A]/90 font-mono"
          >
            {t(locale, 'Continue', '次へ')}
          </Button>
        </section>
      )}

      {currentStep === 2 && (
        <BrandKitStep
          locale={locale}
          {...brandKitHook}
          onNext={handleStep2Next}
          onBack={() => setCurrentStep(1)}
          isSaving={isSaving}
          error={null}
        />
      )}

      {currentStep === 3 && (
        <AssetsStep
          locale={locale}
          assets={assetsHook.assets}
          setAssets={assetsHook.setAssets}
          uploadingLogo={assetsHook.uploadingLogo}
          uploadingExtra={assetsHook.uploadingExtra}
          onLogoUpload={assetsHook.handleLogoUpload}
          onExtraImagesUpload={assetsHook.handleExtraImagesUpload}
          onNext={handleStep3Next}
          onBack={() => setCurrentStep(2)}
          isSaving={isSaving}
          error={null}
        />
      )}

      {currentStep === 4 && (
        <DomainStep
          locale={locale}
          domain={domain}
          setDomain={setDomain}
          onNext={handleStep4Next}
          onBack={() => setCurrentStep(3)}
          isSaving={isSaving}
          error={null}
          submitLabel={
            isSaving
              ? t(locale, 'Completing...', '完了中...')
              : t(locale, 'Complete Onboarding', 'オンボーディング完了')
          }
        />
      )}
    </div>
  );
}
