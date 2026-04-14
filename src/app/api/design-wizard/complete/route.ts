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
    return NextResponse.json({ error: 'Failed to save brand data' }, { status: 500 });
  }

  // Update profile: mark complete, clear draft progress
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      onboarding_status: 'complete',
      status: 'client',
      onboarding_progress: null,
    })
    .eq('id', user.id);

  if (profileError) {
    return NextResponse.json({ error: 'Failed to update profile status' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
