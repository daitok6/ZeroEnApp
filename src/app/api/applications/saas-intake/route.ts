import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { sendEmail, OPERATOR_EMAIL_ADDRESS } from '@/lib/email/send';

const saasIntakeSchema = z.object({
  name: z.string().min(1, 'Required'),
  business_type: z.enum(['coach', 'therapist', 'counselor', 'consultant', 'other']),
  current_site: z.string().url().optional().or(z.literal('')),
  goal: z.string().optional(),
  timeline: z.string().optional(),
  contact_email: z.string().email('Valid email required'),
  locale: z.enum(['en', 'ja']).default('ja'),
  attribution_source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = saasIntakeSchema.parse(body);

    const businessTypeLabels: Record<string, string> = {
      coach: 'Coach / コーチ',
      therapist: 'Therapist / セラピスト',
      counselor: 'Counselor / カウンセラー',
      consultant: 'Consultant / コンサルタント',
      other: 'Other / その他',
    };

    const html = `
<h2>New SaaS LP Intake — ZeroEn</h2>
<table cellpadding="8" style="border-collapse:collapse;font-family:monospace;font-size:14px;">
  <tr><td><strong>Name</strong></td><td>${data.name}</td></tr>
  <tr><td><strong>Business type</strong></td><td>${businessTypeLabels[data.business_type]}</td></tr>
  <tr><td><strong>Email</strong></td><td>${data.contact_email}</td></tr>
  <tr><td><strong>Current site</strong></td><td>${data.current_site || '—'}</td></tr>
  <tr><td><strong>Goal</strong></td><td>${data.goal || '—'}</td></tr>
  <tr><td><strong>Timeline</strong></td><td>${data.timeline || '—'}</td></tr>
  <tr><td><strong>Locale</strong></td><td>${data.locale}</td></tr>
  <tr><td><strong>Attribution</strong></td><td>${data.attribution_source || 'direct'}</td></tr>
  <tr><td><strong>Submitted at</strong></td><td>${new Date().toISOString()}</td></tr>
</table>
<p style="margin-top:16px;font-family:monospace;font-size:12px;color:#6B7280;">
  Reply to this email to contact the applicant directly.
</p>
    `.trim();

    await sendEmail({
      to: OPERATOR_EMAIL_ADDRESS,
      subject: `[ZeroEn] New LP intake — ${data.name} (${data.business_type})`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data', details: err.issues }, { status: 400 });
    }
    console.error('SaaS intake error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
