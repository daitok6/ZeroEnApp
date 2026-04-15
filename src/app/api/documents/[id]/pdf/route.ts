import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the signed document — user can only access their own
  const { data: doc, error } = await supabase
    .from('signed_documents')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  // Build plain text content (client can print/save as PDF from browser)
  const signedDate = new Date(doc.signed_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const content = [
    '================================================================',
    'ZEROEN — SIGNED DOCUMENT RECORD',
    '================================================================',
    '',
    `Document Type:   ${doc.document_type === 'nda' ? 'Mutual Non-Disclosure Agreement' : 'Partnership Agreement'}`,
    `Document Version: ${doc.document_version}`,
    `Document SHA-256: ${doc.document_sha256}`,
    '',
    `Signed By:       ${doc.signature_name}`,
    `Signed At:       ${signedDate}`,
    `IP Address:      ${doc.ip_address ?? 'unknown'}`,
    `User Agent:      ${doc.user_agent ?? 'unknown'}`,
    `Locale:          ${doc.locale}`,
    '',
    '================================================================',
    'AGREEMENT TEXT',
    '================================================================',
    '',
    doc.document_body,
    '',
    '================================================================',
    'END OF SIGNED DOCUMENT',
    '================================================================',
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="zeroen-${doc.document_type}-${doc.document_version}.txt"`,
    },
  });
}
