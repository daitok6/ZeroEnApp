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
  projectId: string | null;
  siteUrl: string | null;
  githubRepo: string | null;
  vercelProject: string | null;
  planTier: 'basic' | 'premium' | null;
  clientVisible: boolean;
  commitmentStartsAt: string | null;
  stripeSubscriptionId: string | null;
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
  profileCreatedAt: string,
  invoices: { status: string }[]
): ClientHealthStatus {
  if (!project) {
    // No project yet — yellow if profile is more than 30 days old (may be stuck pre-project)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    return profileCreatedAt < thirtyDaysAgo ? 'yellow' : 'green';
  }

  // Red: paused/terminated OR overdue invoice
  if (project.status === 'paused' || project.status === 'terminated') return 'red';
  if (invoices.some((inv) => inv.status === 'overdue')) return 'red';

  // Yellow: stuck in onboarding > 30 days
  if (project.status === 'onboarding') {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    if (project.created_at < thirtyDaysAgo) return 'yellow';
  }

  return 'green';
}

export interface ProjectConversation {
  id: string;
  name: string;
  status: string;
  clientName: string | null;
  clientEmail: string;
  lastMessageContent: string | null;
  lastMessageAt: string | null;
}

export async function getProjectsWithLatestMessage(supabase: SupabaseClient): Promise<ProjectConversation[]> {
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, status, client_id, client:profiles!projects_client_id_fkey(full_name, email)');

  if (!projects || projects.length === 0) return [];

  const projectIds = projects.map((p: { id: string }) => p.id);

  const { data: messages } = await supabase
    .from('messages')
    .select('project_id, content, created_at')
    .in('project_id', projectIds)
    .order('created_at', { ascending: false });

  // Build a map of most recent message per project
  const latestByProject = new Map<string, { content: string; created_at: string }>();
  for (const msg of messages ?? []) {
    if (!latestByProject.has(msg.project_id)) {
      latestByProject.set(msg.project_id, { content: msg.content, created_at: msg.created_at });
    }
  }

  const result: ProjectConversation[] = projects.map((p: {
    id: string;
    name: string;
    status: string;
    client_id: string;
    // Supabase returns foreign key joins as arrays at the type level
    client: { full_name: string | null; email: string }[] | { full_name: string | null; email: string } | null;
  }) => {
    const latest = latestByProject.get(p.id) ?? null;
    const clientRecord = Array.isArray(p.client) ? p.client[0] : p.client;
    return {
      id: p.id,
      name: p.name,
      status: p.status,
      clientName: clientRecord?.full_name ?? null,
      clientEmail: clientRecord?.email ?? '',
      lastMessageContent: latest?.content ?? null,
      lastMessageAt: latest?.created_at ?? null,
    };
  });

  // Sort: projects with messages first (most recent first), then projects without messages
  return result.sort((a, b) => {
    if (!a.lastMessageAt && !b.lastMessageAt) return 0;
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return b.lastMessageAt.localeCompare(a.lastMessageAt);
  });
}

export async function getClientList(supabase: SupabaseClient): Promise<ClientRow[]> {
  // Batch query 1: all client profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at')
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  if (!profiles || profiles.length === 0) return [];

  const clientIds = profiles.map((p: { id: string }) => p.id);

  // Batch query 2: all projects for those clients
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, status, updated_at, created_at, client_id, site_url, github_repo, vercel_project, plan_tier, client_visible, commitment_starts_at, stripe_subscription_id')
    .in('client_id', clientIds);

  const projectList = projects ?? [];
  const projectIds = projectList.map((p: { id: string }) => p.id);

  // Batch query 3: overdue invoices
  const invoicesResult = projectIds.length > 0
    ? await supabase
        .from('invoices')
        .select('project_id, status')
        .in('project_id', projectIds)
        .eq('status', 'overdue')
    : { data: [] };

  const invoiceList = invoicesResult.data ?? [];

  // Build lookup maps for O(1) join in memory
  const projectByClientId = new Map<
    string,
    {
      id: string;
      name: string;
      status: string;
      updated_at: string;
      created_at: string;
      client_id: string;
      site_url: string | null;
      github_repo: string | null;
      vercel_project: string | null;
      plan_tier: 'basic' | 'premium' | null;
      client_visible: boolean;
      commitment_starts_at: string | null;
      stripe_subscription_id: string | null;
    }
  >();
  for (const project of projectList) {
    projectByClientId.set(project.client_id, project);
  }

  const invoicesByProjectId = new Map<string, { project_id: string; status: string }[]>();
  for (const inv of invoiceList) {
    const existing = invoicesByProjectId.get(inv.project_id) ?? [];
    existing.push(inv);
    invoicesByProjectId.set(inv.project_id, existing);
  }

  // Join in memory to build ClientRow array
  return profiles.map(
    (profile: { id: string; email: string; full_name: string | null; created_at: string }) => {
      const project = projectByClientId.get(profile.id) ?? null;
      const invoices = project ? (invoicesByProjectId.get(project.id) ?? []) : [];

      const health = determineHealth(project, profile.created_at, invoices);

      return {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        projectName: project?.name ?? null,
        projectStatus: project?.status ?? null,
        projectUpdatedAt: project?.updated_at ?? null,
        health,
        projectId: project?.id ?? null,
        siteUrl: project?.site_url ?? null,
        githubRepo: project?.github_repo ?? null,
        vercelProject: project?.vercel_project ?? null,
        planTier: project?.plan_tier ?? null,
        clientVisible: project?.client_visible ?? false,
        commitmentStartsAt: project?.commitment_starts_at ?? null,
        stripeSubscriptionId: project?.stripe_subscription_id ?? null,
      };
    }
  );
}
