import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

const lpInquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email required'),
  occupation: z.enum(['coach', 'therapist', 'counselor', 'other']),
  current_site_url: z.string().url().optional().or(z.literal('')),
  challenge: z.string().min(1, 'Challenge is required').max(1000),
  first_touch: z.string().optional(),
  attribution_meta: z.record(z.string()).optional(),
  locale: z.enum(['en', 'ja']).default('ja'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = lpInquirySchema.parse(body);

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

    const { error } = await supabase
      .from('lp_inquiries')
      .insert([{
        name: data.name,
        email: data.email,
        occupation: data.occupation,
        current_site_url: data.current_site_url || null,
        challenge: data.challenge,
        first_touch: data.first_touch || null,
        attribution_meta: data.attribution_meta || null,
        locale: data.locale,
      }]);

    if (error) {
      console.error('LP inquiry insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: err.errors },
        { status: 400 }
      );
    }
    console.error('LP inquiry route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
