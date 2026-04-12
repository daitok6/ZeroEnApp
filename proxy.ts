import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

async function getUserProfile(supabase: SupabaseClient, userId: string): Promise<{ role: string; status: string }> {
  const { data } = await supabase.from('profiles').select('role, status').eq('id', userId).single();
  // Default to 'client'/'pending' on DB failure — never grant admin access defensively
  return { role: data?.role ?? 'client', status: data?.status ?? 'pending' };
}

// Extract locale from pathname (e.g. '/ja/dashboard' → 'ja', '/en/admin' → 'en')
function extractLocale(pathname: string): string {
  const segment = pathname.split('/')[1];
  return (routing.locales as readonly string[]).includes(segment)
    ? segment
    : routing.defaultLocale;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip locale middleware for auth callback paths — next-intl would redirect
  // /auth/callback → /en/auth/callback, breaking the OAuth code exchange.
  // Both /auth/callback and /[locale]/auth/callback are valid (Supabase may use either).
  if (pathname === '/auth/callback' || /^\/[a-z]{2}\/auth\/callback$/.test(pathname)) {
    return NextResponse.next();
  }

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

  const localePrefix = new RegExp(`^\\/(${(routing.locales as readonly string[]).join('|')})`);
  const pathWithoutLocale = pathname.replace(localePrefix, '') || '/';
  const locale = extractLocale(pathname);

  const isProtected =
    pathWithoutLocale.startsWith('/dashboard') ||
    pathWithoutLocale.startsWith('/admin') ||
    pathWithoutLocale.startsWith('/coconala-onboarding');
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
      const profile = await getUserProfile(supabase, user.id);
      if (profile.role === 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/admin`;
        return NextResponse.redirect(url);
      }
      // Lock onboarding users — allow /dashboard (congrats modal shows there) and /dashboard/onboarding only
      if (profile.status === 'onboarding' && pathWithoutLocale !== '/dashboard' && !pathWithoutLocale.startsWith('/dashboard/onboarding')) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/dashboard/onboarding`;
        return NextResponse.redirect(url);
      }
    }

    if (pathWithoutLocale.startsWith('/admin')) {
      const profile = await getUserProfile(supabase, user.id);
      if (profile.role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/dashboard`;
        return NextResponse.redirect(url);
      }
    }
  }

  if (isAuthPage && user) {
    const profile = await getUserProfile(supabase, user.id);
    const url = request.nextUrl.clone();
    url.pathname = profile.role === 'admin' ? `/${locale}/admin` : `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
