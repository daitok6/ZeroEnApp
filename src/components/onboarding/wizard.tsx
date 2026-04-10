'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/apply/progress-bar';
import { Step1Project } from './step-1-project';
import { Step2Technical } from './step-2-technical';
import { Step3Terms } from './step-3-terms';
import { Step4Kickoff } from './step-4-kickoff';
import type { OnboardingFormData } from '@/lib/validations/onboarding';

const TOTAL_STEPS = 4;

interface Props {
  locale: string;
  applicationId: string | null;
}

export function OnboardingWizard({ locale, applicationId }: Props) {
  const router = useRouter();
  const isJa = locale === 'ja';

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const goToNext = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const goToPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (step4Data: Partial<OnboardingFormData>) => {
    const finalData = { ...formData, ...step4Data };
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...finalData, application_id: applicationId }),
      });
      const json = await res.json();
      if (res.ok) {
        router.push(`/${locale}/dashboard`);
      } else {
        setError(json.error || (isJa ? '問題が発生しました。もう一度お試しください。' : 'Something went wrong. Please try again.'));
      }
    } catch {
      setError(isJa ? 'ネットワークエラーが発生しました。もう一度お試しください。' : 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-mono text-[#F4F4F2] mb-2">
          {isJa ? 'プロジェクトを設定しましょう' : "Let's set up your project"}
        </h1>
        <p className="text-[#9CA3AF] text-sm font-mono">
          {isJa ? '数ステップでプロジェクトを開始します' : 'A few steps to get your project started'}
        </p>
      </div>

      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {error && (
        <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 rounded text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      {currentStep === 1 && (
        <Step1Project
          data={formData}
          onNext={(data) => { updateFormData(data); goToNext(); }}
          locale={locale}
        />
      )}
      {currentStep === 2 && (
        <Step2Technical
          data={formData}
          onNext={(data) => { updateFormData(data); goToNext(); }}
          onBack={goToPrev}
          locale={locale}
        />
      )}
      {currentStep === 3 && (
        <Step3Terms
          data={formData}
          onNext={(data) => { updateFormData(data); goToNext(); }}
          onBack={goToPrev}
          locale={locale}
        />
      )}
      {currentStep === 4 && (
        <Step4Kickoff
          data={formData}
          onSubmit={handleSubmit}
          onBack={goToPrev}
          isSubmitting={isSubmitting}
          locale={locale}
        />
      )}
    </div>
  );
}
