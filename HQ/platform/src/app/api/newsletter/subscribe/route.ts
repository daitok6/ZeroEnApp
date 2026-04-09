import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Valid email required'),
  locale: z.enum(['en', 'ja']).default('en'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, locale } = subscribeSchema.parse(body);

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Insert subscriber (ignore duplicate email errors gracefully)
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, locale }]);

    if (error) {
      // Unique violation = already subscribed — treat as success
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      }
      console.error('Newsletter subscribe error:', error);
      return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
    }

    // Send welcome email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey !== 're_placeholder') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendKey);

        const subject = locale === 'ja'
          ? '[ZeroEn] ニュースレターへようこそ'
          : '[ZeroEn] Welcome to the newsletter';

        const htmlContent = locale === 'ja'
          ? `
            <div style="font-family: 'IBM Plex Mono', monospace; background: #0D0D0D; color: #F4F4F2; padding: 40px; max-width: 600px;">
              <h1 style="color: #00E87A; font-size: 24px; margin-bottom: 16px;">ZeroEn</h1>
              <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6;">登録ありがとうございます。</p>
              <p style="color: #F4F4F2; font-size: 14px; line-height: 1.6;">最新情報、ビルド記録、創業者向けのコンテンツをお届けします。</p>
              <p style="color: #6B7280; font-size: 12px; margin-top: 32px;">ZeroEn — アイデアを、形にする。</p>
            </div>
          `
          : `
            <div style="font-family: 'IBM Plex Mono', monospace; background: #0D0D0D; color: #F4F4F2; padding: 40px; max-width: 600px;">
              <h1 style="color: #00E87A; font-size: 24px; margin-bottom: 16px;">ZeroEn</h1>
              <p style="color: #9CA3AF; font-size: 14px; line-height: 1.6;">You're on the list.</p>
              <p style="color: #F4F4F2; font-size: 14px; line-height: 1.6;">We'll send updates on our builds, founder stories, and lessons from shipping MVPs for equity.</p>
              <p style="color: #6B7280; font-size: 12px; margin-top: 32px;">ZeroEn — Bring your idea to life.</p>
            </div>
          `;

        await resend.emails.send({
          from: 'ZeroEn <hello@zeroen.dev>',
          to: email,
          subject,
          html: htmlContent,
        });
      } catch (emailErr) {
        // Email failure is non-fatal — subscriber is saved
        console.error('Welcome email failed:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    console.error('Newsletter subscribe error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
