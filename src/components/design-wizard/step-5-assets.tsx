'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { step5Schema, type AssetItem, type DesignWizardFormData } from '@/lib/validations/design-wizard';

interface Step5Props {
  initialValues: Partial<DesignWizardFormData>;
  onSubmit: (data: Partial<DesignWizardFormData>) => void;
  onBack: () => void;
  userId: string;
  locale: string;
  isSubmitting: boolean;
}

const LABEL_CLASS = 'block text-[#F4F4F2] text-xs font-mono uppercase tracking-widest mb-2';
const ERROR_CLASS = 'text-red-400 text-xs font-mono mt-1';
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
const MAX_SLOTS = 3;

interface AssetSlot extends AssetItem {
  signed_url: string | null;
}

function emptySlot(): AssetSlot {
  return { path: '', caption: '', content_type: '', size: 0, signed_url: null };
}

function isPopulated(slot: AssetSlot): boolean {
  return Boolean(slot.path);
}

export function Step5Assets({
  initialValues,
  onSubmit,
  onBack,
  userId,
  locale,
  isSubmitting,
}: Step5Props) {
  const isJa = locale === 'ja';

  // Restore from saved progress — regenerate signed URLs on mount
  const [slots, setSlots] = useState<AssetSlot[]>(() => {
    const saved = (initialValues.assets ?? []) as AssetItem[];
    const filled = saved.slice(0, MAX_SLOTS).map((a): AssetSlot => ({ ...a, signed_url: null }));
    while (filled.length < MAX_SLOTS) filled.push(emptySlot());
    return filled;
  });

  const [uploading, setUploading] = useState<boolean[]>([false, false, false]);
  const [uploadErrors, setUploadErrors] = useState<(string | null)[]>([null, null, null]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Regenerate signed URLs for any slots restored from autosave
  useEffect(() => {
    const supabase = createClient();
    slots.forEach((slot, idx) => {
      if (slot.path && !slot.signed_url) {
        supabase.storage
          .from('brand-assets')
          .createSignedUrl(slot.path, 3600)
          .then(({ data }) => {
            if (data?.signedUrl) {
              setSlots((prev) => {
                const next = [...prev];
                next[idx] = { ...next[idx], signed_url: data.signedUrl };
                return next;
              });
            }
          });
      }
    });
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUploading1 = (idx: number, val: boolean) =>
    setUploading((prev) => { const n = [...prev]; n[idx] = val; return n; });

  const setUploadError1 = (idx: number, val: string | null) =>
    setUploadErrors((prev) => { const n = [...prev]; n[idx] = val; return n; });

  const handleFile = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset input so the same file can be re-selected after removal
    e.target.value = '';
    if (!file) return;

    setUploadError1(idx, null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError1(idx, isJa ? 'PNG/JPG/SVG/WebPのみ対応' : 'Only PNG, JPG, SVG, WebP allowed');
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError1(idx, isJa ? '2MB以下にしてください' : 'File must be under 2MB');
      return;
    }

    setUploading1(idx, true);
    try {
      const supabase = createClient();

      // If slot already has a file, remove the old one first (best-effort)
      if (slots[idx].path) {
        await supabase.storage.from('brand-assets').remove([slots[idx].path]);
      }

      const ext = file.name.split('.').pop() || 'png';
      const path = `${userId}/assets/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('brand-assets')
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;

      const { data: signed, error: signErr } = await supabase.storage
        .from('brand-assets')
        .createSignedUrl(path, 3600);
      if (signErr) throw signErr;

      setSlots((prev) => {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          path,
          content_type: file.type,
          size: file.size,
          signed_url: signed.signedUrl,
        };
        return next;
      });
    } catch {
      setUploadError1(
        idx,
        isJa ? 'アップロードに失敗しました。もう一度お試しください。' : 'Upload failed. Please try again.'
      );
    } finally {
      setUploading1(idx, false);
    }
  };

  const handleRemove = async (idx: number) => {
    const slot = slots[idx];
    if (!slot.path) return;
    const supabase = createClient();
    // Best-effort removal — don't block UI on failure
    supabase.storage.from('brand-assets').remove([slot.path]).catch(() => {});
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = emptySlot();
      return next;
    });
    setUploadError1(idx, null);
  };

  const handleCaptionChange = (idx: number, val: string) => {
    setSlots((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], caption: val.slice(0, 280) };
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || uploading.some(Boolean)) return;

    const populated = slots.filter(isPopulated);
    const assetItems: AssetItem[] = populated.map(({ path, caption, content_type, size }) => ({
      path,
      caption,
      content_type,
      size,
    }));

    const parsed = step5Schema.safeParse({ assets: assetItems });
    if (!parsed.success) {
      setSubmitError(
        isJa ? '入力内容を確認してください。' : 'Please check your answers.'
      );
      return;
    }

    setSubmitError(null);
    onSubmit(parsed.data);
  };

  const anyUploading = uploading.some(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      <div>
        <p className="text-[#6B7280] text-xs font-mono leading-relaxed">
          {isJa
            ? 'サイトに掲載したい画像（ロゴ、店舗・商品・チームの写真など）を最大3枚アップロードしてください。'
            : 'Upload up to 3 images you want on your site — logos, business photos, product shots, team photos, etc.'}
        </p>
      </div>

      {slots.map((slot, idx) => (
        <div key={idx} className="border border-[#1F2937] rounded-lg p-4 space-y-3 bg-[#0D0D0D]">
          <p className={LABEL_CLASS}>
            {isJa ? `画像 ${idx + 1}` : `Image ${idx + 1}`}
          </p>

          {isPopulated(slot) ? (
            <div className="space-y-3">
              {/* Preview */}
              {slot.signed_url && (
                <div className="inline-block p-2 border border-[#1F2937] rounded">
                  <Image
                    src={slot.signed_url}
                    alt={`Asset ${idx + 1} preview`}
                    width={120}
                    height={120}
                    className="h-24 w-auto max-w-[160px] object-contain"
                    unoptimized
                  />
                </div>
              )}
              {!slot.signed_url && (
                <div className="flex items-center gap-2 p-3 border border-[#1F2937] rounded bg-[#131313]">
                  <span className="text-[#00E87A] text-xs font-mono">
                    {isJa ? '✓ アップロード済み' : '✓ Uploaded'}
                  </span>
                </div>
              )}

              {/* Caption */}
              <div>
                <label htmlFor={`caption-${idx}`} className={LABEL_CLASS}>
                  {isJa ? 'メモ（任意）' : 'Caption (optional)'}
                </label>
                <textarea
                  id={`caption-${idx}`}
                  value={slot.caption}
                  onChange={(e) => handleCaptionChange(idx, e.target.value)}
                  placeholder={
                    isJa
                      ? '例：店舗の外観写真、商品ラインナップなど'
                      : 'e.g. Storefront exterior, product lineup…'
                  }
                  rows={2}
                  maxLength={280}
                  className="w-full bg-[#131313] border border-[#1F2937] rounded px-3 py-2 text-[#F4F4F2] text-sm font-mono focus:outline-none focus:border-[#00E87A] transition-colors resize-none"
                />
                <p className="text-[#374151] text-[10px] font-mono mt-1 text-right">
                  {slot.caption.length}/280
                </p>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-red-400 hover:text-red-300 font-mono text-xs transition-colors"
              >
                {isJa ? '削除する' : 'Remove'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                id={`asset-file-${idx}`}
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.webp"
                onChange={(e) => handleFile(idx, e)}
                disabled={uploading[idx]}
                className="block w-full text-xs font-mono text-[#9CA3AF] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-mono file:font-bold file:uppercase file:tracking-widest file:bg-[#00E87A] file:text-[#0D0D0D] hover:file:bg-[#00E87A]/90 file:cursor-pointer"
              />
              <p className="text-[#6B7280] text-xs font-mono">
                {isJa ? 'PNG/JPG/SVG/WebP — 最大2MB' : 'PNG, JPG, SVG, WebP — max 2MB'}
              </p>
              {uploading[idx] && (
                <p className="text-[#00E87A] text-xs font-mono">
                  {isJa ? 'アップロード中...' : 'Uploading...'}
                </p>
              )}
              {uploadErrors[idx] && (
                <p className={ERROR_CLASS}>{uploadErrors[idx]}</p>
              )}
            </div>
          )}
        </div>
      ))}

      {submitError && (
        <p className={ERROR_CLASS} role="alert">{submitError}</p>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="border border-[#1F2937] text-[#F4F4F2] font-mono uppercase tracking-widest text-sm px-6 py-3 rounded hover:border-[#374151] transition-colors"
        >
          {isJa ? '戻る' : 'Back'}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || anyUploading}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest text-sm px-6 py-3 rounded hover:bg-[#00E87A]/90 active:bg-[#00C96A] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? isJa ? '送信中...' : 'Submitting...'
            : anyUploading
            ? isJa ? 'アップロード中...' : 'Uploading...'
            : isJa ? '送信する' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
