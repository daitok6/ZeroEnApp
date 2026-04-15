import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/audits/[id]/download
// Returns a short-lived signed URL for the authenticated client to download their audit PDF.
// RLS on the audits table ensures only Premium clients whose project owns the audit can read the row.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // RLS enforces: only Premium clients of the owning project can read this row.
  const { data: audit, error } = await supabase
    .from('audits')
    .select('id, storage_path, file_name')
    .eq('id', id)
    .single();

  if (error || !audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  // Mint a signed URL with the admin client (bucket is private).
  const admin = createAdminClient();
  const { data: signed, error: signErr } = await admin.storage
    .from('audits')
    .createSignedUrl(audit.storage_path, 60 * 5, { download: audit.file_name });

  if (signErr || !signed?.signedUrl) {
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl, { status: 307 });
}
