'use client';

import { useState } from 'react';
import { ProgressBar } from './progress-bar';
import { Step1Idea } from './step-1-idea';
import { Step2Market } from './step-2-market';
import { Step3Founder } from './step-3-founder';
import { Step4Review } from './step-4-review';
import type { ApplicationFormData } from '@/lib/validations/application';
import { TerminalWindow } from '@/components/marketing/terminal-window';
import { TypingEffect } from '@/components/marketing/typing-effect';

const TOTAL_STEPS = 4;

export function ApplyWizard({ locale }: { locale: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ApplicationFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (data: Partial<ApplicationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const goToNext = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const goToPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      });
      const json = await res.json();
      if (res.ok) {
        setIsSuccess(true);
      } else {
        setError(json.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <TerminalWindow title="zeroen — application received" className="max-w-lg w-full">
          <div className="space-y-3">
            <p className="text-[#00E87A] font-mono text-sm">$ application --submit</p>
            <TypingEffect
              texts={[
                locale === 'ja' ? '申し込みを受け取りました。' : 'Application received.',
                locale === 'ja' ? '3〜5営業日以内にご連絡します。' : "We'll be in touch within 3-5 business days.",
              ]}
              typingSpeed={40}
              loop={false}
              className="text-[#F4F4F2] text-sm"
            />
          </div>
        </TerminalWindow>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {error && (
        <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 rounded text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      {currentStep === 1 && (
        <Step1Idea
          data={formData}
          onNext={(data) => { updateFormData(data); goToNext(); }}
          locale={locale}
        />
      )}
      {currentStep === 2 && (
        <Step2Market
          data={formData}
          onNext={(data) => { updateFormData(data); goToNext(); }}
          onBack={goToPrev}
          locale={locale}
        />
      )}
      {currentStep === 3 && (
        <Step3Founder
          data={formData}
          onNext={(data) => { updateFormData(data); goToNext(); }}
          onBack={goToPrev}
          locale={locale}
        />
      )}
      {currentStep === 4 && (
        <Step4Review
          data={formData as ApplicationFormData}
          onSubmit={handleSubmit}
          onBack={goToPrev}
          isSubmitting={isSubmitting}
          locale={locale}
        />
      )}
    </div>
  );
}
