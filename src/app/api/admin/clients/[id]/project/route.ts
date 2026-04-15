import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email/send';
import { siteReadyEmail } from '@/lib/email/templates';
import { emitStateTask, draftScopeTask, scheduleFirstReportTask } from '@/lib/tasks/state-change';

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

  // Check if a project row exists for this client (also capture previous client_visible)
  const { data: existing } = await adminSupabase
    .from('projects')
    .select('id, client_visible')
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

  // Emit state-change tasks based on new project status
  const newStatus = updatedProject.status;
  if (newStatus === 'onboarding') {
    await emitStateTask(draftScopeTask(updatedProject.id, id, updatedProject.name));
  } else if (newStatus === 'launched' || newStatus === 'operating') {
    await emitStateTask(scheduleFirstReportTask(updatedProject.id, id, updatedProject.name));
  }

  // Fire site-ready email when client_visible flips from false → true
  const wasVisible = existing?.client_visible ?? false;
  const isNowVisible = updatedProject.client_visible === true;
  let emailResult: { sent: boolean; reason?: string } = { sent: false, reason: 'no-transition' };

  if (!wasVisible && isNowVisible) {
    const { data: clientProfile } = await adminSupabase
      .from('profiles')
      .select('email, full_name, locale')
      .eq('id', id)
      .single();

    if (!clientProfile?.email) {
      console.warn('[admin/project PATCH] site-ready email skipped: no email on profiles row', { clientId: id });
      emailResult = { sent: false, reason: 'no-client-email' };
    } else {
      const locale = (clientProfile.locale === 'ja' ? 'ja' : 'en') as 'en' | 'ja';
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zeroen.dev';
      const { subject, html } = siteReadyEmail({
        clientName: clientProfile.full_name ?? clientProfile.email,
        locale,
        loginUrl: `${siteUrl}/${locale}/login`,
      });
      const result = await sendEmail({ to: clientProfile.email, subject, html });
      if (result.ok) {
        console.log('[admin/project PATCH] site-ready email sent', { clientId: id, emailId: result.id });
        emailResult = { sent: true };
      } else {
        console.error('[admin/project PATCH] site-ready email failed', { clientId: id, reason: result.reason, error: result.error });
        emailResult = { sent: false, reason: result.reason };
      }
    }
  } else if (wasVisible && isNowVisible) {
    console.log('[admin/project PATCH] site-ready email skipped: already visible', { clientId: id });
  }

  return NextResponse.json({ project: updatedProject, email: emailResult });
}
