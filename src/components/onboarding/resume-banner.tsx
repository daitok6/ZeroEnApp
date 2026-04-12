'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ClipboardList } from 'lucide-react';

const TOTAL_STEPS = 4;

interface Props {
  locale: string;
  currentStep: number;
}

export function ResumeOnboardingBanner({ locale, currentStep }: Props) {
  const router = useRouter();
  const t = useTranslations('onboarding.resumeBanner');
  const [loading, setLoading] = useState(false);

  const stepsCompleted = Math.max(currentStep - 1, 0);

  const handleContinue = () => {
    setLoading(true);
    router.push(`/${locale}/dashboard/onboarding`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#00E87A]/10 border border-[#00E87A]/30 flex items-center justify-center">
            <ClipboardList size={36} className="text-[#00E87A]" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold font-mono text-[#F4F4F2]">
            {t('title')}
          </h1>
          <p className="text-[#9CA3AF] text-sm font-mono leading-relaxed">
            {t('desc')}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#6B7280] mb-1">
            <span>
              {t('progress', { stepsCompleted, totalSteps: TOTAL_STEPS })}
            </span>
            <span className="text-[#00E87A]">
              {Math.round((stepsCompleted / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#1F2937] rounded-full h-1.5">
            <div
              className="bg-[#00E87A] h-1.5 rounded-full transition-all"
              style={{ width: `${(stepsCompleted / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 space-y-3">
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-4 rounded hover:bg-[#00d070] transition-colors text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? t('loading') : t('continueButton')}
          </button>
          <p className="text-[#6B7280] text-xs font-mono">
            {t('subtext')}
          </p>
        </div>
      </div>
    </div>
  );
}
