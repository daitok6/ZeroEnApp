import { createAdminClient } from '@/lib/supabase/admin';
import type { Metadata } from 'next';
import { AuditUploadForm } from '@/components/admin/audit-upload-form';
import { AuditsList } from '@/components/admin/audits-list';

export const metadata: Metadata = {
  title: 'Audits — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

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

  // Build project_id → client_id lookup for linking audits to clients
  const projectClientMap = new Map(
    (premiumProjects ?? []).map((p) => [p.id, { clientId: p.client_id, clientName: profileMap.get(p.client_id)?.full_name ?? profileMap.get(p.client_id)?.email ?? null }])
  );

  const auditList = (audits ?? []).map((a) => {
    const clientInfo = projectClientMap.get(a.project_id);
    return { ...a, clientId: clientInfo?.clientId ?? null, clientName: clientInfo?.clientName ?? null };
  });

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

      <AuditsList audits={auditList} locale={locale} />
    </div>
  );
}
