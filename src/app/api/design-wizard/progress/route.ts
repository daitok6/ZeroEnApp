import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    Array.isArray(body)
  ) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { step, data } = body as Record<string, unknown>;

  if (
    typeof step !== 'number' ||
    !Number.isInteger(step) ||
    step < 1 ||
    step > 5
  ) {
    return NextResponse.json(
      { error: 'step must be an integer between 1 and 5' },
      { status: 400 },
    );
  }

  if (
    typeof data !== 'object' ||
    data === null ||
    Array.isArray(data)
  ) {
    return NextResponse.json({ error: 'data must be a plain object' }, { status: 400 });
  }

  // Read current progress
  const { data: profile, error: readError } = await supabase
    .from('profiles')
    .select('onboarding_progress')
    .eq('id', user.id)
    .single();

  if (readError && readError.code !== 'PGRST116') {
    return NextResponse.json({ error: 'Failed to read profile' }, { status: 500 });
  }

  const currentProgress =
    (profile?.onboarding_progress as Record<string, unknown> | null) ?? {};

  const merged = {
    ...currentProgress,
    ...(data as Record<string, unknown>),
    current_step: step,
  };

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, onboarding_progress: merged });

  if (upsertError) {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
