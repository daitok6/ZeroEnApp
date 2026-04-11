import type { SupabaseClient } from '@supabase/supabase-js';

export interface RequestRow {
  id: string;
  title: string;
  description: string;
  tier: string | null;
  estimatedCostCents: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  clientName: string | null;
  clientEmail: string;
  projectId: string;
  projectName: string;
  invoiceId: string | null;
  invoicedAmountCents: number | null;
  commentCount: number;
}

export async function getAdminRequests(supabase: SupabaseClient): Promise<RequestRow[]> {
  const { data: requests } = await supabase
    .from('change_requests')
    .select('id, title, description, tier, estimated_cost_cents, status, created_at, updated_at, client_id, project_id')
    .order('created_at', { ascending: false });

  if (!requests || requests.length === 0) return [];

  const requestIds = requests.map((r: { id: string }) => r.id);
  const clientIds = [...new Set(requests.map((r: { client_id: string }) => r.client_id))];
  const projectIds = [...new Set(requests.map((r: { project_id: string }) => r.project_id))];

  const [profilesResult, projectsResult, invoicesResult, commentsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', clientIds),
    supabase
      .from('projects')
      .select('id, name')
      .in('id', projectIds),
    supabase
      .from('invoices')
      .select('id, change_request_id, amount_cents')
      .in('change_request_id', requestIds),
    supabase
      .from('request_comments')
      .select('change_request_id')
      .in('change_request_id', requestIds),
  ]);

  const profileMap = new Map<string, { full_name: string | null; email: string }>();
  for (const p of profilesResult.data ?? []) {
    profileMap.set(p.id, { full_name: p.full_name, email: p.email });
  }

  const projectMap = new Map<string, { name: string }>();
  for (const p of projectsResult.data ?? []) {
    projectMap.set(p.id, { name: p.name });
  }

  const invoiceMap = new Map<string, { id: string; amount_cents: number | null }>();
  for (const inv of invoicesResult.data ?? []) {
    if (inv.change_request_id) {
      invoiceMap.set(inv.change_request_id, { id: inv.id, amount_cents: inv.amount_cents });
    }
  }

  const commentCountMap = new Map<string, number>();
  for (const c of commentsResult.data ?? []) {
    commentCountMap.set(c.change_request_id, (commentCountMap.get(c.change_request_id) ?? 0) + 1);
  }

  return requests.map((r: {
    id: string; title: string; description: string; tier: string | null;
    estimated_cost_cents: number | null; status: string; created_at: string;
    updated_at: string; client_id: string; project_id: string;
  }) => {
    const profile = profileMap.get(r.client_id);
    const project = projectMap.get(r.project_id);
    const invoice = invoiceMap.get(r.id) ?? null;
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      tier: r.tier,
      estimatedCostCents: r.estimated_cost_cents,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      clientId: r.client_id,
      clientName: profile?.full_name ?? null,
      clientEmail: profile?.email ?? '',
      projectId: r.project_id,
      projectName: project?.name ?? '—',
      invoiceId: invoice?.id ?? null,
      invoicedAmountCents: invoice?.amount_cents ?? null,
      commentCount: commentCountMap.get(r.id) ?? 0,
    };
  });
}
