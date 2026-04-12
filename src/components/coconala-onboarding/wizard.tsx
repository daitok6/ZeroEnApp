'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BrandKit, AssetsData, DomainData } from '@/types/managed-client-intake';

const TOTAL_STEPS = 5;

interface InitialIntake {
  scope_ack: boolean;
  commitment_ack_at: string | null;
  brand_kit: BrandKit | null;
  assets: AssetsData | null;
  domain: DomainData | null;
  coconala_order_ref: string | null;
  plan_tier: string | null;
}

interface Props {
  locale: string;
  profileId: string;
  scopeMd: string;
  initialIntake: InitialIntake | null;
}

const VIBE_TAGS = [
  'Modern', 'Classic', 'Warm', 'Clean', 'Technical', 'Friendly',
  'Premium', 'Bold', 'Elegant', 'Energetic', 'Trustworthy', 'Creative',
];

const PRESET_PALETTES = [
  { id: 'dark-tech', name: 'Dark Tech', bg: '#0D0D0D', accent: '#00E87A', text: '#F4F4F2' },
  { id: 'clean-light', name: 'Clean Light', bg: '#FFFFFF', accent: '#1A1A2E', text: '#333333' },
  { id: 'warm-earth', name: 'Warm Earth', bg: '#F5F0E8', accent: '#8B4513', text: '#2C1810' },
  { id: 'ocean-blue', name: 'Ocean Blue', bg: '#0A1628', accent: '#0EA5E9', text: '#E2F4FF' },
];

const FONT_PAIRINGS = [
  { id: 'modern-mono', name: 'Modern Mono', description: 'IBM Plex Mono + Syne' },
  { id: 'clean-sans', name: 'Clean Sans', description: 'Inter + Plus Jakarta Sans' },
  { id: 'bold-serif', name: 'Bold Serif', description: 'Playfair Display + DM Sans' },
];

const t = (locale: string, en: string, ja: string) => (locale === 'ja' ? ja : en);

const inputClass =
  'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280]';
const labelClass =
  'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2 font-mono';

export function CoconalaOnboardingWizard({ locale, profileId, scopeMd, initialIntake }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 state
  const [scopeAck, setScopeAck] = useState(initialIntake?.scope_ack ?? false);
  const [ownershipAck, setOwnershipAck] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<'basic' | 'premium'>(
    (initialIntake?.plan_tier as 'basic' | 'premium') ?? 'basic'
  );

  // Step 2 state
  const defaultBrandKit: BrandKit = {
    tone: { playful: 50, minimal: 50, corporate: 50 },
    vibe_tags: [],
    palette: { preset: null, colors: { bg: '#0D0D0D', accent: '#00E87A', text: '#F4F4F2' } },
    font_pairing: 'modern-mono',
    sample_sites: [],
  };
  const [brandKit, setBrandKit] = useState<BrandKit>(initialIntake?.brand_kit ?? defaultBrandKit);
  const [sampleSiteInput, setSampleSiteInput] = useState('');

  // Step 3 state
  const [assets, setAssets] = useState<AssetsData>(
    initialIntake?.assets ?? { logo_url: null, copy: '', tagline: null, extra_image_urls: [] }
  );
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);

  // Step 4 state
  const [domain, setDomain] = useState<DomainData>(
    initialIntake?.domain ?? { type: 'own', value: '' }
  );

  // Step 5 state
  const [orderRef, setOrderRef] = useState(initialIntake?.coconala_order_ref ?? '');
  const [uploadingOrder, setUploadingOrder] = useState(false);

  async function savePatch(patch: Record<string, unknown>) {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/coconala-onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || t(locale, 'Failed to save', '保存に失敗しました'));
        return false;
      }
      return true;
    } catch {
      setError(t(locale, 'Network error', 'ネットワークエラー'));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadFile(file: File, filename: string): Promise<string | null> {
    const path = `${profileId}/${filename}`;
    const { error: upErr } = await supabase.storage
      .from('client-assets')
      .upload(path, file, { upsert: true });
    if (upErr) {
      setError(upErr.message);
      return null;
    }
    const { data } = supabase.storage.from('client-assets').getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleStep1Next() {
    if (!scopeAck || !ownershipAck) return;
    const ok = await savePatch({
      scope_ack: true,
      commitment_ack_at: new Date().toISOString(),
      plan_tier: selectedPlanTier,
    });
    if (ok) setCurrentStep(2);
  }

  async function handleStep2Next() {
    if (brandKit.sample_sites.length < 1) {
      setError(t(locale, 'Add at least one sample website', 'サンプルサイトを1つ以上追加してください'));
      return;
    }
    const ok = await savePatch({ brand_kit: brandKit });
    if (ok) setCurrentStep(3);
  }

  async function handleStep3Next() {
    if (!assets.copy.trim()) {
      setError(t(locale, 'Brand description is required', 'ブランドの説明は必須です'));
      return;
    }
    const ok = await savePatch({ assets });
    if (ok) setCurrentStep(4);
  }

  async function handleStep4Next() {
    if (!domain.value.trim()) {
      setError(t(locale, 'Please provide a value', '値を入力してください'));
      return;
    }
    const ok = await savePatch({ domain });
    if (ok) setCurrentStep(5);
  }

  async function handleComplete() {
    if (!orderRef.trim()) {
      setError(t(locale, 'Order reference is required', '注文参照番号は必須です'));
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const saved = await fetch('/api/coconala-onboarding/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coconala_order_ref: orderRef }),
      });
      if (!saved.ok) {
        const j = await saved.json().catch(() => ({}));
        setError(j.error || t(locale, 'Failed to save', '保存に失敗しました'));
        return;
      }
      const done = await fetch('/api/coconala-onboarding/complete', { method: 'POST' });
      if (!done.ok) {
        const j = await done.json().catch(() => ({}));
        setError(j.error || t(locale, 'Failed to complete', '完了できませんでした'));
        return;
      }
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  function toggleVibeTag(tag: string) {
    setBrandKit((prev) => ({
      ...prev,
      vibe_tags: prev.vibe_tags.includes(tag)
        ? prev.vibe_tags.filter((x) => x !== tag)
        : [...prev.vibe_tags, tag],
    }));
  }

  function selectPreset(preset: typeof PRESET_PALETTES[number]) {
    setBrandKit((prev) => ({
      ...prev,
      palette: {
        preset: preset.id,
        colors: { bg: preset.bg, accent: preset.accent, text: preset.text },
      },
    }));
  }

  function updateCustomColor(key: 'bg' | 'accent' | 'text', value: string) {
    setBrandKit((prev) => ({
      ...prev,
      palette: {
        preset: 'custom',
        colors: { ...prev.palette.colors, [key]: value },
      },
    }));
  }

  function addSampleSite() {
    const v = sampleSiteInput.trim();
    if (!v) return;
    if (brandKit.sample_sites.includes(v)) return;
    setBrandKit((prev) => ({ ...prev, sample_sites: [...prev.sample_sites, v] }));
    setSampleSiteInput('');
  }

  function removeSampleSite(site: string) {
    setBrandKit((prev) => ({ ...prev, sample_sites: prev.sample_sites.filter((s) => s !== site) }));
  }

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    const ext = file.name.split('.').pop() || 'png';
    const url = await uploadFile(file, `logo.${ext}`);
    if (url) setAssets((prev) => ({ ...prev, logo_url: url }));
    setUploadingLogo(false);
  }

  async function handleExtraImagesUpload(files: FileList) {
    setUploadingExtra(true);
    const urls: string[] = [];
    for (let i = 0; i < Math.min(files.length, 3); i++) {
      const f = files[i];
      const ext = f.name.split('.').pop() || 'png';
      const url = await uploadFile(f, `extra-${Date.now()}-${i}.${ext}`);
      if (url) urls.push(url);
    }
    setAssets((prev) => ({
      ...prev,
      extra_image_urls: [...prev.extra_image_urls, ...urls].slice(0, 3),
    }));
    setUploadingExtra(false);
  }

  async function handleOrderScreenshot(file: File) {
    setUploadingOrder(true);
    const ext = file.name.split('.').pop() || 'png';
    await uploadFile(file, `order-screenshot.${ext}`);
    setUploadingOrder(false);
  }

  const progressPct = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
          {t(locale, `Step ${currentStep} of ${TOTAL_STEPS}`, `ステップ ${currentStep} / ${TOTAL_STEPS}`)}
        </p>
        <Progress value={progressPct} className="h-1 bg-[#1F2937]" />
      </div>


      {error && (
        <div className="mb-4 rounded border border-red-500/50 bg-red-500/10 p-3 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {currentStep === 1 && (
        <section>
          <h2 className="font-heading text-2xl md:text-3xl text-[#F4F4F2] mb-4">
            {t(locale, 'Scope & Commitment', 'スコープと契約')}
          </h2>
          <div className="bg-[#111827] border border-[#374151] rounded p-4 mb-6 max-h-96 overflow-auto">
            <pre className="text-[#F4F4F2] text-xs md:text-sm font-mono whitespace-pre-wrap">
              {scopeMd || t(locale, '(No scope provided)', '(スコープ未記入)')}
            </pre>
          </div>
          <div className="mb-6">
            <h3 className={labelClass}>{t(locale, 'Choose Your Plan', 'プランを選択')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                {
                  id: 'basic' as const,
                  nameEn: 'Basic',
                  nameJa: 'ベーシック',
                  price: '¥5,000 / mo',
                  featuresEn: ['1 small change/mo', 'Monthly analytics PDF', 'Hosting included'],
                  featuresJa: ['小変更1回/月', '月次PDFレポート', 'ホスティング込み'],
                },
                {
                  id: 'premium' as const,
                  nameEn: 'Premium',
                  nameJa: 'プレミアム',
                  price: '¥10,000 / mo',
                  featuresEn: ['2 small or 1 medium change/mo', 'Full-year dashboard', 'Quarterly audits', 'Hosting included'],
                  featuresJa: ['小変更2回 or 中変更1回/月', '年間ダッシュボード', '四半期監査', 'ホスティング込み'],
                },
              ]).map((plan) => {
                const selected = selectedPlanTier === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanTier(plan.id)}
                    className={`rounded border p-4 text-left transition-colors ${
                      selected ? 'border-[#00E87A] bg-[#00E87A]/5' : 'border-[#374151] hover:border-[#6B7280]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#F4F4F2] text-sm font-mono font-bold">
                        {t(locale, plan.nameEn, plan.nameJa)}
                      </span>
                      {selected && (
                        <span className="text-[#00E87A] text-[10px] font-mono uppercase tracking-widest">
                          {t(locale, 'Selected', '選択中')}
                        </span>
                      )}
                    </div>
                    <div className="text-[#00E87A] text-base font-mono font-bold mb-3">{plan.price}</div>
                    <ul className="space-y-1">
                      {(locale === 'ja' ? plan.featuresJa : plan.featuresEn).map((f) => (
                        <li key={f} className="text-[#6B7280] text-xs font-mono flex items-start gap-1.5">
                          <span className="text-[#00E87A] mt-0.5">—</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-start gap-3 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={scopeAck}
              onChange={(e) => setScopeAck(e.target.checked)}
              className="mt-1 accent-[#00E87A]"
            />
            <span className="text-[#F4F4F2] text-sm font-mono leading-relaxed">
              {t(
                locale,
                'I confirm the scope above and commit to the 6-month minimum subscription (¥5,000/mo Basic or ¥10,000/mo Premium). Early cancellation = remaining months or ¥80,000 buyout.',
                '上記のスコープを確認し、6ヶ月の最低契約期間(ベーシック¥5,000/月 または プレミアム¥10,000/月)に同意します。早期解約の場合は残月数分または¥80,000の買取。'
              )}
            </span>
          </label>
          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={ownershipAck}
              onChange={(e) => setOwnershipAck(e.target.checked)}
              className="mt-1 accent-[#00E87A]"
            />
            <span className="text-[#F4F4F2] text-sm font-mono leading-relaxed">
              {t(
                locale,
                'I understand ZeroEn retains code ownership unless I purchase a buyout.',
                '買取を購入しない限り、ZeroEnがコードの所有権を保持することを理解しています。'
              )}
            </span>
          </label>
          <Button
            onClick={handleStep1Next}
            disabled={!scopeAck || !ownershipAck || isSaving}
            className="bg-[#00E87A] text-[#0D0D0D] hover:bg-[#00E87A]/90 font-mono"
          >
            {t(locale, 'Continue', '次へ')}
          </Button>
        </section>
      )}

      {currentStep === 2 && (
        <section>
          <h2 className="font-heading text-2xl md:text-3xl text-[#F4F4F2] mb-4">
            {t(locale, 'Brand Kit Discovery', 'ブランドキット発見')}
          </h2>

          <div className="mb-8">
            <h3 className={labelClass}>{t(locale, 'Tone', 'トーン')}</h3>
            {([
              { key: 'playful', left: t(locale, 'Playful', '遊び心'), right: t(locale, 'Serious', '真面目') },
              { key: 'minimal', left: t(locale, 'Minimal', 'ミニマル'), right: t(locale, 'Bold', '大胆') },
              { key: 'corporate', left: t(locale, 'Corporate', '企業的'), right: t(locale, 'Indie', 'インディー') },
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
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="bg-transparent border-[#374151] text-[#F4F4F2] font-mono"
            >
              {t(locale, 'Back', '戻る')}
            </Button>
            <Button
              onClick={handleStep2Next}
              disabled={isSaving}
              className="bg-[#00E87A] text-[#0D0D0D] hover:bg-[#00E87A]/90 font-mono"
            >
              {t(locale, 'Continue', '次へ')}
            </Button>
          </div>
        </section>
      )}

      {currentStep === 3 && (
        <section>
          <h2 className="font-heading text-2xl md:text-3xl text-[#F4F4F2] mb-4">
            {t(locale, 'Assets', 'アセット')}
          </h2>

          <div className="mb-6">
            <label className={labelClass}>{t(locale, 'Logo', 'ロゴ')}</label>
            {assets.logo_url && (
              <div className="mb-2">
                <img src={assets.logo_url} alt="logo" className="max-h-24 rounded border border-[#374151]" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
              className="text-[#F4F4F2] text-xs font-mono"
              disabled={uploadingLogo}
            />
            {uploadingLogo && <p className="text-[#6B7280] text-xs font-mono mt-1">{t(locale, 'Uploading...', 'アップロード中...')}</p>}
          </div>

          <div className="mb-6">
            <label className={labelClass}>{t(locale, 'Brand Description', 'ブランド説明')}</label>
            <Textarea
              value={assets.copy}
              onChange={(e) => setAssets((prev) => ({ ...prev, copy: e.target.value }))}
              placeholder={t(locale, 'Describe your brand in 2-3 sentences', 'あなたのブランドを2〜3文で説明してください')}
              className={inputClass}
              rows={4}
            />
          </div>

          <div className="mb-6">
            <label className={labelClass}>{t(locale, 'Tagline (optional)', 'タグライン(任意)')}</label>
            <Input
              value={assets.tagline ?? ''}
              onChange={(e) => setAssets((prev) => ({ ...prev, tagline: e.target.value || null }))}
              className={inputClass}
            />
          </div>

          <div className="mb-6">
            <label className={labelClass}>{t(locale, 'Extra Images (up to 3)', '追加画像(最大3枚)')}</label>
            {assets.extra_image_urls.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {assets.extra_image_urls.map((url) => (
                  <img key={url} src={url} alt="" className="max-h-20 rounded border border-[#374151]" />
                ))}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleExtraImagesUpload(e.target.files)}
              className="text-[#F4F4F2] text-xs font-mono"
              disabled={uploadingExtra || assets.extra_image_urls.length >= 3}
            />
            {uploadingExtra && <p className="text-[#6B7280] text-xs font-mono mt-1">{t(locale, 'Uploading...', 'アップロード中...')}</p>}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="outline"
              className="bg-transparent border-[#374151] text-[#F4F4F2] font-mono"
            >
              {t(locale, 'Back', '戻る')}
            </Button>
            <Button
              onClick={handleStep3Next}
              disabled={isSaving}
              className="bg-[#00E87A] text-[#0D0D0D] hover:bg-[#00E87A]/90 font-mono"
            >
              {t(locale, 'Continue', '次へ')}
            </Button>
          </div>
        </section>
      )}

      {currentStep === 4 && (
        <section>
          <h2 className="font-heading text-2xl md:text-3xl text-[#F4F4F2] mb-4">
            {t(locale, 'Domain', 'ドメイン')}
          </h2>

          <div className="flex flex-col gap-2 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="domain-type"
                checked={domain.type === 'own'}
                onChange={() => setDomain({ type: 'own', value: '' })}
                className="accent-[#00E87A]"
              />
              <span className="text-[#F4F4F2] text-sm font-mono">
                {t(locale, 'I own a domain', 'ドメインを所有しています')}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="domain-type"
                checked={domain.type === 'help'}
                onChange={() => setDomain({ type: 'help', value: '' })}
                className="accent-[#00E87A]"
              />
              <span className="text-[#F4F4F2] text-sm font-mono">
                {t(locale, 'Help me choose one', 'ドメイン選びを手伝ってほしい')}
              </span>
            </label>
          </div>

          {domain.type === 'own' ? (
            <div className="mb-6">
              <label className={labelClass}>{t(locale, 'Domain name', 'ドメイン名')}</label>
              <Input
                value={domain.value}
                onChange={(e) => setDomain({ type: 'own', value: e.target.value })}
                placeholder="example.com"
                className={inputClass}
              />
            </div>
          ) : (
            <div className="mb-6">
              <label className={labelClass}>
                {t(locale, 'What domain names are you considering?', 'どのようなドメイン名を検討していますか?')}
              </label>
              <Textarea
                value={domain.value}
                onChange={(e) => setDomain({ type: 'help', value: e.target.value })}
                className={inputClass}
                rows={4}
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentStep(3)}
              variant="outline"
              className="bg-transparent border-[#374151] text-[#F4F4F2] font-mono"
            >
              {t(locale, 'Back', '戻る')}
            </Button>
            <Button
              onClick={handleStep4Next}
              disabled={isSaving}
              className="bg-[#00E87A] text-[#0D0D0D] hover:bg-[#00E87A]/90 font-mono"
            >
              {t(locale, 'Continue', '次へ')}
            </Button>
          </div>
        </section>
      )}

      {currentStep === 5 && (
        <section>
          <h2 className="font-heading text-2xl md:text-3xl text-[#F4F4F2] mb-4">
            {t(locale, 'Coconala Order Reference', 'ココナラ注文参照')}
          </h2>

          <div className="mb-6">
            <label className={labelClass}>{t(locale, 'Order # or transaction ID', '注文番号または取引ID')}</label>
            <Input
              value={orderRef}
              onChange={(e) => setOrderRef(e.target.value)}
              className={inputClass}
              placeholder="e.g. CO-123456"
            />
          </div>

          <div className="mb-6">
            <label className={labelClass}>{t(locale, 'Order screenshot (optional)', '注文スクリーンショット(任意)')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleOrderScreenshot(e.target.files[0])}
              className="text-[#F4F4F2] text-xs font-mono"
              disabled={uploadingOrder}
            />
            {uploadingOrder && <p className="text-[#6B7280] text-xs font-mono mt-1">{t(locale, 'Uploading...', 'アップロード中...')}</p>}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentStep(4)}
              variant="outline"
              className="bg-transparent border-[#374151] text-[#F4F4F2] font-mono"
            >
              {t(locale, 'Back', '戻る')}
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isSaving || !orderRef.trim()}
              className="bg-[#00E87A] text-[#0D0D0D] hover:bg-[#00E87A]/90 font-mono"
            >
              {isSaving ? t(locale, 'Completing...', '完了中...') : t(locale, 'Complete Onboarding', 'オンボーディング完了')}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
