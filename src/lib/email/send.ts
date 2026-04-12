import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL ?? 'hello@zeroen.dev';
const FROM_ADDRESS = 'ZeroEn <noreply@zeroen.dev>';

function getResend(): Resend | null {
  if (!RESEND_API_KEY || RESEND_API_KEY === 're_placeholder') return null;
  return new Resend(RESEND_API_KEY);
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string; // override FROM address (e.g. for noreply@zeroen.dev once domain is set up)
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log('[Email] Resend not configured — skipping:', subject);
    return;
  }

  try {
    await resend.emails.send({ from: from ?? FROM_ADDRESS, to, subject, html });
  } catch (err) {
    console.error('[Email] Failed to send:', subject, err);
    // Non-fatal — don't throw
  }
}

export const OPERATOR_EMAIL_ADDRESS = OPERATOR_EMAIL;
