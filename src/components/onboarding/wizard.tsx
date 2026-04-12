'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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

interface OnboardingProgress {
  current_step: number;
  form_data: Partial<OnboardingFormData>;
}

interface Props {
  locale: string;
  applicationId: string | null;
  application: ApplicationData | null;
  userEmail: string;
  userName: string;
  initialProgress?: OnboardingProgress | null;
}

export function OnboardingWizard({ locale, applicationId, application, userEmail, userName, initialProgress }: Props) {
  const router = useRouter();
  const t = useTranslations('onboarding.wizard');

  const [currentStep, setCurrentStep] = useState(initialProgress?.current_step ?? 1);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>(initialProgress?.form_data ?? {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const saveProgress = (step: number, data: Partial<OnboardingFormData>) => {
    fetch('/api/onboarding/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_step: step, form_data: data }),
    }).catch(() => {});
  };

  const saveAndAdvance = (stepData: Partial<OnboardingFormData>) => {
    const merged = { ...formData, ...stepData };
    setFormData(merged);
    const nextStep = Math.min(currentStep + 1, TOTAL_STEPS);
    setCurrentStep(nextStep);
    saveProgress(nextStep, merged);
  };

  const saveAndGoBack = () => {
    const prevStep = Math.max(currentStep - 1, 1);
    setCurrentStep(prevStep);
    saveProgress(prevStep, formData);
  };

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
        setError(json.error || t('error'));
      }
    } catch {
      setError(t('networkError'));
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
              {t('viewApplication')}
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
            onNext={saveAndAdvance}
            locale={locale}
          />
        )}
        {currentStep === 2 && (
          <Step2Technical
            data={formData}
            onNext={saveAndAdvance}
            onBack={saveAndGoBack}
            locale={locale}
          />
        )}
        {currentStep === 3 && (
          <Step3Terms
            data={formData}
            onNext={saveAndAdvance}
            onBack={saveAndGoBack}
            locale={locale}
            userEmail={userEmail}
            userName={userName}
          />
        )}
        {currentStep === 4 && (
          <Step4Kickoff
            data={formData}
            onSubmit={handleSubmit}
            onBack={saveAndGoBack}
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
