import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { getOrCreateStripeCustomer } from '@/lib/stripe/customer';
import { createAndFinalizeInvoice } from '@/lib/stripe/invoices';
import { emitStateTask, invoiceVerifyTask } from '@/lib/tasks/state-change';

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const OVERAGE_PRODUCT_MAP: Record<string, string | undefined> = {
  small: process.env.STRIPE_PRODUCT_CHANGE_SMALL,
  medium: process.env.STRIPE_PRODUCT_CHANGE_MEDIUM,
  large: process.env.STRIPE_PRODUCT_CHANGE_LARGE,
};

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/invoices/[id]/approve
 *
 * Approves a draft overage invoice (draft_status = 'pending_admin_approval').
 * Finalizes the invoice in Stripe and sends it to the client.
 */
export async function POST(_request: NextRequest, { params }: Params) {
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

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  const adminSupabase = getAdminSupabase();

  // Load the draft invoice
  const { data: invoice } = await adminSupabase
    .from('invoices')
    .select('id, project_id, client_id, amount_cents, currency, description, draft_status, overage_cycle_start, overage_cycle_end')
    .eq('id', id)
    .eq('draft_status', 'pending_admin_approval')
    .single();

  if (!invoice) {
    return NextResponse.json(
      { error: 'Invoice not found or not awaiting approval' },
      { status: 404 }
    );
  }

  // Infer overage tier from description for product linking (best-effort)
  const productId = Object.entries(OVERAGE_PRODUCT_MAP).find(([tier]) =>
    invoice.description.toLowerCase().includes(tier)
  )?.[1];

  let stripeData: Awaited<ReturnType<typeof createAndFinalizeInvoice>>;
  let customerId: string;

  try {
    customerId = await getOrCreateStripeCustomer(invoice.client_id, adminSupabase);

    stripeData = await createAndFinalizeInvoice({
      customerId,
      amountCents: invoice.amount_cents,
      currency: invoice.currency ?? 'jpy',
      description: invoice.description,
      daysUntilDue: 7,
      productId,
      metadata: {
        supabase_invoice_id: id,
        supabase_project_id: invoice.project_id,
        supabase_client_id: invoice.client_id,
        overage_cycle_start: invoice.overage_cycle_start ?? '',
        overage_cycle_end: invoice.overage_cycle_end ?? '',
      },
    });
  } catch (err) {
    console.error('Stripe invoice finalization error:', err);
    return NextResponse.json({ error: 'Failed to create Stripe invoice' }, { status: 500 });
  }

  // Update the DB row to reflect that it's now a real Stripe invoice
  const { error: updateErr } = await adminSupabase
    .from('invoices')
    .update({
      stripe_invoice_id: stripeData.stripeInvoiceId,
      stripe_hosted_invoice_url: stripeData.stripeHostedInvoiceUrl,
      stripe_invoice_pdf_url: stripeData.stripeInvoicePdfUrl,
      stripe_invoice_number: stripeData.stripeInvoiceNumber,
      status: 'pending',
      draft_status: 'approved',
    })
    .eq('id', id);

  if (updateErr) {
    console.error('Invoice update error after Stripe finalization:', updateErr);
    // Stripe invoice exists — log for manual reconciliation but don't 500
    return NextResponse.json({
      success: true,
      warning: 'Stripe invoice created but DB update failed — please check manually',
      stripeInvoiceId: stripeData.stripeInvoiceId,
    });
  }

  await emitStateTask(
    invoiceVerifyTask(id, invoice.client_id, null, invoice.description)
  );

  return NextResponse.json({
    success: true,
    invoiceId: id,
    hostedInvoiceUrl: stripeData.stripeHostedInvoiceUrl,
  });
}
