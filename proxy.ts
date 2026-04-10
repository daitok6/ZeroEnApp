import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

async function getUserRole(supabase: SupabaseClient, userId: string): Promise<string> {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
  return data?.role ?? 'client';
}

export async function proxy(request: NextRequest) {
  // Run next-intl middleware first to handle locale routing
  const response = intlMiddleware(request);

  // Then handle Supabase auth cookie refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(/^\/(en|ja)/, '') || '/';
  const locale = pathname.startsWith('/ja') ? 'ja' : 'en';

  const isProtected =
    pathWithoutLocale.startsWith('/dashboard') ||
    pathWithoutLocale.startsWith('/admin');
  const isAuthPage =
    pathWithoutLocale === '/login' || pathWithoutLocale === '/signup';

  // Skip profile query entirely for marketing/public pages
  if (!isProtected && !isAuthPage) {
    return response;
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (isProtected) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }

    if (pathWithoutLocale.startsWith('/dashboard')) {
      const role = await getUserRole(supabase, user.id);
      if (role === 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/admin`;
        return NextResponse.redirect(url);
      }
    }

    if (pathWithoutLocale.startsWith('/admin')) {
      const role = await getUserRole(supabase, user.id);
      if (role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/dashboard`;
        return NextResponse.redirect(url);
      }
    }
  }

  if (isAuthPage && user) {
    const role = await getUserRole(supabase, user.id);
    const url = request.nextUrl.clone();
    url.pathname = role === 'admin' ? `/${locale}/admin` : `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
