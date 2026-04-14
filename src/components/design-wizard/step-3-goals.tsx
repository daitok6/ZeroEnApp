'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { step3Schema, type DesignWizardFormData } from '@/lib/validations/design-wizard';
import { errorMsg } from '@/lib/wizard-errors';

interface Step3Props {
  initialValues: Partial<DesignWizardFormData>;
  onNext: (data: Partial<DesignWizardFormData>) => void;
  onBack: () => void;
  locale: string;
}

const LABEL_CLASS = 'block text-[#F4F4F2] text-xs font-mono uppercase tracking-widest mb-2';
const INPUT_CLASS =
  'w-full bg-[#0D0D0D] border border-[#1F2937] rounded px-3 py-2 text-[#F4F4F2] text-sm font-mono focus:outline-none focus:border-[#00E87A] transition-colors';
const ERROR_CLASS = 'text-red-400 text-xs font-mono mt-1';

const MAX_OFFERINGS = 6;

export function Step3Goals({ initialValues, onNext, onBack, locale }: Step3Props) {
  const [targetAudience, setTargetAudience] = useState<string>(
    (initialValues.target_audience as string) ?? ''
  );
  const [primaryCta, setPrimaryCta] = useState<string>(
    (initialValues.primary_cta as string) ?? ''
  );
  const [offerings, setOfferings] = useState<string[]>(() => {
    const arr = initialValues.key_offerings as string[] | undefined;
    return arr && arr.length > 0 ? arr : [''];
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateOffering = (idx: number, value: string) => {
    setOfferings((arr) => arr.map((v, i) => (i === idx ? value : v)));
  };
  const addOffering = () => {
    if (offerings.length < MAX_OFFERINGS) setOfferings((arr) => [...arr, '']);
  };
  const removeOffering = (idx: number) => {
    setOfferings((arr) => (arr.length > 1 ? arr.filter((_, i) => i !== idx) : arr));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = offerings.map((s) => s.trim()).filter(Boolean);
    const parsed = step3Schema.safeParse({
      target_audience: targetAudience,
      primary_cta: primaryCta,
      key_offerings: cleaned,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onNext(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="target_audience" className={LABEL_CLASS}>
          {locale === 'ja' ? 'どんな人向けのサイトですか?' : 'Who is this site for?'} *
        </label>
        <textarea
          id="target_audience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          rows={4}
          className={INPUT_CLASS}
          required
          minLength={10}
        />
        {errors.target_audience && <p className={ERROR_CLASS}>{errorMsg(errors.target_audience, locale)}</p>}
      </div>

      <div>
        <label htmlFor="primary_cta" className={LABEL_CLASS}>
          {locale === 'ja' ? 'メインのCTA (行動喚起)' : 'Primary call-to-action'} *
        </label>
        <input
          id="primary_cta"
          type="text"
          value={primaryCta}
          onChange={(e) => setPrimaryCta(e.target.value)}
          placeholder={
            locale === 'ja' ? '例: 予約する、お問い合わせ、見積もり依頼' : 'e.g. Book a table, Contact us, Get a quote'
          }
          className={INPUT_CLASS}
          required
        />
        {errors.primary_cta && <p className={ERROR_CLASS}>{errorMsg(errors.primary_cta, locale)}</p>}
      </div>

      <div>
        <span className={LABEL_CLASS}>
          {locale === 'ja' ? '提供するサービス / 商品' : 'Key offerings'} *
        </span>
        <div className="space-y-2">
          {offerings.map((offering, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={offering}
                onChange={(e) => updateOffering(idx, e.target.value)}
                placeholder={locale === 'ja' ? `提供するもの ${idx + 1}` : `Offering ${idx + 1}`}
                className={INPUT_CLASS}
              />
              {offerings.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOffering(idx)}
                  aria-label="Remove"
                  className="shrink-0 px-3 rounded border border-[#1F2937] text-[#9CA3AF] hover:text-red-400 hover:border-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        {offerings.length < MAX_OFFERINGS && (
          <button
            type="button"
            onClick={addOffering}
            className="mt-2 inline-flex items-center gap-2 text-[#00E87A] text-xs font-mono uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            <Plus size={14} />
            {locale === 'ja' ? '追加' : 'Add another'}
          </button>
        )}
        {errors.key_offerings && <p className={ERROR_CLASS}>{errorMsg(errors.key_offerings, locale)}</p>}
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="border border-[#1F2937] text-[#F4F4F2] font-mono uppercase tracking-widest text-sm px-6 py-3 rounded hover:border-[#374151] transition-colors"
        >
          {locale === 'ja' ? '戻る' : 'Back'}
        </button>
        <button
          type="submit"
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest text-sm px-6 py-3 rounded hover:bg-[#00E87A]/90 transition-colors"
        >
          {locale === 'ja' ? '次へ' : 'Next'}
        </button>
      </div>
    </form>
  );
}
