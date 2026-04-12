import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type IntakePatch = {
  scope_ack?: boolean;
  commitment_ack_at?: string | null;
  ownership_ack?: boolean;
  brand_kit?: Record<string, unknown> | null;
  assets?: Record<string, unknown> | null;
  domain?: Record<string, unknown> | null;
  coconala_order_ref?: string | null;
  plan_tier?: string | null;
};

const ALLOWED_KEYS: (keyof IntakePatch)[] = [
  'scope_ack',
  'commitment_ack_at',
  'ownership_ack',
  'brand_kit',
  'assets',
  'domain',
  'coconala_order_ref',
  'plan_tier',
];

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (const key of ALLOWED_KEYS) {
    if (key in input) {
      patch[key] = input[key];
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  // Ensure managed+pending profiles transition to in_progress
  const { data: profile } = await supabase
    .from('profiles')
    .select('managed, onboarding_status')
    .eq('id', user.id)
    .single();

  if (!profile?.managed) {
    return NextResponse.json({ error: 'Not a managed client' }, { status: 403 });
  }

  const { error: updateErr } = await supabase
    .from('managed_client_intake')
    .update(patch)
    .eq('profile_id', user.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 400 });
  }

  if (profile.onboarding_status === 'pending') {
    await supabase
      .from('profiles')
      .update({ onboarding_status: 'in_progress' })
      .eq('id', user.id);
  }

  return NextResponse.json({ ok: true });
}
