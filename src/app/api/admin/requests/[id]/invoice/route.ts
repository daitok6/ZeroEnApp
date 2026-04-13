import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { getOrCreateStripeCustomer } from '@/lib/stripe/customer';
import { createAndFinalizeInvoice } from '@/lib/stripe/invoices';
import { z } from 'zod';
import { emitStateTask, invoiceVerifyTask } from '@/lib/tasks/state-change';
import { notifyRequestEvent } from '@/lib/email/request-notifications';

const PRODUCT_ENV_MAP: Record<string, string> = {
  small: 'STRIPE_PRODUCT_CHANGE_SMALL',
  medium: 'STRIPE_PRODUCT_CHANGE_MEDIUM',
  large: 'STRIPE_PRODUCT_CHANGE_LARGE',
  audit_security: 'STRIPE_PRODUCT_AUDIT_SECURITY',
  audit_seo: 'STRIPE_PRODUCT_AUDIT_SEO',
};

const bodySchema = z.object({
  amount_cents: z.number().int().min(0),
  description: z.string().min(1),
  due_date: z.string().nullable().optional(),
  /** Optional: links the Stripe invoice line item to a product for revenue reporting. */
  change_size: z.enum(['small', 'medium', 'large', 'audit_security', 'audit_seo']).optional(),
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
  const { data: activeInvoice } = await adminSupabase
    .from('invoices')
    .select('id')
    .eq('change_request_id', id)
    .not('status', 'in', '("declined","cancelled")')
    .maybeSingle();

  if (activeInvoice) {
    return NextResponse.json({ error: 'Invoice already exists for this request' }, { status: 409 });
  }

  // Check for an existing declined/cancelled invoice to UPDATE rather than INSERT
  // (the invoices table has a UNIQUE constraint on change_request_id)
  const { data: priorInvoice } = await adminSupabase
    .from('invoices')
    .select('id')
    .eq('change_request_id', id)
    .in('status', ['declined', 'cancelled'])
    .maybeSingle();

  // For ¥0 requests, skip Stripe entirely — but still require client acceptance
  // (status moves to 'quoted' and invoice is 'pending' so the client can accept or decline)
  if (body.amount_cents === 0) {
    const { error: statusErr } = await adminSupabase
      .from('change_requests')
      .update({ status: 'quoted' })
      .eq('id', id);

    if (statusErr) {
      console.error('status update error:', statusErr);
      return NextResponse.json({ error: 'Failed to update request status' }, { status: 500 });
    }

    const invoicePayload = {
      amount_cents: 0,
      currency: 'jpy',
      description: body.description,
      type: 'per_request',
      status: 'pending',
      paid_at: null,
      due_date: body.due_date ?? null,
      // Clear any stale Stripe fields from a prior declined invoice
      stripe_invoice_id: null,
      stripe_hosted_invoice_url: null,
      stripe_invoice_pdf_url: null,
      stripe_invoice_number: null,
    };

    let invoiceId: string;
    if (priorInvoice) {
      const { data: updated, error: invoiceError } = await adminSupabase
        .from('invoices')
        .update(invoicePayload)
        .eq('id', priorInvoice.id)
        .select('id')
        .single();
      if (invoiceError) {
        console.error('invoice update error:', invoiceError);
        return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
      }
      invoiceId = updated.id;
    } else {
      const { data: inserted, error: invoiceError } = await adminSupabase
        .from('invoices')
        .insert({
          project_id: changeRequest.project_id,
          client_id: changeRequest.client_id,
          change_request_id: id,
          ...invoicePayload,
        })
        .select('id')
        .single();
      if (invoiceError) {
        console.error('invoice insert error:', invoiceError);
        return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
      }
      invoiceId = inserted.id;
    }

    void notifyRequestEvent({
      event: 'invoice_sent',
      requestId: id,
      actorId: user.id,
      payload: { amountCents: 0, invoiceDescription: body.description },
    });

    return NextResponse.json({ success: true, invoiceId });
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

    const productId = body.change_size
      ? process.env[PRODUCT_ENV_MAP[body.change_size]]
      : undefined;

    stripeData = await createAndFinalizeInvoice({
      customerId,
      amountCents: body.amount_cents,
      currency: 'jpy',
      description: body.description,
      daysUntilDue,
      productId,
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

  // Persist invoice row — UPDATE if a prior declined/cancelled invoice exists (unique constraint on change_request_id)
  const stripeInvoicePayload = {
    stripe_invoice_id: stripeData.stripeInvoiceId,
    stripe_hosted_invoice_url: stripeData.stripeHostedInvoiceUrl,
    stripe_invoice_pdf_url: stripeData.stripeInvoicePdfUrl,
    stripe_invoice_number: stripeData.stripeInvoiceNumber,
    amount_cents: body.amount_cents,
    currency: 'jpy',
    description: body.description,
    type: 'per_request',
    status: 'pending',
    paid_at: null,
    due_date: body.due_date ?? null,
  };

  let invoice: { id: string } | null = null;
  let invoiceError: unknown = null;

  if (priorInvoice) {
    const { data, error } = await adminSupabase
      .from('invoices')
      .update(stripeInvoicePayload)
      .eq('id', priorInvoice.id)
      .select('id')
      .single();
    invoice = data;
    invoiceError = error;
  } else {
    const { data, error } = await adminSupabase
      .from('invoices')
      .insert({
        project_id: changeRequest.project_id,
        client_id: changeRequest.client_id,
        change_request_id: id,
        ...stripeInvoicePayload,
      })
      .select('id')
      .single();
    invoice = data;
    invoiceError = error;
  }

  if (invoiceError || !invoice) {
    console.error('invoice save error:', invoiceError);
    return NextResponse.json({ error: 'Failed to save invoice' }, { status: 500 });
  }

  await emitStateTask(invoiceVerifyTask(invoice.id, changeRequest.client_id, body.due_date ?? null, body.description));

  void notifyRequestEvent({
    event: 'invoice_sent',
    requestId: id,
    actorId: user.id,
    payload: { amountCents: body.amount_cents, invoiceDescription: body.description },
  });

  return NextResponse.json({
    success: true,
    invoiceId: invoice.id,
    hostedInvoiceUrl: stripeData.stripeHostedInvoiceUrl,
  });
}
