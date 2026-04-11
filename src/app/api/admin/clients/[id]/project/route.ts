import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

type Params = { params: Promise<{ id: string }> };

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const patchBodySchema = z.object({
  name: z.string().min(1).optional(),
  site_url: z.string().url().or(z.literal('')).optional(),
  github_repo: z.string().url().or(z.literal('')).optional(),
  vercel_project: z.string().url().or(z.literal('')).optional(),
  client_visible: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;

  // Auth check with cookie client
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Use service role client for writes (projects table has no RLS for authenticated users)
  const adminSupabase = getAdminSupabase();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = patchBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 });
  }

  const { client_visible, ...rest } = parsed.data;

  const updatePayload: Record<string, unknown> = { ...rest };

  // Coerce empty strings to null for URL fields
  if (updatePayload.site_url === '') updatePayload.site_url = null;
  if (updatePayload.github_repo === '') updatePayload.github_repo = null;
  if (updatePayload.vercel_project === '') updatePayload.vercel_project = null;

  if (client_visible !== undefined) {
    updatePayload.client_visible = client_visible;
    if (client_visible === true) {
      updatePayload.status = 'launched';
    } else {
      updatePayload.status = 'building';
    }
  }

  // Check if a project row exists for this client
  const { data: existing } = await adminSupabase
    .from('projects')
    .select('id')
    .eq('client_id', id)
    .maybeSingle();

  let updatedProject;

  if (existing) {
    // Update existing project
    const { data, error } = await adminSupabase
      .from('projects')
      .update(updatePayload)
      .eq('client_id', id)
      .select('id, name, status, site_url, github_repo, vercel_project, plan_tier, client_visible, commitment_starts_at, stripe_subscription_id, updated_at')
      .single();

    if (error) {
      console.error('project update error:', error);
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
    updatedProject = data;
  } else {
    // Insert new project row for this client
    const { data, error } = await adminSupabase
      .from('projects')
      .insert({ client_id: id, name: 'New Project', ...updatePayload, status: updatePayload.status ?? 'onboarding' })
      .select('id, name, status, site_url, github_repo, vercel_project, plan_tier, client_visible, commitment_starts_at, stripe_subscription_id, updated_at')
      .single();

    if (error) {
      console.error('project insert error:', error);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
    updatedProject = data;
  }

  return NextResponse.json({ project: updatedProject });
}
