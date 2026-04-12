'use client';

import { useTranslations } from 'next-intl';

interface Props {
  onNext: () => void;
  locale: string;
}

export function Step0Congrats({ onNext }: Props) {
  const t = useTranslations('onboarding');

  const highlights = t.raw('step0.highlights') as string[];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#00E87A]/10 border border-[#00E87A]/30 flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold font-mono text-[#F4F4F2]">
            {t('step0.title')}
          </h1>
          <p className="text-[#9CA3AF] text-sm font-mono leading-relaxed">
            {t('step0.desc')}
          </p>
        </div>

        {/* Highlights */}
        <ul className="space-y-3 text-left">
          {highlights.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-mono text-[#F4F4F2]">
              <span className="text-[#00E87A] mt-0.5 shrink-0">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="pt-2">
          <button
            onClick={onNext}
            className="w-full bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-4 rounded hover:bg-[#00d070] transition-colors text-base"
          >
            {t('step0.setupButton')}
          </button>
          <p className="text-[#6B7280] text-xs font-mono mt-3">
            {t('step0.timeEstimate')}
          </p>
        </div>
      </div>
    </div>
  );
}
