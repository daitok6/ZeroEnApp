import { requireApproved } from '@/lib/auth/require-approved';
import { ChangeRequestForm } from '@/components/dashboard/change-request-form';
import { ChangeCatalogueSheet } from '@/components/dashboard/change-catalogue-sheet-client';
import { RequestCard } from '@/components/dashboard/request-card';
import { SubscriptionRequired } from '@/components/dashboard/subscription-required';
import { EmptyState } from '@/components/dashboard/empty-state';
import { getUnreadRequestCounts } from '@/lib/requests/unread';
import { PlusCircle } from 'lucide-react';
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

  const requestIds = requests.map((r) => r.id);

  // Fetch invoices, comment counts, and unread counts in parallel
  const [invoicesResult, commentsResult, unreadResult] = await Promise.all([
    requestIds.length > 0
      ? supabase
          .from('invoices')
          .select('id, change_request_id, amount_cents, description, due_date, currency, status')
          .in('change_request_id', requestIds)
          .eq('client_id', user.id)
      : Promise.resolve({ data: [] }),
    requestIds.length > 0
      ? supabase
          .from('request_comments')
          .select('change_request_id')
          .in('change_request_id', requestIds)
      : Promise.resolve({ data: [] }),
    requestIds.length > 0
      ? getUnreadRequestCounts(supabase, user.id, requestIds)
      : Promise.resolve({ total: 0, byRequest: {} as Record<string, number> }),
  ]);

  const unreadByRequest = unreadResult.byRequest;

  const invoicesByRequestId = new Map<string, {
    id: string;
    amount_cents: number;
    description: string;
    due_date: string | null;
    currency: string;
    status: string;
  }>();

  for (const inv of invoicesResult.data ?? []) {
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

  const commentCountMap = new Map<string, number>();
  for (const c of commentsResult.data ?? []) {
    commentCountMap.set(c.change_request_id, (commentCountMap.get(c.change_request_id) ?? 0) + 1);
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
                commentCount={commentCountMap.get(req.id) ?? 0}
                initialUnreadCount={unreadByRequest[req.id] ?? 0}
                locale={locale}
                userId={user.id}
              />
            ))}
          </div>
        </div>
      )}

      {project && requests.length === 0 && (
        <EmptyState
          icon={PlusCircle}
          locale={locale}
          titleEn="No requests yet"
          titleJa="リクエストはまだありません"
          bodyEn="Use the form above to request changes. Small (¥4,000), Medium (¥10,000), or Large (¥25,000+). Your plan includes a free monthly allowance."
          bodyJa="上のフォームから変更リクエストを送信できます。Small（¥4,000）・Medium（¥10,000）・Large（¥25,000+）。プランに応じた無料枠が毎月付与されます。"
          cta={{
            labelEn: "See what counts as small / medium / large →",
            labelJa: "変更サイズの定義を確認する →",
            href: `/${locale}/dashboard/help/requesting-changes`,
          }}
        />
      )}

      {!project && (
        <EmptyState
          icon={PlusCircle}
          locale={locale}
          titleEn="Not available yet"
          titleJa="まだご利用いただけません"
          bodyEn="Change requests become available once your project is set up and your subscription is active."
          bodyJa="変更リクエストはプロジェクトの設定とサブスクリプション開始後にご利用いただけます。"
        />
      )}
    </div>
  );
}
