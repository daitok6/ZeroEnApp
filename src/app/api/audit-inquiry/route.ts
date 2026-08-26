import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email/send';

const AUDIT_INBOX = 'daito@zeroen.dev';

const auditInquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  company: z.string().min(1, 'Company is required').max(200),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  email: z.string().email('Valid email required'),
  monthlySpend: z.string().max(100).optional().or(z.literal('')),
  question: z.string().min(1, 'Please tell me what you want a second opinion on').max(2000),
  // Honeypot — real visitors never fill this in.
  website2: z.string().max(0).optional().or(z.literal('')),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = auditInquirySchema.parse(body);

    // Honeypot tripped — pretend success, do nothing.
    if (data.website2) {
      return NextResponse.json({ success: true });
    }

    const html = `
      <div style="font-family: 'IBM Plex Mono', monospace; background: #0D0D0D; color: #F4F4F2; padding: 32px; max-width: 600px;">
        <h1 style="color: #00E87A; font-size: 18px; margin: 0 0 20px;">New Meta Ads Audit inquiry</h1>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tbody>
            <tr><td style="padding: 6px 0; color: #9CA3AF; vertical-align: top; white-space: nowrap;">Name</td><td style="padding: 6px 0 6px 12px;">${escapeHtml(data.name)}</td></tr>
            <tr><td style="padding: 6px 0; color: #9CA3AF; vertical-align: top; white-space: nowrap;">Company</td><td style="padding: 6px 0 6px 12px;">${escapeHtml(data.company)}</td></tr>
            <tr><td style="padding: 6px 0; color: #9CA3AF; vertical-align: top; white-space: nowrap;">Website</td><td style="padding: 6px 0 6px 12px;">${data.website ? escapeHtml(data.website) : '—'}</td></tr>
            <tr><td style="padding: 6px 0; color: #9CA3AF; vertical-align: top; white-space: nowrap;">Email</td><td style="padding: 6px 0 6px 12px;">${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding: 6px 0; color: #9CA3AF; vertical-align: top; white-space: nowrap;">Monthly Meta spend</td><td style="padding: 6px 0 6px 12px;">${data.monthlySpend ? escapeHtml(data.monthlySpend) : 'Not provided'}</td></tr>
          </tbody>
        </table>
        <p style="color: #9CA3AF; font-size: 12px; margin: 20px 0 4px; text-transform: uppercase; letter-spacing: 0.08em;">What they want a second opinion on</p>
        <p style="color: #F4F4F2; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.question)}</p>
      </div>
    `;

    const result = await sendEmail({
      to: AUDIT_INBOX,
      subject: `Meta Ads Audit inquiry — ${data.company}`,
      html,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: 'email-unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: err.issues },
        { status: 400 }
      );
    }
    console.error('Audit inquiry route error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
