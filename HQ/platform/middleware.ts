import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
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

  const { data: { user } } = await supabase.auth.getUser();

  // Get the pathname without locale prefix for route protection
  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale = pathname.replace(/^\/(en|ja)/, '') || '/';

  // Protect dashboard routes
  if (!user && pathWithoutLocale.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    const locale = pathname.startsWith('/ja') ? 'ja' : 'en';
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from auth pages
  if (user && (pathWithoutLocale === '/login' || pathWithoutLocale === '/signup')) {
    const url = request.nextUrl.clone();
    const locale = pathname.startsWith('/ja') ? 'ja' : 'en';
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
