import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

// TODO(migration): before production, run:
//   ALTER TABLE lp_inquiries ADD COLUMN company text;
//   ALTER TABLE lp_inquiries ADD COLUMN blurb text NOT NULL DEFAULT '';
//   ALTER TABLE lp_inquiries DROP COLUMN occupation;
//   ALTER TABLE lp_inquiries DROP COLUMN current_site_url;
//   ALTER TABLE lp_inquiries DROP COLUMN challenge;
const lpInquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email required'),
  company: z.string().max(200).optional(),
  blurb: z.string().min(1, 'Project description is required').max(1000),
  first_touch: z.string().optional(),
  attribution_meta: z.record(z.string(), z.unknown()).optional(),
  locale: z.enum(['en', 'ja']).default('en'),
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
        company: data.company || null,
        blurb: data.blurb,
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
        { error: 'Invalid form data', details: err.issues },
        { status: 400 }
      );
    }
    console.error('LP inquiry route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
