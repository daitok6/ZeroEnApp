import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { BrandKit, AssetsData, DomainData } from '@/types/managed-client-intake';

export const metadata: Metadata = {
  title: 'Client Detail — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string; id: string }> };

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  onboarding: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  building: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  launched: 'bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/20',
  operating: 'bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/20',
  paused: 'bg-[#374151]/50 text-[#9CA3AF] border-[#374151]',
  terminated: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const PLAN_STYLES: Record<string, string> = {
  basic: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  premium: 'bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/20',
};

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Extract storage path from a Supabase public/signed URL for the client-assets bucket. */
function extractStoragePath(url: string | null): string | null {
  if (!url) return null;
  const marker = '/client-assets/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  // Strip any query string (signed URL token)
  return url.slice(idx + marker.length).split('?')[0];
}

async function resolveSignedUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  storedUrl: string | null
): Promise<string | null> {
  const path = extractStoragePath(storedUrl);
  if (!path) return storedUrl; // unchanged if not a client-assets URL
  const { data } = await supabase.storage
    .from('client-assets')
    .createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}

export default async function ManagedClientDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, source, onboarding_status, created_at, managed, managed_client_intake(*)')
    .eq('id', id)
    .single();

  if (error || !client || !client.managed) {
    notFound();
  }

  const intake = Array.isArray(client.managed_client_intake)
    ? client.managed_client_intake[0]
    : client.managed_client_intake;

  const brandKit = intake?.brand_kit as BrandKit | null;
  const assets = intake?.assets as AssetsData | null;
  const domain = intake?.domain as DomainData | null;

  // Resolve signed URLs for private bucket assets
  const [logoSignedUrl, ...extraSignedUrls] = await Promise.all([
    resolveSignedUrl(supabase, assets?.logo_url ?? null),
    ...(assets?.extra_image_urls ?? []).map((u) => resolveSignedUrl(supabase, u)),
  ]);

  // Try to sign order screenshot (stored at {profileId}/order-screenshot.*)
  const { data: screenshotFiles } = await supabase.storage
    .from('client-assets')
    .list(id, { search: 'order-screenshot' });
  const screenshotFile = screenshotFiles?.[0];
  const screenshotSignedUrl = screenshotFile
    ? (await supabase.storage.from('client-assets').createSignedUrl(`${id}/${screenshotFile.name}`, 3600)).data?.signedUrl ?? null
    : null;

  const status = client.onboarding_status ?? 'pending';

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Back link */}
      <Link
        href={`/${locale}/admin/managed-clients`}
        className="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#F4F4F2] font-mono text-sm transition-colors"
      >
        ← {locale === 'ja' ? '一覧に戻る' : 'Back to list'}
      </Link>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
              {client.full_name ?? '—'}
            </h1>
            <p className="text-[#6B7280] font-mono text-sm mt-0.5">{client.email}</p>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-bold shrink-0 ${STATUS_STYLES[status] ?? STATUS_STYLES.pending}`}>
            {status}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-mono text-[#6B7280]">
          <span>
            <span className="text-[#9CA3AF]">{locale === 'ja' ? '流入元' : 'source'}</span>
            {' '}
            <span className="text-[#F4F4F2] capitalize">{client.source ?? '—'}</span>
          </span>
          <span>
            <span className="text-[#9CA3AF]">{locale === 'ja' ? '登録日' : 'created'}</span>
            {' '}
            <span className="text-[#F4F4F2]">{formatDate(client.created_at, locale)}</span>
          </span>
          <span>
            <span className="text-[#9CA3AF]">id</span>
            {' '}
            <span className="text-[#F4F4F2]">{client.id}</span>
          </span>
        </div>
      </div>

      {/* ── Plan & Commitment ───────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-4">
        <h2 className="text-sm font-mono font-bold text-[#6B7280] uppercase tracking-widest">
          {locale === 'ja' ? 'プラン・コミットメント' : 'Plan & Commitment'}
        </h2>
        <div className="flex flex-wrap gap-4 text-sm font-mono">
          <div className="space-y-1">
            <p className="text-[#6B7280] text-xs">{locale === 'ja' ? 'プラン' : 'Plan tier'}</p>
            {intake?.plan_tier ? (
              <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-bold ${PLAN_STYLES[intake.plan_tier] ?? 'bg-[#374151]/50 text-[#9CA3AF] border-[#374151]'}`}>
                {intake.plan_tier}
              </span>
            ) : (
              <span className="text-[#6B7280]">—</span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-[#6B7280] text-xs">{locale === 'ja' ? 'スコープ同意' : 'Scope ack'}</p>
            <p className={`text-sm font-mono font-bold ${intake?.scope_ack ? 'text-[#00E87A]' : 'text-red-400'}`}>
              {intake?.scope_ack ? '✓ yes' : '✗ no'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[#6B7280] text-xs">{locale === 'ja' ? '6ヶ月コミット' : '6-month commitment'}</p>
            <p className="text-[#F4F4F2] text-sm font-mono">{formatDate(intake?.commitment_ack_at ?? null, locale)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[#6B7280] text-xs">{locale === 'ja' ? 'Coconala注文番号' : 'Coconala order ref'}</p>
            <p className="text-[#F4F4F2] text-sm font-mono">{intake?.coconala_order_ref ?? '—'}</p>
          </div>
        </div>
        {screenshotSignedUrl && (
          <div className="space-y-2">
            <p className="text-[#6B7280] text-xs font-mono">{locale === 'ja' ? '注文スクリーンショット' : 'Order screenshot'}</p>
            <a href={screenshotSignedUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src={screenshotSignedUrl}
                alt="Order screenshot"
                width={400}
                height={300}
                className="rounded border border-[#374151] object-contain max-h-48"
              />
            </a>
          </div>
        )}
      </section>

      {/* ── Brand Kit ──────────────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-5">
        <h2 className="text-sm font-mono font-bold text-[#6B7280] uppercase tracking-widest">
          {locale === 'ja' ? 'ブランドキット' : 'Brand Kit'}
        </h2>
        {!brandKit ? (
          <p className="text-[#6B7280] font-mono text-sm">{locale === 'ja' ? '未入力' : 'Not submitted yet'}</p>
        ) : (
          <>
            {/* Tone sliders */}
            <div className="space-y-3">
              <p className="text-[#6B7280] text-xs font-mono">{locale === 'ja' ? 'トーン' : 'Tone'}</p>
              {(['playful', 'minimal', 'corporate'] as const).map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#9CA3AF] w-20 capitalize">{key}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#374151] overflow-hidden">
                    <div
                      className="h-full bg-[#00E87A] rounded-full"
                      style={{ width: `${brandKit.tone[key]}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#6B7280] w-8 text-right">{brandKit.tone[key]}</span>
                </div>
              ))}
            </div>

            {/* Vibe tags */}
            {brandKit.vibe_tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-[#6B7280] text-xs font-mono">{locale === 'ja' ? 'バイブタグ' : 'Vibe tags'}</p>
                <div className="flex flex-wrap gap-2">
                  {brandKit.vibe_tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded border border-[#374151] bg-[#1F2937] text-[#F4F4F2] text-xs font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Palette */}
            <div className="space-y-2">
              <p className="text-[#6B7280] text-xs font-mono">
                {locale === 'ja' ? 'カラーパレット' : 'Palette'}
                {brandKit.palette.preset && (
                  <span className="ml-2 text-[#9CA3AF]">({brandKit.palette.preset})</span>
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                {(['bg', 'accent', 'text'] as const).map((role) => (
                  <div key={role} className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded border border-[#374151] shrink-0"
                      style={{ backgroundColor: brandKit.palette.colors[role] }}
                    />
                    <div>
                      <p className="text-[#6B7280] text-xs font-mono capitalize">{role}</p>
                      <p className="text-[#F4F4F2] text-xs font-mono">{brandKit.palette.colors[role]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Font pairing */}
            <div className="space-y-1">
              <p className="text-[#6B7280] text-xs font-mono">{locale === 'ja' ? 'フォント' : 'Font pairing'}</p>
              <p className="text-[#F4F4F2] font-mono text-sm">{brandKit.font_pairing || '—'}</p>
            </div>

            {/* Sample sites */}
            {brandKit.sample_sites.length > 0 && (
              <div className="space-y-2">
                <p className="text-[#6B7280] text-xs font-mono">{locale === 'ja' ? 'サンプルサイト' : 'Sample sites'}</p>
                <ul className="space-y-1">
                  {brandKit.sample_sites.map((url) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3B82F6] hover:text-[#60A5FA] font-mono text-xs break-all transition-colors"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Assets ─────────────────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-5">
        <h2 className="text-sm font-mono font-bold text-[#6B7280] uppercase tracking-widest">
          {locale === 'ja' ? 'アセット' : 'Assets'}
        </h2>
        {!assets ? (
          <p className="text-[#6B7280] font-mono text-sm">{locale === 'ja' ? '未入力' : 'Not submitted yet'}</p>
        ) : (
          <>
            {/* Logo */}
            <div className="space-y-2">
              <p className="text-[#6B7280] text-xs font-mono">{locale === 'ja' ? 'ロゴ' : 'Logo'}</p>
              {logoSignedUrl ? (
                <a href={logoSignedUrl} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={logoSignedUrl}
                    alt="Client logo"
                    width={200}
                    height={80}
                    className="rounded border border-[#374151] bg-[#1F2937] object-contain max-h-20"
                  />
                </a>
              ) : (
                <p className="text-[#6B7280] font-mono text-sm">—</p>
              )}
            </div>

            {/* Tagline */}
            <div className="space-y-1">
              <p className="text-[#6B7280] text-xs font-mono">{locale === 'ja' ? 'タグライン' : 'Tagline'}</p>
              <p className="text-[#F4F4F2] font-mono text-sm">{assets.tagline || '—'}</p>
            </div>

            {/* Copy / description */}
            <div className="space-y-1">
              <p className="text-[#6B7280] text-xs font-mono">{locale === 'ja' ? '説明文' : 'Description / copy'}</p>
              <p className="text-[#F4F4F2] font-mono text-sm whitespace-pre-wrap">{assets.copy || '—'}</p>
            </div>

            {/* Extra images */}
            {extraSignedUrls.filter(Boolean).length > 0 && (
              <div className="space-y-2">
                <p className="text-[#6B7280] text-xs font-mono">{locale === 'ja' ? '追加画像' : 'Extra images'}</p>
                <div className="flex flex-wrap gap-3">
                  {extraSignedUrls.map((url, i) =>
                    url ? (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={url}
                          alt={`Extra image ${i + 1}`}
                          width={160}
                          height={120}
                          className="rounded border border-[#374151] bg-[#1F2937] object-cover w-40 h-28"
                        />
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Domain ─────────────────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-3">
        <h2 className="text-sm font-mono font-bold text-[#6B7280] uppercase tracking-widest">
          {locale === 'ja' ? 'ドメイン' : 'Domain'}
        </h2>
        {!domain ? (
          <p className="text-[#6B7280] font-mono text-sm">{locale === 'ja' ? '未入力' : 'Not submitted yet'}</p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-bold ${domain.type === 'own' ? 'bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/20' : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'}`}>
                {domain.type === 'own'
                  ? (locale === 'ja' ? '自分で取得済み' : 'owns domain')
                  : (locale === 'ja' ? '取得サポートが必要' : 'needs help')}
              </span>
              <span className="text-[#F4F4F2] font-mono text-sm">{domain.value || '—'}</span>
            </div>
            {domain.type === 'help' && (
              <p className="text-[#F59E0B] font-mono text-xs">
                {locale === 'ja'
                  ? 'このクライアントはドメイン取得のサポートが必要です。'
                  : 'Action required: client needs help acquiring this domain.'}
              </p>
            )}
          </div>
        )}
      </section>

      {/* ── Raw JSON (debug) ────────────────────────────────────── */}
      <details className="border border-[#374151] rounded-lg bg-[#111827] overflow-hidden">
        <summary className="px-4 py-3 text-xs font-mono text-[#6B7280] cursor-pointer hover:text-[#9CA3AF] transition-colors select-none">
          {locale === 'ja' ? '生データ（デバッグ用）' : 'Raw intake JSON (debug)'}
        </summary>
        <pre className="px-4 pb-4 text-xs font-mono text-[#9CA3AF] overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(intake, null, 2)}
        </pre>
      </details>

    </div>
  );
}
