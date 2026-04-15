import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/invoices/[id]/reject
 *
 * Rejects a draft overage invoice (draft_status = 'pending_admin_approval').
 * Marks it cancelled — no Stripe invoice is created.
 */
export async function POST(_request: NextRequest, { params }: Params) {
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

  const adminSupabase = getAdminSupabase();

  const { error, count } = await adminSupabase
    .from('invoices')
    .update({ status: 'cancelled', draft_status: 'rejected' }, { count: 'exact' })
    .eq('id', id)
    .eq('draft_status', 'pending_admin_approval');

  if (error) {
    console.error('Invoice reject error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  if (count === 0) {
    return NextResponse.json(
      { error: 'Invoice not found or not awaiting approval' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
