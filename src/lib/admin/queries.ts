import type { SupabaseClient } from '@supabase/supabase-js';

export type ClientHealthStatus = 'green' | 'yellow' | 'red';

export interface ClientRow {
  id: string;
  full_name: string | null;
  email: string;
  projectName: string | null;
  projectStatus: string | null;
  projectUpdatedAt: string | null;
  health: ClientHealthStatus;
}

export interface AdminStats {
  totalClients: number;
  activeProjects: number;
  pendingApplications: number;
  monthlyRevenueCents: number;
}

export async function getAdminStats(supabase: SupabaseClient): Promise<AdminStats> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { count: totalClients },
    { count: activeProjects },
    { count: pendingApplications },
    { data: revenueRows },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'client'),
    supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .in('status', ['building', 'launched', 'operating']),
    supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('invoices')
      .select('amount_cents')
      .eq('status', 'paid')
      .gte('paid_at', monthStart),
  ]);

  const monthlyRevenueCents = (revenueRows ?? []).reduce(
    (sum: number, row: { amount_cents: number }) => sum + (row.amount_cents ?? 0),
    0
  );

  return {
    totalClients: totalClients ?? 0,
    activeProjects: activeProjects ?? 0,
    pendingApplications: pendingApplications ?? 0,
    monthlyRevenueCents,
  };
}

function determineHealth(
  project: { status: string; created_at: string } | null,
  invoices: { status: string }[],
  milestones: { status: string; due_date: string | null }[]
): ClientHealthStatus {
  if (!project) return 'green';

  // Red: paused/terminated OR overdue invoice
  if (project.status === 'paused' || project.status === 'terminated') return 'red';
  if (invoices.some((inv) => inv.status === 'overdue')) return 'red';

  // Yellow: overdue pending milestone OR stuck in onboarding > 30 days
  const today = new Date().toISOString().split('T')[0];
  const hasOverdueMilestone = milestones.some(
    (m) => m.status === 'pending' && m.due_date !== null && m.due_date < today
  );
  if (hasOverdueMilestone) return 'yellow';

  if (project.status === 'onboarding') {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    if (project.created_at < thirtyDaysAgo) return 'yellow';
  }

  return 'green';
}

export async function getClientList(supabase: SupabaseClient): Promise<ClientRow[]> {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  if (!profiles || profiles.length === 0) return [];

  const rows = await Promise.all(
    profiles.map(async (profile: { id: string; email: string; full_name: string | null }) => {
      const { data: project } = await supabase
        .from('projects')
        .select('id, name, status, updated_at, created_at')
        .eq('client_id', profile.id)
        .single();

      const [invoicesResult, milestonesResult] = project
        ? await Promise.all([
            supabase.from('invoices').select('status').eq('client_id', profile.id),
            supabase.from('milestones').select('status, due_date').eq('project_id', project.id),
          ])
        : [{ data: [] }, { data: [] }];

      const health = determineHealth(
        project ?? null,
        invoicesResult.data ?? [],
        milestonesResult.data ?? []
      );

      return {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        projectName: project?.name ?? null,
        projectStatus: project?.status ?? null,
        projectUpdatedAt: project?.updated_at ?? null,
        health,
      };
    })
  );

  return rows;
}
