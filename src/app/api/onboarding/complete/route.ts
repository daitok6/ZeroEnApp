import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { step1Schema, step2Schema, step3Schema, step4Schema, TERMS_VERSION } from '@/lib/validations/onboarding';
import { sendEmail, OPERATOR_EMAIL_ADDRESS } from '@/lib/email/send';
import { agreementConfirmationEmail } from '@/lib/email/templates';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status, full_name, email')
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
  const { entity_name, signature_name } = step3.data;
  const { timezone, preferred_channel } = step4.data;

  const typedBody = body as Record<string, unknown>;
  const application_id = typeof typedBody.application_id === 'string' ? typedBody.application_id : null;

  // Capture acceptance evidence
  const ipAddress =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';
  const acceptedAt = new Date().toISOString();

  const onboarding_data = {
    target_launch_date: target_launch_date ?? null,
    auth_method,
    key_features,
    integrations: integrations ?? null,
    design_references: design_references ?? null,
    entity_name: entity_name ?? null,
    signature_name,
    terms_version: TERMS_VERSION,
    terms_accepted_at: acceptedAt,
    ip_address: ipAddress,
    user_agent: userAgent,
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

  // Send confirmation emails (best-effort, don't block response)
  const founderName = profile?.full_name ?? signature_name;
  const founderEmail = profile?.email ?? user.email ?? '';

  const emailPayload = {
    founderName,
    founderEmail,
    signatureName: signature_name,
    entityName: entity_name ?? null,
    termsVersion: TERMS_VERSION,
    acceptedAt,
    ipAddress,
    userAgent,
  };

  Promise.all([
    sendEmail({
      to: founderEmail,
      ...agreementConfirmationEmail({ ...emailPayload, isOperatorCopy: false }),
    }),
    sendEmail({
      to: OPERATOR_EMAIL_ADDRESS,
      ...agreementConfirmationEmail({ ...emailPayload, isOperatorCopy: true }),
    }),
  ]).catch((err) => console.error('Agreement confirmation email error:', err));

  return NextResponse.json({ success: true, project_id: projectId });
}
