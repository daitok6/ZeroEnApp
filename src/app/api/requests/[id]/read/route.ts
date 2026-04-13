import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/requests/[id]/read
 * Upserts a request_read_status row, marking this request as read for the current user.
 * Called client-side when a request card is expanded or an admin row is opened.
 */
export async function POST(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('request_read_status')
    .upsert(
      { user_id: user.id, change_request_id: id, last_read_at: new Date().toISOString() },
      { onConflict: 'user_id,change_request_id' }
    );

  if (error) {
    console.error('request read upsert error:', error);
    return NextResponse.json({ error: 'Failed to mark read' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
