'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WizardHeader } from '@/components/shared/wizard/WizardHeader';
import { BrandKitStep } from '@/components/shared/wizard/BrandKitStep';
import { AssetsStep } from '@/components/shared/wizard/AssetsStep';
import { DomainStep } from '@/components/shared/wizard/DomainStep';
import { useWizardSave } from '@/hooks/useWizardSave';
import { useWizardBrandKit } from '@/hooks/useWizardBrandKit';
import { useWizardAssets } from '@/hooks/useWizardAssets';
import { t } from '@/components/shared/wizard/constants';
import type { BrandKit, AssetsData, DomainData } from '@/types/managed-client-intake';

const TOTAL_STEPS = 3;

interface InitialIntake {
  brand_kit: BrandKit | null;
  assets: AssetsData | null;
  domain: DomainData | null;
}

interface Props {
  locale: string;
  profileId: string;
  initialIntake: InitialIntake | null;
}

export function DesignWizard({ locale, profileId, initialIntake }: Props) {
  const router = useRouter();
  const wizardRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const { isSaving, error, setError, savePatch } = useWizardSave(locale);
  const brandKitHook = useWizardBrandKit(initialIntake?.brand_kit ?? null);
  const assetsHook = useWizardAssets(profileId, initialIntake?.assets ?? null);
  const [domain, setDomain] = useState<DomainData>(
    initialIntake?.domain ?? { type: 'own', value: '' }
  );

  useEffect(() => {
    wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentStep]);

  async function handleStep1Next() {
    setError(null);
    const ok = await savePatch({ brand_kit: brandKitHook.brandKit });
    if (ok) setCurrentStep(2);
  }

  async function handleStep2Next() {
    setError(null);
    if (!assetsHook.assets.copy.trim()) {
      setError(t(locale, 'Brand description is required', 'ブランドの説明は必須です'));
      return;
    }
    const ok = await savePatch({ assets: assetsHook.assets });
    if (ok) setCurrentStep(3);
  }

  async function handleStep3Next() {
    setError(null);
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
    <div ref={wizardRef} className="max-w-2xl mx-auto px-4 py-8">
      <WizardHeader
        locale={locale}
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        label={t(locale, 'Website Design', 'ウェブサイトデザイン')}
      />

      {currentStep === 1 && (
        <BrandKitStep
          locale={locale}
          {...brandKitHook}
          onNext={handleStep1Next}
          isSaving={isSaving}
          error={error}
        />
      )}

      {currentStep === 2 && (
        <AssetsStep
          locale={locale}
          assets={assetsHook.assets}
          setAssets={assetsHook.setAssets}
          uploadingLogo={assetsHook.uploadingLogo}
          uploadingExtra={assetsHook.uploadingExtra}
          onLogoUpload={assetsHook.handleLogoUpload}
          onExtraImagesUpload={assetsHook.handleExtraImagesUpload}
          onNext={handleStep2Next}
          onBack={() => setCurrentStep(1)}
          isSaving={isSaving}
          error={error}
        />
      )}

      {currentStep === 3 && (
        <DomainStep
          locale={locale}
          domain={domain}
          setDomain={setDomain}
          onNext={handleStep3Next}
          onBack={() => setCurrentStep(2)}
          isSaving={isSaving}
          error={error}
          submitLabel={
            isSaving
              ? t(locale, 'Submitting...', '送信中...')
              : t(locale, 'Submit Design Brief', 'デザインブリーフを送信')
          }
        />
      )}
    </div>
  );
}
