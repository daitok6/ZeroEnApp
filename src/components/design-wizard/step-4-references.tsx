'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { step4Schema, type DesignWizardFormData } from '@/lib/validations/design-wizard';
import { errorMsg } from '@/lib/wizard-errors';

interface Step4Props {
  initialValues: Partial<DesignWizardFormData>;
  onSubmit: (data: Partial<DesignWizardFormData>) => void;
  onBack: () => void;
  locale: string;
  isSubmitting: boolean;
}

const LABEL_CLASS = 'block text-[#F4F4F2] text-xs font-mono uppercase tracking-widest mb-2';
const INPUT_CLASS =
  'w-full bg-[#0D0D0D] border border-[#1F2937] rounded px-3 py-2 text-[#F4F4F2] text-sm font-mono focus:outline-none focus:border-[#00E87A] transition-colors';
const ERROR_CLASS = 'text-red-400 text-xs font-mono mt-1';

const MAX_URLS = 5;
const MAX_KEYWORDS = 10;

export function Step4References({
  initialValues,
  onSubmit,
  onBack,
  locale,
  isSubmitting,
}: Step4Props) {
  const [urls, setUrls] = useState<string[]>(() => {
    const arr = initialValues.reference_urls as string[] | undefined;
    return arr && arr.length > 0 ? arr : [''];
  });
  const [keywords, setKeywords] = useState<string[]>(
    (initialValues.vibe_keywords as string[] | undefined) ?? []
  );
  const [keywordInput, setKeywordInput] = useState('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(
    initialValues.terms_accepted === true
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Summary fields from previous steps
  const businessName = (initialValues.business_name as string) ?? '—';
  const industry = (initialValues.industry as string) ?? '—';
  const primaryCta = (initialValues.primary_cta as string) ?? '—';

  const updateUrl = (idx: number, value: string) => {
    setUrls((arr) => arr.map((v, i) => (i === idx ? value : v)));
  };
  const addUrl = () => {
    if (urls.length < MAX_URLS) setUrls((arr) => [...arr, '']);
  };
  const removeUrl = (idx: number) => {
    setUrls((arr) => (arr.length > 1 ? arr.filter((_, i) => i !== idx) : ['']));
  };

  const addKeyword = (raw: string) => {
    const kw = raw.trim().replace(/,$/, '').trim();
    if (!kw) return;
    if (keywords.length >= MAX_KEYWORDS) return;
    if (keywords.includes(kw)) return;
    setKeywords((k) => [...k, kw]);
    setKeywordInput('');
  };

  const handleKeywordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword(keywordInput);
    } else if (e.key === 'Backspace' && keywordInput === '' && keywords.length > 0) {
      setKeywords((k) => k.slice(0, -1));
    }
  };

  const removeKeyword = (idx: number) => {
    setKeywords((k) => k.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedUrls = urls.map((u) => u.trim()).filter(Boolean);

    const parsed = step4Schema.safeParse({
      reference_urls: cleanedUrls,
      vibe_keywords: keywords,
      terms_accepted: termsAccepted,
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
    onSubmit(parsed.data);
  };

  const termsCopy =
    locale === 'ja'
      ? 'ZeroEnの6ヶ月の最低契約期間に同意します。コード所有権はZeroEnが保持し、サイト公開時にサブスクリプションが開始されることを理解しました。'
      : "I agree to ZeroEn's 6-month service commitment. I understand that ZeroEn retains code ownership. My subscription will begin when my site is deployed.";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Review summary */}
      <div className="rounded border border-[#1F2937] bg-[#0D0D0D] p-4">
        <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-3">
          {locale === 'ja' ? '入力内容の確認' : 'Review'}
        </p>
        <dl className="space-y-2 text-xs font-mono">
          <div className="flex justify-between gap-4">
            <dt className="text-[#9CA3AF]">{locale === 'ja' ? '事業名' : 'Business'}</dt>
            <dd className="text-[#F4F4F2] text-right break-words">{businessName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#9CA3AF]">{locale === 'ja' ? '業種' : 'Industry'}</dt>
            <dd className="text-[#F4F4F2] text-right break-words">{industry}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#9CA3AF]">{locale === 'ja' ? 'メインCTA' : 'Primary CTA'}</dt>
            <dd className="text-[#F4F4F2] text-right break-words">{primaryCta}</dd>
          </div>
        </dl>
      </div>

      {/* Inspiration URLs */}
      <div>
        <span className={LABEL_CLASS}>
          {locale === 'ja' ? 'インスピレーション (サイトURL)' : 'Inspiration URLs'}
        </span>
        <div className="space-y-2">
          {urls.map((url, idx) => (
            <div key={idx}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => updateUrl(idx, e.target.value)}
                  placeholder="https://example.com"
                  className={INPUT_CLASS}
                />
                <button
                  type="button"
                  onClick={() => removeUrl(idx)}
                  aria-label="Remove URL"
                  className="shrink-0 px-3 rounded border border-[#1F2937] text-[#9CA3AF] hover:text-red-400 hover:border-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {urls.length < MAX_URLS && (
          <button
            type="button"
            onClick={addUrl}
            className="mt-2 inline-flex items-center gap-2 text-[#00E87A] text-xs font-mono uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            <Plus size={14} />
            {locale === 'ja' ? 'サイトを追加' : 'Add site'}
          </button>
        )}
      </div>

      {/* Vibe keywords */}
      <div>
        <label htmlFor="vibe_keywords" className={LABEL_CLASS}>
          {locale === 'ja' ? '雰囲気のキーワード' : 'Vibe keywords'}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {keywords.map((kw, idx) => (
            <span
              key={`${kw}-${idx}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E87A]/10 border border-[#00E87A]/30 text-[#00E87A] text-xs font-mono"
            >
              {kw}
              <button
                type="button"
                onClick={() => removeKeyword(idx)}
                aria-label={`Remove ${kw}`}
                className="hover:text-red-400 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <input
          id="vibe_keywords"
          type="text"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={handleKeywordKey}
          onBlur={() => addKeyword(keywordInput)}
          placeholder={
            locale === 'ja'
              ? 'Enter / カンマで追加 (例: ミニマル, 高級感)'
              : 'Enter or comma to add (e.g. minimal, luxurious)'
          }
          disabled={keywords.length >= MAX_KEYWORDS}
          className={INPUT_CLASS}
        />
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {keywords.length} / {MAX_KEYWORDS}
        </p>
      </div>

      {/* Terms */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#1F2937] bg-[#0D0D0D] accent-[#00E87A] cursor-pointer shrink-0"
            required
          />
          <span className="text-[#9CA3AF] text-xs font-mono leading-relaxed group-hover:text-[#F4F4F2] transition-colors">
            {termsCopy}
          </span>
        </label>
        {errors.terms_accepted && <p className={ERROR_CLASS}>{errorMsg(errors.terms_accepted, locale)}</p>}
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="border border-[#1F2937] text-[#F4F4F2] font-mono uppercase tracking-widest text-sm px-6 py-3 rounded hover:border-[#374151] transition-colors disabled:opacity-40"
        >
          {locale === 'ja' ? '戻る' : 'Back'}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !termsAccepted}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest text-sm px-6 py-3 rounded hover:bg-[#00E87A]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? locale === 'ja'
              ? '送信中...'
              : 'Submitting...'
            : locale === 'ja'
            ? '送信する'
            : 'Submit'}
        </button>
      </div>
    </form>
  );
}
