import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createEnvelope, getSigningUrl } from '@/lib/docusign/client';

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

  let body: { signerName: string; signerEmail: string; returnUrl: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { signerName, signerEmail, returnUrl } = body;
  if (!signerName || !signerEmail || !returnUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const { envelopeId } = await createEnvelope(signerEmail, signerName, user.id);
    const { signingUrl } = await getSigningUrl(envelopeId, signerEmail, signerName, user.id, returnUrl);
    return NextResponse.json({ envelopeId, signingUrl });
  } catch (err) {
    console.error('DocuSign envelope creation error:', err);
    return NextResponse.json({ error: 'Failed to create signing envelope' }, { status: 500 });
  }
}
