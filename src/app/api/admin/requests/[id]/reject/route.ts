import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { notifyRequestEvent } from '@/lib/email/request-notifications';

const bodySchema = z.object({
  comment: z.string().min(1, 'Rejection reason is required'),
});

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { comment: string };
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
  }

  const adminSupabase = getAdminSupabase();

  const { data: current, error: fetchError } = await adminSupabase
    .from('change_requests')
    .select('status, client_id')
    .eq('id', id)
    .single();

  if (fetchError || !current) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!['submitted', 'reviewing'].includes(current.status)) {
    return NextResponse.json({ error: 'Can only reject submitted or reviewing requests' }, { status: 422 });
  }

  // Insert rejection comment first
  const { error: commentError } = await adminSupabase
    .from('request_comments')
    .insert({
      change_request_id: id,
      author_id: user.id,
      content: body.comment,
    });

  if (commentError) {
    console.error('Failed to insert rejection comment:', commentError);
    return NextResponse.json({ error: 'Failed to save rejection reason' }, { status: 500 });
  }

  // Update status to rejected
  const { error: updateError } = await adminSupabase
    .from('change_requests')
    .update({ status: 'rejected' })
    .eq('id', id);

  if (updateError) {
    console.error('Failed to reject request:', updateError);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  void notifyRequestEvent({
    event: 'status_changed',
    requestId: id,
    actorId: user.id,
    payload: { status: 'rejected' },
  });

  return NextResponse.json({ success: true });
}
