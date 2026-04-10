'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { ProgressBar } from '@/components/apply/progress-bar';
import { Step1Project } from './step-1-project';
import { Step2Technical } from './step-2-technical';
import { Step3Terms } from './step-3-terms';
import { Step4Kickoff } from './step-4-kickoff';
import { ApplicationDrawer } from './application-drawer';
import type { ApplicationData } from './application-drawer';
import type { OnboardingFormData } from '@/lib/validations/onboarding';

const TOTAL_STEPS = 4;

interface Props {
  locale: string;
  applicationId: string | null;
  application: ApplicationData | null;
}

export function OnboardingWizard({ locale, applicationId, application }: Props) {
  const router = useRouter();
  const isJa = locale === 'ja';

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    <>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* View application button */}
        {application && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 text-[#6B7280] hover:text-[#00E87A] text-xs font-mono transition-colors"
            >
              <FileText size={13} />
              {isJa ? '応募内容を確認する' : 'View your application'}
            </button>
          </div>
        )}

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

      {application && (
        <ApplicationDrawer
          application={application}
          locale={locale}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
