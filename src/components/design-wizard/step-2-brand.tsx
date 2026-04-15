'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { step2Schema, type DesignWizardFormData } from '@/lib/validations/design-wizard';
import { errorMsg } from '@/lib/wizard-errors';
import { suggestPalettes, type Palette } from '@/lib/colors/palette-suggest';
import {
  ALL_FONTS,
  JP_FONTS,
  LATIN_FONTS,
  CATEGORY_LABEL,
  previewUrl,
  fullUrl,
  type FontMeta,
  type FontCategory,
} from '@/lib/fonts/google-fonts';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface Step2Props {
  initialValues: Partial<DesignWizardFormData>;
  onNext: (data: Partial<DesignWizardFormData>) => void;
  onBack: () => void;
  userId: string;
  locale: string;
  isAdvancing?: boolean;
}

const LABEL_CLASS = 'block text-[#F4F4F2] text-xs font-mono uppercase tracking-widest mb-2';
const INPUT_CLASS =
  'w-full bg-[#0D0D0D] border border-[#1F2937] rounded px-3 py-2 text-[#F4F4F2] text-sm font-mono focus:outline-none focus:border-[#00E87A] transition-colors';
const ERROR_CLASS = 'text-red-400 text-xs font-mono mt-1';

const MAX_LOGO_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

// ── Lazy font loader via IntersectionObserver ─────────────────────────────────

const loadedFonts = new Set<string>();

function useLazyFontLoad(family: string, text: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const key = `${family}::${text}`;
    if (loadedFonts.has(key)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (!loadedFonts.has(key)) {
            loadedFonts.add(key);
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = previewUrl(family, text);
            document.head.appendChild(link);
          }
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [family, text]);
  return ref;
}

// ── Font card ─────────────────────────────────────────────────────────────────

const SAMPLE_EN = 'The quick brown fox';
const SAMPLE_JA = 'あの夏、僕らは銀河を見た。';

function FontCard({
  font,
  selected,
  onClick,
}: {
  font: FontMeta;
  selected: boolean;
  onClick: () => void;
}) {
  const sampleText = font.script === 'jp' ? SAMPLE_JA : SAMPLE_EN;
  const ref = useLazyFontLoad(font.family, sampleText);

  return (
    <div
      ref={ref}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`cursor-pointer rounded border p-3 transition-all select-none ${
        selected
          ? 'border-[#00E87A] bg-[#00E87A]/5'
          : 'border-[#1F2937] hover:border-[#374151] bg-[#0D0D0D]'
      }`}
    >
      <p
        style={{ fontFamily: `"${font.family}", sans-serif` }}
        className="text-[#F4F4F2] text-base leading-snug mb-2 truncate"
      >
        {sampleText}
      </p>
      <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-widest truncate">
        {font.family}
      </p>
    </div>
  );
}

// ── Palette card ──────────────────────────────────────────────────────────────

function PaletteCard({
  palette,
  selected,
  onClick,
  locale,
}: {
  palette: Palette;
  selected: boolean;
  onClick: () => void;
  locale: string;
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`cursor-pointer rounded border p-3 transition-all select-none ${
        selected
          ? 'border-[#00E87A] bg-[#00E87A]/5'
          : 'border-[#1F2937] hover:border-[#374151] bg-[#0D0D0D]'
      }`}
    >
      {/* Colour swatches */}
      <div className="flex gap-1.5 mb-3">
        {[palette.primary, palette.secondary, palette.accent, palette.neutralLight, palette.neutralDark].map(
          (hex, i) => (
            <div
              key={i}
              className="h-6 flex-1 rounded"
              style={{ backgroundColor: hex }}
              title={hex}
            />
          )
        )}
      </div>
      <p className="text-[#F4F4F2] text-xs font-mono font-bold uppercase tracking-widest mb-1">
        {locale === 'ja' ? palette.nameJa : palette.nameEn}
      </p>
      <p className="text-[#9CA3AF] text-xs font-mono leading-snug">
        {locale === 'ja' ? palette.blurbJa : palette.blurbEn}
      </p>
    </div>
  );
}

// ── Category group label ───────────────────────────────────────────────────────

function GroupHeading({ label }: { label: string }) {
  return (
    <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-widest mt-5 mb-2 first:mt-0">
      {label}
    </p>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function Step2Brand({
  initialValues,
  onNext,
  onBack,
  userId,
  locale,
  isAdvancing = false,
}: Step2Props) {
  const [state, setState] = useState({
    logo_url: (initialValues.logo_url as string) ?? '',
    primary_color: (initialValues.primary_color as string) || '#00E87A',
    secondary_color: (initialValues.secondary_color as string) || '#1A1A1A',
    font_preference: (initialValues.font_preference as string) || 'No preference',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string | null>(null);
  const [fontSearch, setFontSearch] = useState('');
  const [fontListOpen, setFontListOpen] = useState<string[]>([]);

  // ── Logo upload ───────────────────────────────────────────────────────────

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
      const { data: signed, error: signErr } = await supabase.storage
        .from('brand-assets')
        .createSignedUrl(path, 3600); // 1-hour expiry — enough for the wizard session
      if (signErr) throw signErr;
      setState((s) => ({ ...s, logo_url: signed.signedUrl }));
    } catch {
      setUploadError(
        locale === 'ja'
          ? 'アップロードに失敗しました。もう一度お試しください。'
          : 'Upload failed. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  // ── Palette suggestions ───────────────────────────────────────────────────

  const palettes = useMemo(() => suggestPalettes(state.primary_color), [state.primary_color]);

  const applyPalette = useCallback(
    (palette: Palette) => {
      setSelectedPaletteId(palette.id);
      setState((s) => ({
        ...s,
        primary_color: palette.primary,
        secondary_color: palette.secondary,
      }));
    },
    []
  );

  // ── Font selection ────────────────────────────────────────────────────────

  // Ordered font list: JP first for ja locale
  const orderedFonts = useMemo(
    () => (locale === 'ja' ? [...JP_FONTS, ...LATIN_FONTS] : [...LATIN_FONTS, ...JP_FONTS]),
    [locale]
  );

  const filteredFonts = useMemo(() => {
    if (!fontSearch.trim()) return orderedFonts;
    const q = fontSearch.toLowerCase();
    return orderedFonts.filter((f) => f.family.toLowerCase().includes(q));
  }, [orderedFonts, fontSearch]);

  // Group fonts by category for display
  const groupedFonts = useMemo(() => {
    const groups: Partial<Record<FontCategory, FontMeta[]>> = {};
    for (const font of filteredFonts) {
      if (!groups[font.category]) groups[font.category] = [];
      groups[font.category]!.push(font);
    }
    return groups;
  }, [filteredFonts]);

  const categoryOrder: FontCategory[] =
    locale === 'ja'
      ? ['sans', 'serif', 'handwriting', 'mono', 'display']
      : ['sans', 'serif', 'mono', 'display', 'handwriting'];

  // Load selected font fully when it changes
  useEffect(() => {
    const font = ALL_FONTS.find((f) => f.family === state.font_preference);
    if (!font) return;
    const key = `full::${font.family}`;
    if (loadedFonts.has(key)) return;
    loadedFonts.add(key);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fullUrl(font);
    document.head.appendChild(link);
  }, [state.font_preference]);

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdvancing || uploading) return;
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

  // ── Render ────────────────────────────────────────────────────────────────

  const isJa = locale === 'ja';

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      {/* ── Logo ── */}
      <div>
        <label htmlFor="logo" className={LABEL_CLASS}>
          {isJa ? 'ロゴ' : 'Logo'}
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
          {isJa ? 'PNG/JPG/SVG/WebP — 最大2MB' : 'PNG, JPG, SVG, WebP — max 2MB'}
        </p>
        {uploading && (
          <p className="text-[#00E87A] text-xs font-mono mt-1">
            {isJa ? 'アップロード中...' : 'Uploading...'}
          </p>
        )}
        {uploadError && <p className={ERROR_CLASS}>{uploadError}</p>}
        {state.logo_url && !uploading && (
          <div className="mt-3 inline-block p-3 border border-[#1F2937] rounded bg-[#0D0D0D]">
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

      {/* ── Primary colour ── */}
      <div>
        <label htmlFor="primary_color" className={LABEL_CLASS}>
          {isJa ? 'メインカラー' : 'Primary color'}
        </label>
        <div className="flex items-center gap-3">
          <input
            id="primary_color"
            type="color"
            value={state.primary_color}
            onChange={(e) => {
              setState((s) => ({ ...s, primary_color: e.target.value }));
              setSelectedPaletteId(null);
            }}
            className="h-10 w-16 rounded border border-[#1F2937] bg-[#0D0D0D] cursor-pointer"
          />
          <span className="text-[#F4F4F2] text-sm font-mono uppercase">{state.primary_color}</span>
        </div>
        {errors.primary_color && <p className={ERROR_CLASS}>{errorMsg(errors.primary_color, locale)}</p>}
      </div>

      {/* ── Palette suggestions ── */}
      <div>
        <p className={LABEL_CLASS}>
          {isJa ? 'おすすめの組み合わせ' : 'Suggested combinations'}
        </p>
        <p className="text-[#6B7280] text-xs font-mono mb-3">
          {isJa
            ? 'メインカラーから自動生成。クリックで適用できます。'
            : 'Auto-generated from your primary colour. Click to apply.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {palettes.map((p) => (
            <PaletteCard
              key={p.id}
              palette={p}
              selected={selectedPaletteId === p.id}
              onClick={() => applyPalette(p)}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* ── Secondary colour (manual override) ── */}
      <div>
        <label htmlFor="secondary_color" className={LABEL_CLASS}>
          {isJa ? 'サブカラー (手動調整)' : 'Secondary color (manual override)'}
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
        {errors.secondary_color && (
          <p className={ERROR_CLASS}>{errorMsg(errors.secondary_color, locale)}</p>
        )}
      </div>

      {/* ── Font picker ── */}
      <div>
        <p className={LABEL_CLASS}>
          {isJa ? 'フォントを選ぶ' : 'Choose a font'}
        </p>
        <p className="text-[#6B7280] text-xs font-mono mb-3">
          {isJa
            ? '商用利用無料のGoogle Fontsから選べます。'
            : 'All fonts are free for commercial use via Google Fonts.'}
        </p>

        {/* Search */}
        <input
          type="text"
          value={fontSearch}
          onChange={(e) => {
              setFontSearch(e.target.value);
              if (e.target.value) setFontListOpen(['fonts']);
            }}
          placeholder={isJa ? 'フォント名で検索...' : 'Search fonts...'}
          className={`${INPUT_CLASS} mb-4`}
        />

        {/* No-preference option */}
        <div
          onClick={() => setState((s) => ({ ...s, font_preference: 'No preference' }))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            e.key === 'Enter' && setState((s) => ({ ...s, font_preference: 'No preference' }))
          }
          className={`cursor-pointer rounded border p-3 mb-4 transition-all select-none ${
            state.font_preference === 'No preference'
              ? 'border-[#00E87A] bg-[#00E87A]/5'
              : 'border-[#1F2937] hover:border-[#374151] bg-[#0D0D0D]'
          }`}
        >
          <p className="text-[#F4F4F2] text-sm font-mono">
            {isJa ? '指定なし（デザイナーに任せる）' : 'No preference — leave it to the designer'}
          </p>
        </div>

        {/* Grouped font cards — collapsible */}
        <Accordion value={fontListOpen} onValueChange={setFontListOpen}>
          <AccordionItem value="fonts" className="border-[#1F2937]">
            <AccordionTrigger className="py-3 text-[#F4F4F2] font-mono text-xs uppercase tracking-widest hover:no-underline">
              {state.font_preference && state.font_preference !== 'No preference'
                ? (isJa
                    ? `選択中: ${state.font_preference} — フォントを変更する (${filteredFonts.length})`
                    : `Selected: ${state.font_preference} — Browse fonts (${filteredFonts.length})`)
                : (isJa
                    ? `すべてのフォントを見る (${filteredFonts.length})`
                    : `Browse all fonts (${filteredFonts.length})`)}
            </AccordionTrigger>
            <AccordionContent>
              {filteredFonts.length === 0 ? (
                <p className="text-[#6B7280] text-xs font-mono">
                  {isJa ? '一致するフォントが見つかりません。' : 'No fonts match your search.'}
                </p>
              ) : (
                categoryOrder.map((cat) => {
                  const fonts = groupedFonts[cat];
                  if (!fonts || fonts.length === 0) return null;
                  return (
                    <div key={cat}>
                      <GroupHeading
                        label={`${CATEGORY_LABEL[cat][isJa ? 'ja' : 'en']} (${fonts.length})`}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {fonts.map((font) => (
                          <FontCard
                            key={font.family}
                            font={font}
                            selected={state.font_preference === font.family}
                            onClick={() => setState((s) => ({ ...s, font_preference: font.family }))}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Selected font preview */}
        {state.font_preference && state.font_preference !== 'No preference' && (
          <div className="mt-4 p-4 rounded border border-[#1F2937] bg-[#0D0D0D]">
            <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-widest mb-2">
              {isJa ? '選択中' : 'Selected'}
            </p>
            <p
              style={{ fontFamily: `"${state.font_preference}", sans-serif` }}
              className="text-[#F4F4F2] text-2xl font-bold"
            >
              {state.font_preference}
            </p>
            <p
              style={{ fontFamily: `"${state.font_preference}", sans-serif` }}
              className="text-[#9CA3AF] text-sm mt-1"
            >
              {isJa ? SAMPLE_JA : SAMPLE_EN}
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
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
          disabled={uploading || isAdvancing}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest text-sm px-6 py-3 rounded hover:bg-[#00E87A]/90 active:bg-[#00C96A] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isAdvancing
            ? isJa ? '保存中...' : 'Saving...'
            : uploading
            ? isJa ? 'アップロード中...' : 'Uploading...'
            : isJa ? '次へ' : 'Next'}
        </button>
      </div>
    </form>
  );
}
