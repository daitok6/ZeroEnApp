import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from '@/lib/validations/design-wizard';

const completeSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);

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

  const parsed = completeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const {
    business_name,
    industry,
    location,
    tagline,
    entity_name,
    timezone,
    logo_url,
    primary_color,
    secondary_color,
    font_preference,
    target_audience,
    primary_cta,
    key_offerings,
    reference_urls,
    vibe_keywords,
    terms_accepted,
  } = parsed.data;

  // Ensure profile row exists (trigger may not have fired for this account)
  await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? '',
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    },
    { onConflict: 'id', ignoreDuplicates: true },
  );

  // Upsert into client_brand
  const { error: brandError } = await supabase.from('client_brand').upsert(
    {
      profile_id: user.id,
      business_name,
      industry,
      location: location ?? null,
      tagline: tagline ?? null,
      entity_name: entity_name ?? null,
      timezone,
      logo_url: logo_url || null,
      primary_color: primary_color || null,
      secondary_color: secondary_color || null,
      font_preference: font_preference ?? null,
      target_audience,
      primary_cta,
      key_offerings,
      reference_urls: reference_urls ?? [],
      vibe_keywords: vibe_keywords ?? [],
      terms_accepted_at: terms_accepted ? new Date().toISOString() : null,
    },
    { onConflict: 'profile_id' },
  );

  if (brandError) {
    console.error('[design-wizard/complete] brand upsert failed:', brandError.message, brandError.code);
    return NextResponse.json({ error: 'save_failed' }, { status: 500 });
  }

  // Update profile: mark complete, clear draft progress.
  // Uses a SECURITY DEFINER RPC to bypass the RLS policy that pins status to
  // its current value (users cannot self-transition via a direct UPDATE).
  const { error: profileError } = await supabase.rpc('complete_design_wizard');

  if (profileError) {
    console.error('[design-wizard/complete] profile update failed:', profileError.message);
    return NextResponse.json({ error: 'profile_update_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
