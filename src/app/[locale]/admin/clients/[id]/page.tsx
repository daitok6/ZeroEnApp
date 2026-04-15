import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getClientById, getClientBrand, type ClientBrand } from '@/lib/admin/queries';
import { ProjectSettingsForm } from '@/components/admin/project-settings-form';
import { ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Client Detail — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string; id: string }> };

const STATUS_STYLES: Record<string, string> = {
  onboarding: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  building: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  launched: 'bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/20',
  operating: 'bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/20',
  paused: 'bg-[#374151]/50 text-[#9CA3AF] border-[#374151]',
  terminated: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const INVOICE_STATUS_STYLES: Record<string, string> = {
  draft: 'text-[#6B7280] border-[#6B7280]/30',
  open: 'text-[#3B82F6] border-[#3B82F6]/30',
  paid: 'text-[#00E87A] border-[#00E87A]/30',
  overdue: 'text-red-400 border-red-400/30',
  void: 'text-[#374151] border-[#374151]/30',
};

const REQUEST_STATUS_STYLES: Record<string, string> = {
  submitted: 'text-[#3B82F6] border-[#3B82F6]/30',
  reviewing: 'text-[#F59E0B] border-[#F59E0B]/30',
  quoted: 'text-orange-400 border-orange-400/30',
  approved: 'text-[#00E87A] border-[#00E87A]/30',
  in_progress: 'text-[#00E87A] border-[#00E87A]/30',
  completed: 'text-[#6B7280] border-[#6B7280]/30',
  rejected: 'text-red-400 border-red-400/30',
};

const HEALTH_COLORS: Record<string, string> = {
  green: '#00E87A',
  yellow: '#F59E0B',
  red: '#EF4444',
};

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatJpy(cents: number): string {
  return `¥${Math.round(cents / 100).toLocaleString('ja-JP')}`;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xs font-mono font-bold text-[#6B7280] uppercase tracking-widest">
      {title}
    </h2>
  );
}

export default async function AdminClientDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const isJa = locale === 'ja';
  const supabase = await createClient();

  const [client, brand] = await Promise.all([
    getClientById(supabase, id),
    getClientBrand(supabase, id),
  ]);
  if (!client) notFound();

  const project = client.projects[0] ?? null;

  // Build a ClientRow-compatible shape for ProjectSettingsForm
  const clientRowForForm = {
    id: client.id,
    projectId: project?.id ?? null,
    projectName: project?.name ?? null,
    siteUrl: project?.siteUrl ?? null,
    githubRepo: project?.githubRepo ?? null,
    vercelProject: project?.vercelProject ?? null,
    clientVisible: project?.clientVisible ?? false,
    projectStatus: project?.status ?? null,
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Back link */}
      <Link
        href={`/${locale}/admin/clients`}
        className="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#F4F4F2] font-mono text-sm transition-colors"
      >
        ← {isJa ? '一覧に戻る' : 'Back to clients'}
      </Link>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
              {client.fullName ?? '—'}
            </h1>
            <p className="text-[#6B7280] font-mono text-sm mt-0.5">{client.email}</p>
          </div>
          <span
            className="inline-block w-2.5 h-2.5 rounded-full mt-2 shrink-0"
            style={{ backgroundColor: HEALTH_COLORS[client.health] }}
            title={client.health}
          />
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-mono text-[#6B7280]">
          {client.source && (
            <span>
              <span className="text-[#9CA3AF]">{isJa ? '流入元' : 'source'} </span>
              <span className="text-[#F4F4F2] capitalize">{client.source}</span>
            </span>
          )}
          <span>
            <span className="text-[#9CA3AF]">{isJa ? '登録日' : 'joined'} </span>
            <span className="text-[#F4F4F2]">{formatDate(client.createdAt, locale)}</span>
          </span>
          <span>
            <span className="text-[#9CA3AF]">id </span>
            <span className="text-[#F4F4F2]">{client.id}</span>
          </span>
        </div>
      </div>

      {/* ── Brand / Design Wizard ────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-5">
        <SectionHeader title={isJa ? 'ブランド / デザインウィザード' : 'Brand / Design Wizard'} />
        {!brand ? (
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? 'デザインウィザードの回答がまだありません。' : 'No design-wizard submission yet.'}
          </p>
        ) : (
          <div className="space-y-6">

            {/* Business */}
            <div>
              <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-widest mb-3">
                {isJa ? '事業' : 'Business'}
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm font-mono">
                {[
                  { label: isJa ? '屋号・社名' : 'Business name', value: brand.businessName },
                  { label: isJa ? '法人名' : 'Entity name', value: brand.entityName },
                  { label: isJa ? '業種' : 'Industry', value: brand.industry },
                  { label: isJa ? '所在地' : 'Location', value: brand.location },
                  { label: isJa ? 'タグライン' : 'Tagline', value: brand.tagline },
                  { label: isJa ? 'タイムゾーン' : 'Timezone', value: brand.timezone },
                ].map(({ label, value }) => value ? (
                  <div key={label}>
                    <dt className="text-[#6B7280] text-xs mb-0.5">{label}</dt>
                    <dd className="text-[#F4F4F2]">{value}</dd>
                  </div>
                ) : null)}
              </dl>
            </div>

            {/* Brand identity */}
            <div>
              <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-widest mb-3">
                {isJa ? 'ブランド' : 'Brand identity'}
              </p>
              <div className="space-y-3">
                {/* Logo */}
                {brand.logoUrl && (
                  <div>
                    <p className="text-[#6B7280] text-xs font-mono mb-1">{isJa ? 'ロゴ' : 'Logo'}</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logoUrl}
                      alt="Client logo"
                      className="h-16 w-auto object-contain rounded border border-[#374151] bg-[#0D0D0D] p-2"
                    />
                  </div>
                )}
                {/* Colours */}
                <div className="flex flex-wrap gap-4">
                  {brand.primaryColor && (
                    <div>
                      <p className="text-[#6B7280] text-xs font-mono mb-1">{isJa ? 'メインカラー' : 'Primary'}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-5 w-5 rounded border border-[#374151]" style={{ backgroundColor: brand.primaryColor }} />
                        <span className="text-[#F4F4F2] font-mono text-xs uppercase">{brand.primaryColor}</span>
                      </div>
                    </div>
                  )}
                  {brand.secondaryColor && (
                    <div>
                      <p className="text-[#6B7280] text-xs font-mono mb-1">{isJa ? 'サブカラー' : 'Secondary'}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-5 w-5 rounded border border-[#374151]" style={{ backgroundColor: brand.secondaryColor }} />
                        <span className="text-[#F4F4F2] font-mono text-xs uppercase">{brand.secondaryColor}</span>
                      </div>
                    </div>
                  )}
                </div>
                {/* Font */}
                {brand.fontPreference && (
                  <div>
                    <p className="text-[#6B7280] text-xs font-mono mb-1">{isJa ? 'フォント' : 'Font'}</p>
                    <p className="text-[#F4F4F2] font-mono text-sm">{brand.fontPreference}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Goals */}
            <div>
              <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-widest mb-3">
                {isJa ? 'サイトの目的' : 'Goals'}
              </p>
              <dl className="space-y-3 text-sm font-mono">
                {brand.targetAudience && (
                  <div>
                    <dt className="text-[#6B7280] text-xs mb-0.5">{isJa ? 'ターゲット' : 'Target audience'}</dt>
                    <dd className="text-[#F4F4F2]">{brand.targetAudience}</dd>
                  </div>
                )}
                {brand.primaryCta && (
                  <div>
                    <dt className="text-[#6B7280] text-xs mb-0.5">{isJa ? 'メインCTA' : 'Primary CTA'}</dt>
                    <dd className="text-[#F4F4F2]">{brand.primaryCta}</dd>
                  </div>
                )}
                {brand.keyOfferings.length > 0 && (
                  <div>
                    <dt className="text-[#6B7280] text-xs mb-1">{isJa ? '提供サービス' : 'Key offerings'}</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {brand.keyOfferings.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#1F2937] text-[#F4F4F2] text-xs font-mono">
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* References */}
            <div>
              <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-widest mb-3">
                {isJa ? '参考・雰囲気' : 'References & vibe'}
              </p>
              <div className="space-y-3 text-sm font-mono">
                {brand.vibeKeywords.length > 0 && (
                  <div>
                    <p className="text-[#6B7280] text-xs mb-1">{isJa ? 'キーワード' : 'Vibe keywords'}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {brand.vibeKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#00E87A]/10 text-[#00E87A] text-xs font-mono border border-[#00E87A]/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {brand.referenceUrls.length > 0 && (
                  <div>
                    <p className="text-[#6B7280] text-xs mb-1">{isJa ? '参考URL' : 'Reference URLs'}</p>
                    <ul className="space-y-1">
                      {brand.referenceUrls.map((url, i) => (
                        <li key={i}>
                          <a href={url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#3B82F6] hover:text-[#60A5FA] text-xs transition-colors break-all">
                            <ExternalLink size={10} /> {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {brand.termsAcceptedAt && (
                  <p className="text-[#6B7280] text-xs">
                    {isJa ? '利用規約同意日時: ' : 'Terms accepted: '}
                    <span className="text-[#9CA3AF]">{formatDate(brand.termsAcceptedAt, locale)}</span>
                  </p>
                )}
              </div>
            </div>

          </div>
        )}
      </section>

      {/* ── Project & Settings ─────────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionHeader title={isJa ? 'プロジェクト・設定' : 'Project & Settings'} />
          {project?.status && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${STATUS_STYLES[project.status] ?? STATUS_STYLES.paused}`}>
              {project.status}
            </span>
          )}
        </div>

        {/* Project links row */}
        {project && (
          <div className="flex flex-wrap gap-3">
            {project.siteUrl && (
              <a href={project.siteUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#3B82F6] hover:text-[#60A5FA] font-mono text-xs transition-colors">
                <ExternalLink size={11} /> {isJa ? 'サイトを開く' : 'Open site'}
              </a>
            )}
            {project.githubRepo && (
              <a href={project.githubRepo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#9CA3AF] font-mono text-xs transition-colors">
                <ExternalLink size={11} /> GitHub
              </a>
            )}
            {project.vercelProject && (
              <a href={project.vercelProject} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#9CA3AF] font-mono text-xs transition-colors">
                <ExternalLink size={11} /> Vercel
              </a>
            )}
          </div>
        )}

        <ProjectSettingsForm client={clientRowForForm} locale={locale} />
      </section>

      {/* ── Subscription & Billing ────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-4">
        <SectionHeader title={isJa ? 'サブスクリプション・請求' : 'Subscription & Billing'} />
        {!project ? (
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? 'プロジェクトがまだありません' : 'No project yet'}
          </p>
        ) : (
          <div className="flex flex-wrap gap-6 text-sm font-mono">
            <div className="space-y-1">
              <p className="text-[#6B7280] text-xs">{isJa ? 'プラン' : 'Plan'}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-bold ${
                project.planTier === 'premium'
                  ? 'bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/20'
                  : project.planTier === 'basic'
                  ? 'bg-[#374151]/50 text-[#9CA3AF] border-[#374151]'
                  : 'bg-[#374151]/30 text-[#6B7280] border-[#374151]'
              }`}>
                {project.planTier ?? (isJa ? '未設定' : 'unset')}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[#6B7280] text-xs">{isJa ? '6ヶ月コミット開始' : 'Commitment start'}</p>
              <p className="text-[#F4F4F2] text-sm">{formatDate(project.commitmentStartsAt, locale)}</p>
            </div>
            {project.stripeSubscriptionId && (
              <div className="space-y-1">
                <p className="text-[#6B7280] text-xs">{isJa ? 'Stripe サブスク ID' : 'Stripe subscription'}</p>
                <p className="text-[#9CA3AF] text-xs break-all">{project.stripeSubscriptionId}</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Invoices ─────────────────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-4">
        <SectionHeader title={isJa ? '請求書' : 'Invoices'} />
        {client.invoices.length === 0 ? (
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? '請求書はまだありません' : 'No invoices yet'}
          </p>
        ) : (
          <ul className="space-y-2">
            {client.invoices.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center gap-3 p-3 border border-[#374151] rounded-lg">
                <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${INVOICE_STATUS_STYLES[inv.status] ?? 'text-[#6B7280] border-[#6B7280]/30'}`}>
                  {inv.status}
                </span>
                <span className="text-[#F4F4F2] font-mono text-sm font-bold">
                  {formatJpy(inv.amountCents)}
                </span>
                <span className="text-[#6B7280] font-mono text-xs ml-auto">
                  {inv.paidAt
                    ? `${isJa ? '支払済' : 'paid'} ${formatDate(inv.paidAt, locale)}`
                    : inv.dueDate
                    ? `${isJa ? '期限' : 'due'} ${formatDate(inv.dueDate, locale)}`
                    : formatDate(inv.createdAt, locale)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Change Requests ───────────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <SectionHeader title={isJa ? '変更リクエスト' : 'Change Requests'} />
          <Link
            href={`/${locale}/admin/requests`}
            className="text-[#6B7280] hover:text-[#F4F4F2] font-mono text-xs transition-colors"
          >
            {isJa ? 'すべて表示 →' : 'View all →'}
          </Link>
        </div>
        {client.changeRequests.length === 0 ? (
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? '変更リクエストはありません' : 'No change requests'}
          </p>
        ) : (
          <ul className="space-y-2">
            {client.changeRequests.slice(0, 10).map((req) => (
              <li key={req.id} className="flex flex-wrap items-start gap-3 p-3 border border-[#374151] rounded-lg">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-[#F4F4F2] font-mono text-sm truncate">{req.title}</p>
                  <p className="text-[#6B7280] font-mono text-xs">{req.projectName}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {req.tier && (
                    <span className="text-[10px] font-mono border px-2 py-0.5 rounded text-[#9CA3AF] border-[#374151]">
                      {req.tier}
                    </span>
                  )}
                  <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${REQUEST_STATUS_STYLES[req.status] ?? 'text-[#6B7280] border-[#6B7280]/30'}`}>
                    {req.status}
                  </span>
                  <span className="text-[#374151] font-mono text-xs">
                    {formatDate(req.createdAt, locale)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Recent Messages ───────────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <SectionHeader title={isJa ? '最近のメッセージ' : 'Recent Messages'} />
          {project && (
            <Link
              href={`/${locale}/admin/messages?projectId=${project.id}`}
              className="text-[#6B7280] hover:text-[#F4F4F2] font-mono text-xs transition-colors"
            >
              {isJa ? 'チャットを開く →' : 'Open chat →'}
            </Link>
          )}
        </div>
        {client.recentMessages.length === 0 ? (
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? 'メッセージはまだありません' : 'No messages yet'}
          </p>
        ) : (
          <ul className="space-y-2">
            {client.recentMessages.slice(0, 10).map((msg) => (
              <li key={msg.id} className="flex flex-wrap items-start gap-3 p-3 border border-[#374151] rounded-lg">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-[#9CA3AF] font-mono text-xs truncate leading-relaxed">{msg.content}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {msg.senderRole && (
                    <span className={`text-[10px] font-mono ${msg.senderRole === 'admin' ? 'text-[#00E87A]' : 'text-[#6B7280]'}`}>
                      {msg.senderRole}
                    </span>
                  )}
                  <span className="text-[#374151] font-mono text-xs">
                    {formatDate(msg.createdAt, locale)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Audits ───────────────────────────────────────────────── */}
      <section className="border border-[#374151] rounded-lg bg-[#111827] p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <SectionHeader title={isJa ? '監査レポート' : 'Audits'} />
          <Link
            href={`/${locale}/admin/audits`}
            className="text-[#6B7280] hover:text-[#F4F4F2] font-mono text-xs transition-colors"
          >
            {isJa ? '監査を管理 →' : 'Manage audits →'}
          </Link>
        </div>
        {client.audits.length === 0 ? (
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? '監査レポートはまだありません' : 'No audits yet'}
          </p>
        ) : (
          <ul className="space-y-2">
            {client.audits.map((audit) => (
              <li key={audit.id} className="flex flex-wrap items-center gap-3 p-3 border border-[#374151] rounded-lg">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/30">
                  {audit.kind === 'security' ? (isJa ? 'セキュリティ' : 'Security') : 'SEO'}
                </span>
                <span className="text-[#F4F4F2] font-mono text-sm">{audit.period}</span>
                <span className="text-[#6B7280] font-mono text-xs truncate">{audit.fileName}</span>
                <span className="ml-auto font-mono text-xs text-[#6B7280]">
                  {formatDate(audit.createdAt, locale)}
                  {audit.deliveredAt && (
                    <span className="ml-2 text-[#00E87A]">
                      {isJa ? '· 配信済み' : '· delivered'}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}
