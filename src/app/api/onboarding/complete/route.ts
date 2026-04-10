import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { step1Schema, step2Schema, step3Schema, step4Schema } from '@/lib/validations/onboarding';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  if (profile?.status !== 'onboarding') {
    return NextResponse.json({ error: 'Not in onboarding status' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Validate all four steps
  const step1 = step1Schema.safeParse(body);
  const step2 = step2Schema.safeParse(body);
  const step3 = step3Schema.safeParse(body);
  const step4 = step4Schema.safeParse(body);

  if (!step1.success || !step2.success || !step3.success || !step4.success) {
    return NextResponse.json({ error: 'Invalid onboarding data' }, { status: 422 });
  }

  const { app_name, app_description, target_launch_date } = step1.data;
  const { auth_method, key_features, integrations, design_references } = step2.data;
  const { entity_name } = step3.data;
  const { timezone, preferred_channel } = step4.data;

  const typedBody = body as Record<string, unknown>;
  const application_id = typeof typedBody.application_id === 'string' ? typedBody.application_id : null;

  const onboarding_data = {
    target_launch_date: target_launch_date ?? null,
    auth_method,
    key_features,
    integrations: integrations ?? null,
    design_references: design_references ?? null,
    entity_name: entity_name ?? null,
    terms_accepted_at: new Date().toISOString(),
    timezone,
    preferred_channel,
  };

  const { data: projectId, error } = await supabase.rpc('complete_onboarding', {
    p_application_id: application_id,
    p_name: app_name,
    p_description: app_description,
    p_onboarding_data: onboarding_data,
  });

  if (error) {
    console.error('complete_onboarding RPC error:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
  }

  return NextResponse.json({ success: true, project_id: projectId });
}
