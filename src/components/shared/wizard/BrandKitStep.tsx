'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BrandKit } from '@/types/managed-client-intake';
import { VIBE_TAGS, PRESET_PALETTES, FONT_PAIRINGS, inputClass, labelClass, t } from './constants';
import { ErrorBanner } from './ErrorBanner';

interface Props {
  locale: string;
  brandKit: BrandKit;
  setBrandKit: React.Dispatch<React.SetStateAction<BrandKit>>;
  sampleSiteInput: string;
  setSampleSiteInput: React.Dispatch<React.SetStateAction<string>>;
  toggleVibeTag: (tag: string) => void;
  selectPreset: (preset: typeof PRESET_PALETTES[number]) => void;
  updateCustomColor: (key: 'bg' | 'accent' | 'text', value: string) => void;
  addSampleSite: () => void;
  removeSampleSite: (site: string) => void;
  onNext: () => void;
  onBack?: () => void;
  isSaving: boolean;
  error: string | null;
}

export function BrandKitStep({
  locale, brandKit, setBrandKit,
  sampleSiteInput, setSampleSiteInput,
  toggleVibeTag, selectPreset, updateCustomColor,
  addSampleSite, removeSampleSite,
  onNext, onBack, isSaving, error,
}: Props) {
  return (
    <section>
      <h2 className="font-heading text-2xl md:text-3xl text-[#F4F4F2] mb-4">
        {t(locale, 'Brand Kit Discovery', 'ブランドキット発見')}
      </h2>

      <div className="mb-8">
        <h3 className={labelClass}>{t(locale, 'Tone', 'トーン')}</h3>
        {([
          { key: 'playful',   left: t(locale, 'Playful',   '遊び心'), right: t(locale, 'Serious',  '真面目') },
          { key: 'minimal',   left: t(locale, 'Minimal',   'ミニマル'), right: t(locale, 'Bold',    '大胆') },
          { key: 'corporate', left: t(locale, 'Corporate', '企業的'), right: t(locale, 'Indie',    'インディー') },
        ] as const).map((axis) => (
          <div key={axis.key} className="mb-4">
            <div className="flex justify-between text-[#6B7280] text-xs font-mono mb-2">
              <span>{axis.left}</span>
              <span>{axis.right}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brandKit.tone[axis.key]}
              onChange={(e) =>
                setBrandKit((prev) => ({
                  ...prev,
                  tone: { ...prev.tone, [axis.key]: Number(e.target.value) },
                }))
              }
              className="w-full accent-[#00E87A]"
            />
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className={labelClass}>{t(locale, 'Vibe Tags', 'バイブタグ')}</h3>
        <div className="flex flex-wrap gap-2">
          {VIBE_TAGS.map((tag) => {
            const selected = brandKit.vibe_tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleVibeTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                  selected
                    ? 'bg-[#00E87A] border-[#00E87A] text-[#0D0D0D]'
                    : 'bg-transparent border-[#374151] text-[#F4F4F2] hover:border-[#00E87A]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <h3 className={labelClass}>{t(locale, 'Color Palette', 'カラーパレット')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {PRESET_PALETTES.map((p) => {
            const selected = brandKit.palette.preset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPreset(p)}
                className={`rounded border p-3 text-left transition-colors ${
                  selected ? 'border-[#00E87A]' : 'border-[#374151] hover:border-[#6B7280]'
                }`}
              >
                <div className="flex gap-1 mb-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: p.bg }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: p.accent }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: p.text }} />
                </div>
                <div className="text-[#F4F4F2] text-xs font-mono">{p.name}</div>
              </button>
            );
          })}
        </div>
        <div
          className={`rounded border p-3 ${
            brandKit.palette.preset === 'custom' ? 'border-[#00E87A]' : 'border-[#374151]'
          }`}
        >
          <div className="text-[#F4F4F2] text-xs font-mono mb-2">
            {t(locale, 'Or customize', 'またはカスタム')}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['bg', 'accent', 'text'] as const).map((k) => (
              <label key={k} className="flex flex-col gap-1">
                <span className="text-[#6B7280] text-[10px] font-mono uppercase">{k}</span>
                <input
                  type="color"
                  value={brandKit.palette.colors[k]}
                  onChange={(e) => updateCustomColor(k, e.target.value)}
                  className="w-full h-8 bg-transparent cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className={labelClass}>{t(locale, 'Font Pairing', 'フォントペアリング')}</h3>
        <div className="flex flex-col gap-2">
          {FONT_PAIRINGS.map((fp) => {
            const selected = brandKit.font_pairing === fp.id;
            return (
              <button
                key={fp.id}
                type="button"
                onClick={() => setBrandKit((prev) => ({ ...prev, font_pairing: fp.id }))}
                className={`rounded border p-3 text-left transition-colors ${
                  selected ? 'border-[#00E87A]' : 'border-[#374151] hover:border-[#6B7280]'
                }`}
              >
                <div className="text-[#F4F4F2] text-sm font-mono">{fp.name}</div>
                <div className="text-[#6B7280] text-xs font-mono">{fp.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <h3 className={labelClass}>{t(locale, 'Sample Websites', 'サンプルサイト')}</h3>
        <div className="flex gap-2 mb-2">
          <Input
            value={sampleSiteInput}
            onChange={(e) => setSampleSiteInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSampleSite();
              }
            }}
            placeholder="https://example.com"
            className={inputClass}
          />
          <Button type="button" onClick={addSampleSite} className="bg-[#374151] text-[#F4F4F2] font-mono">
            {t(locale, 'Add', '追加')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {brandKit.sample_sites.map((site) => (
            <span
              key={site}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-xs font-mono"
            >
              {site}
              <button
                type="button"
                onClick={() => removeSampleSite(site)}
                className="text-[#6B7280] hover:text-[#00E87A]"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <ErrorBanner error={error} />
      <div className="flex gap-2">
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-transparent border-[#374151] text-[#F4F4F2] font-mono"
          >
            {t(locale, 'Back', '戻る')}
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={isSaving}
          className="bg-[#00E87A] text-[#0D0D0D] hover:bg-[#00E87A]/90 font-mono"
        >
          {t(locale, 'Continue', '次へ')}
        </Button>
      </div>
    </section>
  );
}
