import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  amount_cents: z.number().int().min(0),
  description: z.string().min(1),
  due_date: z.string().nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Fetch the change request to get project_id and client_id
  const { data: changeRequest } = await supabase
    .from('change_requests')
    .select('id, project_id, client_id, status')
    .eq('id', id)
    .single();

  if (!changeRequest) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  if (changeRequest.status !== 'reviewing') {
    return NextResponse.json({ error: 'Request is not in reviewing status' }, { status: 400 });
  }

  // Guard against duplicate invoices
  const { data: existingInvoice } = await supabase
    .from('invoices')
    .select('id')
    .eq('change_request_id', id)
    .maybeSingle();

  if (existingInvoice) {
    return NextResponse.json({ error: 'Invoice already exists for this request' }, { status: 409 });
  }

  // Create invoice tied to the change request
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      project_id: changeRequest.project_id,
      client_id: changeRequest.client_id,
      change_request_id: id,
      amount_cents: body.amount_cents,
      currency: 'usd',
      description: body.description,
      type: 'per_request',
      status: 'pending',
      due_date: body.due_date ?? null,
    })
    .select('id')
    .single();

  if (invoiceError) {
    console.error('invoice insert error:', invoiceError);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }

  // Move request to quoted
  const { error: updateError } = await supabase
    .from('change_requests')
    .update({ status: 'quoted' })
    .eq('id', id);

  if (updateError) {
    console.error('status update error:', updateError);
    return NextResponse.json({ error: 'Failed to update request status' }, { status: 500 });
  }

  return NextResponse.json({ success: true, invoiceId: invoice.id });
}
