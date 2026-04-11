import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

  const { current_step, form_data } = body as { current_step: unknown; form_data: unknown };

  if (
    typeof current_step !== 'number' ||
    current_step < 1 ||
    current_step > 4 ||
    !Number.isInteger(current_step)
  ) {
    return NextResponse.json({ error: 'Invalid current_step' }, { status: 400 });
  }

  if (typeof form_data !== 'object' || form_data === null || Array.isArray(form_data)) {
    return NextResponse.json({ error: 'Invalid form_data' }, { status: 400 });
  }

  const { error } = await supabase.rpc('save_onboarding_progress', {
    p_data: {
      current_step,
      form_data,
      updated_at: new Date().toISOString(),
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
