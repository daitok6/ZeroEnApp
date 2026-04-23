import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ApplyConversion } from '@/components/analytics/apply-conversion';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ApplyThankYouPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('lpApply.thankYou');

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen flex items-center justify-center px-4">
      <ApplyConversion />
      <div className="max-w-lg w-full text-center">
        {/* Green checkmark */}
        <div className="mb-8 flex justify-center">
          <div
            className="w-16 h-16 rounded-full border border-[#00E87A]/40 flex items-center justify-center"
            style={{ boxShadow: '0 0 32px rgba(0,232,122,0.3)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00E87A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
          {t('eyebrow')}
        </p>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2] mb-4">
          {t('title')}
        </h1>

        <p className={`text-[#6B7280] font-mono text-sm leading-relaxed mb-12 ${locale === 'ja' ? 'font-jp' : ''}`}>
          {t('message')}
        </p>

        {/* Next steps */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 text-left mb-8">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-widest mb-4">
            {t('nextSteps')}
          </p>
          <ol className="space-y-3">
            {(['step1', 'step2', 'step3', 'step4'] as const).map((key, i) => (
              <li key={key} className="flex items-start gap-3">
                <span className="text-[#00E87A] font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`font-mono text-sm text-[#9CA3AF] ${locale === 'ja' ? 'font-jp' : ''}`}>
                  {t(key)}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <Link
          href={`/${locale}`}
          className="
            inline-block
            border border-[#1F2937]
            text-[#9CA3AF]
            font-mono text-sm
            px-6 py-3
            rounded
            hover:border-[#00E87A]/40 hover:text-[#F4F4F2]
            transition-colors
          "
        >
          {t('cta')}
        </Link>
      </div>
    </div>
  );
}
