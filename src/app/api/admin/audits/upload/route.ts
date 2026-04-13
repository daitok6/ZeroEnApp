import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// POST /api/admin/audits/upload
// Multipart form: file (PDF), project_id, kind ('security'|'seo'), period ('YYYY-Q#')
// Operator-only. Uploads PDF to private "audits" bucket and inserts row.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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

  const form = await request.formData();
  const file = form.get('file');
  const projectId = form.get('project_id');
  const kind = form.get('kind');
  const period = form.get('period');
  const deliver = form.get('deliver') === 'true';

  if (
    !(file instanceof File) ||
    typeof projectId !== 'string' ||
    typeof kind !== 'string' ||
    typeof period !== 'string'
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!['security', 'seo'].includes(kind)) {
    return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
  }

  if (!/^\d{4}-Q[1-4]$/.test(period)) {
    return NextResponse.json({ error: 'Invalid period — expected YYYY-Q#' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify project exists and resolve client_id for path
  const { data: project } = await admin
    .from('projects')
    .select('id, client_id')
    .eq('id', projectId)
    .single();
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const storagePath = `${project.client_id}/${period}-${kind}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await admin.storage
    .from('audits')
    .upload(storagePath, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadErr) {
    return NextResponse.json({ error: `Upload failed: ${uploadErr.message}` }, { status: 500 });
  }

  // Upsert the audit row (unique on project_id + kind + period).
  const { data: audit, error: insertErr } = await admin
    .from('audits')
    .upsert(
      {
        project_id: projectId,
        kind,
        period,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        created_by: user.id,
        delivered_at: deliver ? new Date().toISOString() : null,
      },
      { onConflict: 'project_id,kind,period' }
    )
    .select('id')
    .single();

  if (insertErr) {
    return NextResponse.json({ error: `DB insert failed: ${insertErr.message}` }, { status: 500 });
  }

  return NextResponse.json({ id: audit.id, storage_path: storagePath });
}
