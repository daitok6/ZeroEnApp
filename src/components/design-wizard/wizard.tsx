'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/shared/progress-bar';
import { Step1Business } from './step-1-business';
import { Step2Brand } from './step-2-brand';
import { Step3Goals } from './step-3-goals';
import { Step4References } from './step-4-references';
import type { DesignWizardFormData } from '@/lib/validations/design-wizard';

interface DesignWizardProps {
  initialStep: number;
  initialData: Record<string, unknown>;
  locale: string;
  userId: string;
}

const STEP_TITLES_EN = ['Your Business', 'Brand Identity', 'Site Goals', 'Final Details'];
const STEP_TITLES_JA = ['事業について', 'ブランド', 'サイトの目的', '最終確認'];

export function DesignWizard({ initialStep, initialData, locale, userId }: DesignWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [formData, setFormData] = useState<Partial<DesignWizardFormData>>(
    initialData as Partial<DesignWizardFormData>
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titles = locale === 'ja' ? STEP_TITLES_JA : STEP_TITLES_EN;

  const saveProgress = async (step: number, data: Partial<DesignWizardFormData>) => {
    try {
      await fetch('/api/design-wizard/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, data }),
      });
    } catch {
      // Autosave is best-effort
    }
  };

  const handleNext = async (stepData: Partial<DesignWizardFormData>) => {
    if (isAdvancing) return;
    setIsAdvancing(true);
    try {
      const merged = { ...formData, ...stepData };
      setFormData(merged);
      setError(null);
      await saveProgress(currentStep, stepData);
      setCurrentStep((s) => Math.min(s + 1, 4));
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((s) => Math.max(s - 1, 1));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (finalData: Partial<DesignWizardFormData>) => {
    const merged = { ...formData, ...finalData };
    setFormData(merged);
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/design-wizard/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });
      if (!res.ok) {
        setError(
          locale === 'ja'
            ? '保存できませんでした。もう一度お試しください。'
            : "We couldn't save your answers. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }
      router.push(`/${locale}/dashboard`);
    } catch {
      setError(
        locale === 'ja'
          ? '通信エラーです。接続を確認してもう一度お試しください。'
          : 'Network problem. Check your connection and try again.',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProgressBar currentStep={currentStep} totalSteps={4} />

      <div>
        <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-2">
          {locale === 'ja' ? `ステップ ${currentStep} / 4` : `Step ${currentStep} of 4`}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F4F4F2]">
          {titles[currentStep - 1]}
        </h2>
      </div>

      <div className="rounded-lg border border-[#1F2937] bg-[#131313] p-5 sm:p-7">
        {currentStep === 1 && (
          <Step1Business initialValues={formData} onNext={handleNext} locale={locale} isAdvancing={isAdvancing} />
        )}
        {currentStep === 2 && (
          <Step2Brand
            initialValues={formData}
            onNext={handleNext}
            onBack={handleBack}
            userId={userId}
            locale={locale}
            isAdvancing={isAdvancing}
          />
        )}
        {currentStep === 3 && (
          <Step3Goals
            initialValues={formData}
            onNext={handleNext}
            onBack={handleBack}
            locale={locale}
            isAdvancing={isAdvancing}
          />
        )}
        {currentStep === 4 && (
          <Step4References
            initialValues={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            locale={locale}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {error && (
        <p className="text-red-400 text-xs font-mono" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
