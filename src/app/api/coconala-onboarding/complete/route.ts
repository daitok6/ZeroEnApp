import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('managed')
    .eq('id', user.id)
    .single();

  if (!profile?.managed) {
    return NextResponse.json({ error: 'Not a managed client' }, { status: 403 });
  }

  const { data: intake } = await supabase
    .from('managed_client_intake')
    .select('scope_ack, commitment_ack_at')
    .eq('profile_id', user.id)
    .single();

  if (!intake?.scope_ack || !intake?.commitment_ack_at) {
    return NextResponse.json(
      { error: 'Scope and commitment acknowledgement required' },
      { status: 422 }
    );
  }

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ onboarding_status: 'complete' })
    .eq('id', user.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
