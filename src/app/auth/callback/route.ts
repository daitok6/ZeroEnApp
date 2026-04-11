import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!userError && user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, locale, status')
          .eq('id', user.id)
          .single();

        const locale = profile?.locale ?? 'en';
        const role = profile?.role ?? 'client';
        const status = profile?.status ?? 'pending';

        const intent = cookieStore.get('zeroen_auth_intent')?.value;
        cookieStore.set('zeroen_auth_intent', '', { maxAge: 0, path: '/' });

        let destination: string;
        if (role === 'admin') {
          destination = `/${locale}/admin`;
        } else if (intent === 'apply') {
          destination = `/${locale}/dashboard/apply`;
        } else {
          // Onboarding users land on /dashboard — it shows the congrats modal (first visit)
          // or the resume banner (return visit) based on saved progress.
          destination = `/${locale}/dashboard`;
        }

        return NextResponse.redirect(`${origin}${destination}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/en/login?error=auth`);
}
