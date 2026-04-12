import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { getOrCreateStripeCustomer } from '@/lib/stripe/customer';
import { createAndFinalizeInvoice } from '@/lib/stripe/invoices';
import { z } from 'zod';

const bodySchema = z.object({
  amount_cents: z.number().int().min(0),
  description: z.string().min(1),
  due_date: z.string().nullable().optional(),
});

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

  const adminSupabase = getAdminSupabase();

  // Fetch the change request — include client source to guard Coconala clients
  const { data: changeRequest } = await adminSupabase
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

  // Guard against duplicate active invoices (allow re-quote after decline/cancellation)
  const { data: existingInvoice } = await adminSupabase
    .from('invoices')
    .select('id')
    .eq('change_request_id', id)
    .not('status', 'in', '("declined","cancelled")')
    .maybeSingle();

  if (existingInvoice) {
    return NextResponse.json({ error: 'Invoice already exists for this request' }, { status: 409 });
  }

  // For ¥0 requests, skip Stripe entirely — create invoice and approve immediately
  if (body.amount_cents === 0) {
    const { error: statusErr } = await adminSupabase
      .from('change_requests')
      .update({ status: 'approved' })
      .eq('id', id);

    if (statusErr) {
      console.error('status update error:', statusErr);
      return NextResponse.json({ error: 'Failed to update request status' }, { status: 500 });
    }

    const { data: invoice, error: invoiceError } = await adminSupabase
      .from('invoices')
      .insert({
        project_id: changeRequest.project_id,
        client_id: changeRequest.client_id,
        change_request_id: id,
        amount_cents: 0,
        currency: 'jpy',
        description: body.description,
        type: 'per_request',
        status: 'paid',
        paid_at: new Date().toISOString(),
        due_date: body.due_date ?? null,
      })
      .select('id')
      .single();

    if (invoiceError) {
      console.error('invoice insert error:', invoiceError);
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }

    return NextResponse.json({ success: true, invoiceId: invoice.id, autoApproved: true });
  }

  // Amount > 0 — create a real Stripe Invoice
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  let stripeData: Awaited<ReturnType<typeof createAndFinalizeInvoice>>;
  let customerId: string;

  try {
    customerId = await getOrCreateStripeCustomer(changeRequest.client_id, adminSupabase);

    // Calculate days_until_due from due_date if provided
    let daysUntilDue: number | undefined;
    if (body.due_date) {
      const msUntilDue = new Date(body.due_date).getTime() - Date.now();
      daysUntilDue = Math.max(1, Math.ceil(msUntilDue / (1000 * 60 * 60 * 24)));
    }

    stripeData = await createAndFinalizeInvoice({
      customerId,
      amountCents: body.amount_cents,
      currency: 'jpy',
      description: body.description,
      daysUntilDue,
      metadata: {
        change_request_id: id,
        supabase_project_id: changeRequest.project_id,
        supabase_client_id: changeRequest.client_id,
      },
    });
  } catch (err) {
    console.error('Stripe invoice creation error:', err);
    return NextResponse.json({ error: 'Failed to create Stripe invoice' }, { status: 500 });
  }

  // Update change request status to quoted
  const { error: statusErr } = await adminSupabase
    .from('change_requests')
    .update({ status: 'quoted' })
    .eq('id', id);

  if (statusErr) {
    console.error('status update error:', statusErr);
    // Don't fail — invoice exists in Stripe, store it anyway
  }

  // Persist invoice row
  const { data: invoice, error: invoiceError } = await adminSupabase
    .from('invoices')
    .insert({
      project_id: changeRequest.project_id,
      client_id: changeRequest.client_id,
      change_request_id: id,
      stripe_invoice_id: stripeData.stripeInvoiceId,
      stripe_hosted_invoice_url: stripeData.stripeHostedInvoiceUrl,
      stripe_invoice_pdf_url: stripeData.stripeInvoicePdfUrl,
      stripe_invoice_number: stripeData.stripeInvoiceNumber,
      amount_cents: body.amount_cents,
      currency: 'jpy',
      description: body.description,
      type: 'per_request',
      status: 'pending',
      due_date: body.due_date ?? null,
    })
    .select('id')
    .single();

  if (invoiceError) {
    console.error('invoice insert error:', invoiceError);
    return NextResponse.json({ error: 'Failed to save invoice' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    invoiceId: invoice.id,
    hostedInvoiceUrl: stripeData.stripeHostedInvoiceUrl,
  });
}
