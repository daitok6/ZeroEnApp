import { stripe } from '@/lib/stripe/client';

export interface CreateInvoiceOptions {
  customerId: string;
  amountCents: number; // JPY: integer yen (¥5,000 = 5000). USD: cents.
  currency: string;
  description: string;
  daysUntilDue?: number | null;
  metadata?: Record<string, string>;
}

export interface FinalizedInvoice {
  stripeInvoiceId: string;
  stripeInvoiceNumber: string | null;
  stripeHostedInvoiceUrl: string | null;
  stripeInvoicePdfUrl: string | null;
}

/**
 * Create, add a line item to, and finalize a Stripe Invoice.
 * Returns the finalized invoice details for storage.
 *
 * Note: JPY is zero-decimal — pass ¥5,000 as amountCents=5000, not 500000.
 */
export async function createAndFinalizeInvoice(
  options: CreateInvoiceOptions
): Promise<FinalizedInvoice> {
  if (!stripe) throw new Error('Stripe is not configured');

  const { customerId, amountCents, currency, description, daysUntilDue, metadata } = options;

  const draftInvoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: 'send_invoice',
    days_until_due: daysUntilDue ?? 7,
    currency,
    description,
    metadata: metadata ?? {},
  });

  await stripe.invoiceItems.create({
    customer: customerId,
    invoice: draftInvoice.id,
    amount: amountCents,
    currency,
    description,
  });

  const finalized = await stripe.invoices.finalizeInvoice(draftInvoice.id, {
    auto_advance: false,
  });

  return {
    stripeInvoiceId: finalized.id,
    stripeInvoiceNumber: finalized.number ?? null,
    stripeHostedInvoiceUrl: finalized.hosted_invoice_url ?? null,
    stripeInvoicePdfUrl: finalized.invoice_pdf ?? null,
  };
}

/**
 * Void a Stripe Invoice so its hosted URL no longer accepts payment.
 * Safe to call even if already voided — Stripe returns an error we silently ignore.
 */
export async function voidStripeInvoice(stripeInvoiceId: string): Promise<void> {
  if (!stripe) return;
  try {
    await stripe.invoices.voidInvoice(stripeInvoiceId);
  } catch (err: unknown) {
    // Stripe throws if invoice is already voided — not a fatal error
    const code = (err as { code?: string })?.code;
    if (code !== 'invoice_already_finalized' && code !== 'invoice_already_voided') {
      throw err;
    }
  }
}
