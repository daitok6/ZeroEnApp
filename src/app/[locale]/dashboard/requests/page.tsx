import { requireApproved } from '@/lib/auth/require-approved';
import { ChangeRequestForm } from '@/components/dashboard/change-request-form';
import { ChangeCatalogueSheet } from '@/components/dashboard/change-catalogue-sheet';
import { RequestCard } from '@/components/dashboard/request-card';
import { SubscriptionRequired } from '@/components/dashboard/subscription-required';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Requests — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function RequestsPage({ params }: Props) {
  const { locale } = await params;
  const { user, supabase } = await requireApproved(locale);

  const { data: project } = await supabase
    .from('projects')
    .select('id, client_visible, plan_tier')
    .eq('client_id', user.id)
    .single();

  if (project && project.client_visible && !project.plan_tier) {
    return <SubscriptionRequired locale={locale} />;
  }

  const requests = project
    ? (await supabase
        .from('change_requests')
        .select('id, title, description, status, tier, estimated_cost_cents, created_at')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })).data ?? []
    : [];

  // Fetch invoices linked to these requests
  const requestIds = requests.map((r) => r.id);

  const invoicesByRequestId = new Map<string, {
    id: string;
    amount_cents: number;
    description: string;
    due_date: string | null;
    currency: string;
    status: string;
  }>();

  if (requestIds.length > 0) {
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, change_request_id, amount_cents, description, due_date, currency, status')
      .in('change_request_id', requestIds)
      .eq('client_id', user.id);

    for (const inv of invoices ?? []) {
      if (inv.change_request_id) {
        invoicesByRequestId.set(inv.change_request_id, {
          id: inv.id,
          amount_cents: inv.amount_cents,
          description: inv.description,
          due_date: inv.due_date,
          currency: inv.currency,
          status: inv.status,
        });
      }
    }
  }

  const isJa = locale === 'ja';

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
          {isJa ? '変更リクエスト' : 'Change Requests'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {isJa
            ? 'スコープ外の機能追加を依頼する'
            : 'Request new features beyond your original scope'}
        </p>
      </div>

      <ChangeCatalogueSheet locale={locale} planTier={project?.plan_tier ?? null} />

      {project && (
        <ChangeRequestForm projectId={project.id} locale={locale} />
      )}

      {requests.length > 0 && (
        <div>
          <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-3">
            {isJa ? '過去のリクエスト' : 'Past Requests'}
          </p>
          <div className="space-y-3">
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                invoice={invoicesByRequestId.get(req.id) ?? null}
                locale={locale}
                userId={user.id}
              />
            ))}
          </div>
        </div>
      )}

      {!project && (
        <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
          <p className="text-[#9CA3AF] font-mono text-sm">
            {isJa
              ? 'プロジェクト開始後に変更リクエストが送れます'
              : 'Change requests are available once your project starts'}
          </p>
        </div>
      )}
    </div>
  );
}
