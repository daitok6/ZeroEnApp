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
  clientId: string;
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
      clientId: p.client_id,
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

// ─── Client Brand ─────────────────────────────────────────────────────────────

export interface ClientAsset {
  path: string;
  caption: string;
  content_type: string;
  size: number;
  signedUrl: string | null;
  downloadUrl: string | null;
}

export interface ClientBrand {
  profileId: string;
  businessName: string | null;
  industry: string | null;
  location: string | null;
  tagline: string | null;
  entityName: string | null;
  timezone: string | null;
  logoUrl: string | null;       // fresh signed URL for preview
  logoDownloadUrl: string | null; // fresh signed URL with download header
  primaryColor: string | null;
  secondaryColor: string | null;
  fontPreference: string | null;
  targetAudience: string | null;
  primaryCta: string | null;
  keyOfferings: string[];
  referenceUrls: string[];
  vibeKeywords: string[];
  termsAcceptedAt: string | null;
  assets: ClientAsset[];
  createdAt: string;
  updatedAt: string;
}

/** Extract the storage path from a Supabase signed URL.
 *  Signed URL format: https://<ref>.supabase.co/storage/v1/object/sign/<bucket>/<path>?token=...
 */
function extractStoragePath(signedUrl: string, bucket: string): string | null {
  try {
    const url = new URL(signedUrl);
    const marker = `/object/sign/${bucket}/`;
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return null;
    return url.pathname.slice(idx + marker.length);
  } catch {
    return null;
  }
}

export async function getClientBrand(
  supabase: SupabaseClient,
  profileId: string
): Promise<ClientBrand | null> {
  const { data } = await supabase
    .from('client_brand')
    .select('*')
    .eq('profile_id', profileId)
    .single();

  if (!data) return null;

  // Re-generate fresh signed URLs if a logo is stored
  let logoUrl: string | null = null;
  let logoDownloadUrl: string | null = null;
  if (data.logo_url) {
    const path = extractStoragePath(data.logo_url, 'brand-assets');
    if (path) {
      const [{ data: preview }, { data: download }] = await Promise.all([
        supabase.storage.from('brand-assets').createSignedUrl(path, 3600),
        supabase.storage.from('brand-assets').createSignedUrl(path, 3600, { download: true }),
      ]);
      logoUrl = preview?.signedUrl ?? null;
      logoDownloadUrl = download?.signedUrl ?? null;
    }
  }

  // Generate signed URLs for each asset
  const rawAssets: { path: string; caption: string; content_type: string; size: number }[] =
    Array.isArray(data.assets) ? data.assets : [];

  const assets: ClientAsset[] = await Promise.all(
    rawAssets.map(async (a) => {
      const [{ data: preview }, { data: download }] = await Promise.all([
        supabase.storage.from('brand-assets').createSignedUrl(a.path, 3600),
        supabase.storage.from('brand-assets').createSignedUrl(a.path, 3600, { download: true }),
      ]);
      return {
        path: a.path,
        caption: a.caption ?? '',
        content_type: a.content_type,
        size: a.size,
        signedUrl: preview?.signedUrl ?? null,
        downloadUrl: download?.signedUrl ?? null,
      };
    })
  );

  return {
    profileId: data.profile_id,
    businessName: data.business_name,
    industry: data.industry,
    location: data.location,
    tagline: data.tagline,
    entityName: data.entity_name,
    timezone: data.timezone,
    logoUrl,
    logoDownloadUrl,
    primaryColor: data.primary_color,
    secondaryColor: data.secondary_color,
    fontPreference: data.font_preference,
    targetAudience: data.target_audience,
    primaryCta: data.primary_cta,
    keyOfferings: data.key_offerings ?? [],
    referenceUrls: data.reference_urls ?? [],
    vibeKeywords: data.vibe_keywords ?? [],
    termsAcceptedAt: data.terms_accepted_at,
    assets,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// ─── Client Detail ────────────────────────────────────────────────────────────

export interface ClientProject {
  id: string;
  name: string;
  status: string;
  siteUrl: string | null;
  githubRepo: string | null;
  vercelProject: string | null;
  planTier: 'basic' | 'premium' | null;
  clientVisible: boolean;
  commitmentStartsAt: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientInvoice {
  id: string;
  projectId: string;
  amountCents: number;
  status: string;
  paidAt: string | null;
  dueDate: string | null;
  createdAt: string;
}

export interface ClientChangeRequest {
  id: string;
  title: string;
  description: string;
  tier: string | null;
  status: string;
  createdAt: string;
  projectId: string;
  projectName: string;
}

export interface ClientMessage {
  id: string;
  projectId: string;
  projectName: string;
  content: string;
  createdAt: string;
  senderRole: string | null;
}

export interface ClientAudit {
  id: string;
  projectId: string;
  kind: string;
  period: string;
  fileName: string;
  fileSize: number | null;
  deliveredAt: string | null;
  createdAt: string;
}

export interface ClientDetail {
  id: string;
  fullName: string | null;
  email: string;
  createdAt: string;
  source: string | null;
  health: ClientHealthStatus;
  projects: ClientProject[];
  invoices: ClientInvoice[];
  changeRequests: ClientChangeRequest[];
  recentMessages: ClientMessage[];
  audits: ClientAudit[];
}

export async function getClientById(
  supabase: SupabaseClient,
  id: string
): Promise<ClientDetail | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at, source')
    .eq('id', id)
    .eq('role', 'client')
    .single();

  if (!profile) return null;

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, status, site_url, github_repo, vercel_project, plan_tier, client_visible, commitment_starts_at, stripe_subscription_id, created_at, updated_at')
    .eq('client_id', id)
    .order('created_at', { ascending: false });

  const projectList = projects ?? [];
  const projectIds = projectList.map((p: { id: string }) => p.id);

  const [invoicesResult, requestsResult, messagesResult, auditsResult, projectsForNames] =
    await Promise.all([
      projectIds.length > 0
        ? supabase
            .from('invoices')
            .select('id, project_id, amount_cents, status, paid_at, due_date, created_at')
            .in('project_id', projectIds)
            .order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      supabase
        .from('change_requests')
        .select('id, title, description, tier, status, created_at, project_id')
        .eq('client_id', id)
        .order('created_at', { ascending: false })
        .limit(20),
      projectIds.length > 0
        ? supabase
            .from('messages')
            .select('id, project_id, content, created_at, sender_id, sender:profiles!messages_sender_id_fkey(role)')
            .in('project_id', projectIds)
            .order('created_at', { ascending: false })
            .limit(30)
        : Promise.resolve({ data: [] }),
      projectIds.length > 0
        ? supabase
            .from('audits')
            .select('id, project_id, kind, period, file_name, file_size, delivered_at, created_at')
            .in('project_id', projectIds)
            .order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      // Fetch project names for change requests (projects may differ from projectIds if requests reference archived ones)
      supabase
        .from('projects')
        .select('id, name')
        .eq('client_id', id),
    ]);

  const projectNameMap = new Map(
    (projectsForNames.data ?? []).map((p: { id: string; name: string }) => [p.id, p.name])
  );

  const mappedProjects: ClientProject[] = projectList.map((p: {
    id: string; name: string; status: string; site_url: string | null;
    github_repo: string | null; vercel_project: string | null;
    plan_tier: 'basic' | 'premium' | null; client_visible: boolean;
    commitment_starts_at: string | null; stripe_subscription_id: string | null;
    created_at: string; updated_at: string;
  }) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    siteUrl: p.site_url,
    githubRepo: p.github_repo,
    vercelProject: p.vercel_project,
    planTier: p.plan_tier,
    clientVisible: p.client_visible,
    commitmentStartsAt: p.commitment_starts_at,
    stripeSubscriptionId: p.stripe_subscription_id,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));

  const invoices: ClientInvoice[] = (invoicesResult.data ?? []).map((inv: {
    id: string; project_id: string; amount_cents: number; status: string;
    paid_at: string | null; due_date: string | null; created_at: string;
  }) => ({
    id: inv.id,
    projectId: inv.project_id,
    amountCents: inv.amount_cents,
    status: inv.status,
    paidAt: inv.paid_at,
    dueDate: inv.due_date,
    createdAt: inv.created_at,
  }));

  const changeRequests: ClientChangeRequest[] = (requestsResult.data ?? []).map((r: {
    id: string; title: string; description: string; tier: string | null;
    status: string; created_at: string; project_id: string;
  }) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    tier: r.tier,
    status: r.status,
    createdAt: r.created_at,
    projectId: r.project_id,
    projectName: projectNameMap.get(r.project_id) ?? r.project_id,
  }));

  const recentMessages: ClientMessage[] = (messagesResult.data ?? []).map((m: {
    id: string; project_id: string; content: string; created_at: string; sender_id: string;
    sender: { role: string } | { role: string }[] | null;
  }) => {
    const sender = Array.isArray(m.sender) ? m.sender[0] : m.sender;
    return {
      id: m.id,
      projectId: m.project_id,
      projectName: projectNameMap.get(m.project_id) ?? m.project_id,
      content: m.content,
      createdAt: m.created_at,
      senderRole: sender?.role ?? null,
    };
  });

  const audits: ClientAudit[] = (auditsResult.data ?? []).map((a: {
    id: string; project_id: string; kind: string; period: string;
    file_name: string; file_size: number | null; delivered_at: string | null; created_at: string;
  }) => ({
    id: a.id,
    projectId: a.project_id,
    kind: a.kind,
    period: a.period,
    fileName: a.file_name,
    fileSize: a.file_size,
    deliveredAt: a.delivered_at,
    createdAt: a.created_at,
  }));

  // Use overdue invoices to determine health
  const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue');
  const primaryProject = mappedProjects[0] ?? null;
  const health = determineHealth(
    primaryProject ? { status: primaryProject.status, created_at: primaryProject.createdAt } : null,
    profile.created_at,
    overdueInvoices.map(() => ({ status: 'overdue' }))
  );

  return {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    createdAt: profile.created_at,
    source: profile.source ?? null,
    health,
    projects: mappedProjects,
    invoices,
    changeRequests,
    recentMessages,
    audits,
  };
}
