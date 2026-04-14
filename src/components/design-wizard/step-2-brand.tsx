'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { step2Schema, type DesignWizardFormData } from '@/lib/validations/design-wizard';

interface Step2Props {
  initialValues: Partial<DesignWizardFormData>;
  onNext: (data: Partial<DesignWizardFormData>) => void;
  onBack: () => void;
  userId: string;
  locale: string;
}

const FONT_OPTIONS = [
  { value: 'Modern sans-serif', labelEn: 'Modern sans-serif', labelJa: 'モダン サンセリフ' },
  { value: 'Classic serif', labelEn: 'Classic serif', labelJa: 'クラシック セリフ' },
  { value: 'Minimal mono', labelEn: 'Minimal mono', labelJa: 'ミニマル モノスペース' },
  { value: 'Bold display', labelEn: 'Bold display', labelJa: 'ボールド ディスプレイ' },
  { value: 'No preference', labelEn: 'No preference', labelJa: '指定なし' },
];

const LABEL_CLASS = 'block text-[#F4F4F2] text-xs font-mono uppercase tracking-widest mb-2';
const INPUT_CLASS =
  'w-full bg-[#0D0D0D] border border-[#1F2937] rounded px-3 py-2 text-[#F4F4F2] text-sm font-mono focus:outline-none focus:border-[#00E87A] transition-colors';
const ERROR_CLASS = 'text-red-400 text-xs font-mono mt-1';

const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

export function Step2Brand({ initialValues, onNext, onBack, userId, locale }: Step2Props) {
  const [state, setState] = useState({
    logo_url: (initialValues.logo_url as string) ?? '',
    primary_color: (initialValues.primary_color as string) || '#00E87A',
    secondary_color: (initialValues.secondary_color as string) || '#1A1A1A',
    font_preference: (initialValues.font_preference as string) || 'No preference',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError(locale === 'ja' ? 'PNG/JPG/SVG/WebPのみ対応' : 'Only PNG, JPG, SVG, WebP allowed');
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      setUploadError(locale === 'ja' ? '2MB以下にしてください' : 'File must be under 2MB');
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'png';
      const path = `${userId}/logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('brand-assets')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('brand-assets').getPublicUrl(path);
      setState((s) => ({ ...s, logo_url: pub.publicUrl }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = step2Schema.safeParse(state);
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
      {/* Logo */}
      <div>
        <label htmlFor="logo" className={LABEL_CLASS}>
          {locale === 'ja' ? 'ロゴ' : 'Logo'}
        </label>
        <input
          id="logo"
          type="file"
          accept=".png,.jpg,.jpeg,.svg,.webp"
          onChange={handleFile}
          disabled={uploading}
          className="block w-full text-xs font-mono text-[#9CA3AF] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-mono file:font-bold file:uppercase file:tracking-widest file:bg-[#00E87A] file:text-[#0D0D0D] hover:file:bg-[#00E87A]/90 file:cursor-pointer"
        />
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {locale === 'ja' ? 'PNG/JPG/SVG/WebP — 最大2MB' : 'PNG, JPG, SVG, WebP — max 2MB'}
        </p>
        {uploading && (
          <p className="text-[#00E87A] text-xs font-mono mt-1">
            {locale === 'ja' ? 'アップロード中...' : 'Uploading...'}
          </p>
        )}
        {uploadError && <p className={ERROR_CLASS}>{uploadError}</p>}
        {state.logo_url && !uploading && (
          <div className="mt-3 inline-block p-3 border border-[#1F2937] rounded bg-[#0D0D0D]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src={state.logo_url}
              alt="Logo preview"
              width={96}
              height={96}
              className="h-24 w-auto object-contain"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Primary color */}
      <div>
        <label htmlFor="primary_color" className={LABEL_CLASS}>
          {locale === 'ja' ? 'メインカラー' : 'Primary color'}
        </label>
        <div className="flex items-center gap-3">
          <input
            id="primary_color"
            type="color"
            value={state.primary_color}
            onChange={(e) => setState((s) => ({ ...s, primary_color: e.target.value }))}
            className="h-10 w-16 rounded border border-[#1F2937] bg-[#0D0D0D] cursor-pointer"
          />
          <span className="text-[#F4F4F2] text-sm font-mono uppercase">{state.primary_color}</span>
        </div>
        {errors.primary_color && <p className={ERROR_CLASS}>{errors.primary_color}</p>}
      </div>

      {/* Secondary color */}
      <div>
        <label htmlFor="secondary_color" className={LABEL_CLASS}>
          {locale === 'ja' ? 'サブカラー' : 'Secondary color'}
        </label>
        <div className="flex items-center gap-3">
          <input
            id="secondary_color"
            type="color"
            value={state.secondary_color}
            onChange={(e) => setState((s) => ({ ...s, secondary_color: e.target.value }))}
            className="h-10 w-16 rounded border border-[#1F2937] bg-[#0D0D0D] cursor-pointer"
          />
          <span className="text-[#F4F4F2] text-sm font-mono uppercase">{state.secondary_color}</span>
        </div>
        {errors.secondary_color && <p className={ERROR_CLASS}>{errors.secondary_color}</p>}
      </div>

      {/* Font */}
      <div>
        <span className={LABEL_CLASS}>
          {locale === 'ja' ? 'フォントの好み' : 'Font preference'}
        </span>
        <div className="space-y-2">
          {FONT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group p-2 rounded hover:bg-[#0D0D0D] transition-colors"
            >
              <input
                type="radio"
                name="font_preference"
                value={opt.value}
                checked={state.font_preference === opt.value}
                onChange={(e) => setState((s) => ({ ...s, font_preference: e.target.value }))}
                className="h-4 w-4 accent-[#00E87A] cursor-pointer"
              />
              <span className="text-[#F4F4F2] text-sm font-mono group-hover:text-[#00E87A] transition-colors">
                {locale === 'ja' ? opt.labelJa : opt.labelEn}
              </span>
            </label>
          ))}
        </div>
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
          disabled={uploading}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest text-sm px-6 py-3 rounded hover:bg-[#00E87A]/90 transition-colors disabled:opacity-40"
        >
          {locale === 'ja' ? '次へ' : 'Next'}
        </button>
      </div>
    </form>
  );
}
