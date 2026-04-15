import { createClient as createAdminClient } from '@supabase/supabase-js';
import { sendEmail, OPERATOR_EMAIL_ADDRESS } from './send';
import {
  requestCommentEmail,
  requestInvoiceSentEmail,
  requestInvoiceDeclinedEmail,
  requestInvoiceAcceptedEmail,
  requestCancelledEmail,
  requestStatusChangedEmail,
} from './templates';

export type RequestEventType =
  | 'comment'
  | 'invoice_sent'
  | 'invoice_declined'
  | 'invoice_accepted'
  | 'cancelled'
  | 'status_changed';

interface NotifyRequestEventOptions {
  event: RequestEventType;
  requestId: string;
  actorId: string;
  /** Optional extra context surfaced in the email body */
  payload?: {
    status?: string;
    invoiceDescription?: string;
    amountCents?: number;
    commentExcerpt?: string;
  };
}

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Fire-and-forget email notification for a change request event.
 * Always call with `void notifyRequestEvent(...)` so it doesn't block the API response.
 *
 * Actor side is never emailed — only the other party receives the notification.
 * If actor is the client, admin (operator) receives the email and vice-versa.
 */
export async function notifyRequestEvent({
  event,
  requestId,
  actorId,
  payload = {},
}: NotifyRequestEventOptions): Promise<void> {
  try {
    const adminSupabase = getAdminSupabase();

    // Load request + client profile in one round-trip
    const { data: req } = await adminSupabase
      .from('change_requests')
      .select('id, title, status, client_id')
      .eq('id', requestId)
      .single();

    if (!req) return;

    const { data: clientProfile } = await adminSupabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', req.client_id)
      .single();

    const clientEmail = clientProfile?.email ?? null;
    const clientName = clientProfile?.full_name ?? 'Client';

    const actorIsClient = actorId === req.client_id;

    // Determine recipient
    const recipientEmail: string | null = actorIsClient ? OPERATOR_EMAIL_ADDRESS : clientEmail;
    if (!recipientEmail) return;

    const dashUrl = actorIsClient
      ? `https://zeroen.dev/en/admin/requests`
      : `https://zeroen.dev/en/dashboard/requests`;

    const context = {
      requestId,
      requestTitle: req.title,
      clientName,
      dashUrl,
      ...payload,
    };

    let emailContent: { subject: string; html: string } | null = null;

    switch (event) {
      case 'comment':
        emailContent = requestCommentEmail(context);
        break;
      case 'invoice_sent':
        emailContent = requestInvoiceSentEmail(context);
        break;
      case 'invoice_declined':
        emailContent = requestInvoiceDeclinedEmail(context);
        break;
      case 'invoice_accepted':
        emailContent = requestInvoiceAcceptedEmail(context);
        break;
      case 'cancelled':
        emailContent = requestCancelledEmail(context);
        break;
      case 'status_changed':
        emailContent = requestStatusChangedEmail({ ...context, status: payload.status ?? req.status });
        break;
    }

    if (!emailContent) return;

    await sendEmail({ to: recipientEmail, ...emailContent });
  } catch (err) {
    // Non-fatal — never let email errors surface to callers
    console.error('[RequestNotify] Failed to send notification:', event, requestId, err);
  }
}
