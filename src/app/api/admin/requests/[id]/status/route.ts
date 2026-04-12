import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { computeOverage } from '@/lib/billing/overage';

const bodySchema = z.object({
  status: z.enum(['reviewing', 'in_progress', 'completed']),
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

  let body: { status: string };
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const adminSupabase = getAdminSupabase();

  const { error, count } = await adminSupabase
    .from('change_requests')
    .update({ status: body.status }, { count: 'exact' })
    .eq('id', id);

  if (error) {
    console.error('status update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  if (count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // When a request is marked completed, check for plan overage and draft an invoice if needed
  if (body.status === 'completed') {
    await handleOverageCheck(id, adminSupabase);
  }

  return NextResponse.json({ success: true });
}

async function handleOverageCheck(
  requestId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminSupabase: SupabaseClient<any>
) {
  try {
    const { data: changeRequest } = await adminSupabase
      .from('change_requests')
      .select('project_id, client_id')
      .eq('id', requestId)
      .single();

    if (!changeRequest) return;

    const overage = await computeOverage(changeRequest.project_id, requestId, adminSupabase);
    if (!overage?.isOverage) return;

    const tierLabels: Record<string, string> = {
      small: '小規模変更 (Small Change)',
      medium: '中規模変更 (Medium Change)',
      large: '大規模変更 (Large Change)',
    };

    const description =
      `超過変更リクエスト: ${tierLabels[overage.tier] ?? overage.tier} — ` +
      `${overage.cycleStart} ～ ${overage.cycleEnd}`;

    const { error: insertErr } = await adminSupabase
      .from('invoices')
      .insert({
        project_id: changeRequest.project_id,
        client_id: changeRequest.client_id,
        overage_change_request_id: requestId,
        amount_cents: overage.amountCents,
        currency: 'jpy',
        description,
        type: 'per_request',
        status: 'draft',
        draft_status: 'pending_admin_approval',
        overage_cycle_start: overage.cycleStart,
        overage_cycle_end: overage.cycleEnd,
      });

    if (insertErr) {
      console.error('Overage invoice draft insert error:', insertErr);
    }
  } catch (err) {
    // Non-fatal — overage detection must never block the status update
    console.error('Overage check error:', err);
  }
}
