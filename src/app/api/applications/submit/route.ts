import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { sendEmail, OPERATOR_EMAIL_ADDRESS } from '@/lib/email/send';
import { newApplicationEmail } from '@/lib/email/templates';

const applicationSchema = z.object({
  // Step 0
  nda_accepted: z.literal(true),
  // Step 1
  idea_name: z.string().min(2, 'Required'),
  idea_description: z.string().min(20, 'Please provide more detail'),
  problem_solved: z.string().min(20, 'Please provide more detail'),
  // Step 2
  target_users: z.string().min(10, 'Required'),
  competitors: z.string().optional(),
  monetization_plan: z.string().min(10, 'Required'),
  // Step 3
  founder_name: z.string().min(2, 'Required'),
  founder_background: z.string().min(20, 'Required'),
  founder_commitment: z.enum(['full-time', 'part-time', 'side-project']),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  locale: z.enum(['en', 'ja']).default('en'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = applicationSchema.parse(body);

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

    // Require authenticated user — email comes from their account
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to submit an application.' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('applications')
      .insert([{
        ...data,
        founder_email: user.email,
        linkedin_url: data.linkedin_url || null,
        user_id: user.id,
      }]);

    if (error) {
      console.error('Supabase error:', error);
      // Don't expose DB errors to client
      return NextResponse.json(
        { error: 'Failed to submit application. Please try again.' },
        { status: 500 }
      );
    }

    const emailData = newApplicationEmail({
      founderName: data.founder_name,
      founderEmail: user.email!,
      ideaName: data.idea_name,
      ideaDescription: data.idea_description,
      targetUsers: data.target_users,
      monetization: data.monetization_plan,
      commitment: data.founder_commitment,
      locale: data.locale,
    });
    await sendEmail({ to: OPERATOR_EMAIL_ADDRESS, ...emailData });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data', details: err.issues }, { status: 400 });
    }
    console.error('Application submit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
