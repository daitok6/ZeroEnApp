import { createAdminClient } from '@/lib/supabase/admin';
import type { Metadata } from 'next';
import { AuditUploadForm } from '@/components/admin/audit-upload-form';

export const metadata: Metadata = {
  title: 'Audits — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function AdminAuditsPage({ params }: Props) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const admin = createAdminClient();

  // Fetch Premium projects (for the upload dropdown) + recent audits in parallel
  const [{ data: premiumProjects }, { data: audits }] = await Promise.all([
    admin
      .from('projects')
      .select('id, client_id, site_url, plan_tier')
      .eq('plan_tier', 'premium'),
    admin
      .from('audits')
      .select('id, project_id, kind, period, file_name, file_size, delivered_at, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  const projectIds = [...new Set((premiumProjects ?? []).map((p) => p.client_id))];
  const { data: profiles } =
    projectIds.length > 0
      ? await admin.from('profiles').select('id, full_name, email').in('id', projectIds)
      : { data: [] };
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const projectOptions = (premiumProjects ?? []).map((p) => {
    const profile = profileMap.get(p.client_id);
    return {
      id: p.id,
      label: profile?.full_name ?? profile?.email ?? p.client_id,
      siteUrl: p.site_url as string | null,
    };
  });

  const auditList = audits ?? [];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-zen-off-white">
          {isJa ? '監査レポート' : 'Audits'}
        </h1>
        <p className="text-zen-subtle text-sm font-mono mt-1">
          {isJa
            ? 'Premiumクライアントの四半期監査PDFをアップロード'
            : 'Upload quarterly audit PDFs for Premium clients'}
        </p>
      </div>

      <AuditUploadForm locale={locale} projects={projectOptions} />

      <section className="space-y-3">
        <h2 className="text-zen-off-white text-sm font-mono font-bold uppercase tracking-widest">
          {isJa ? '最近のアップロード' : 'Recent uploads'}
        </h2>
        {auditList.length === 0 ? (
          <div className="border border-zen-border rounded-lg bg-zen-surface p-6 text-center">
            <p className="text-zen-subtle font-mono text-sm">
              {isJa ? 'アップロードされた監査はまだありません' : 'No audits uploaded yet'}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {auditList.map((a) => {
              const kindLabel =
                a.kind === 'security'
                  ? isJa
                    ? 'セキュリティ'
                    : 'Security'
                  : isJa
                    ? 'SEO'
                    : 'SEO';
              return (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 border border-zen-border rounded-lg bg-zen-surface p-3"
                >
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zen-green/10 text-zen-green border border-zen-green/30">
                    {kindLabel}
                  </span>
                  <span className="text-zen-off-white font-mono text-sm">{a.period}</span>
                  <span className="text-zen-subtle font-mono text-xs truncate">{a.file_name}</span>
                  <span className="ml-auto text-zen-subtle font-mono text-xs">
                    {formatDate(a.created_at, locale)}
                    {a.delivered_at && (
                      <span className="ml-2 text-zen-green">
                        {isJa ? '· 配信済み' : '· delivered'}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
