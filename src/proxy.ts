import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import type { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    // Match all paths except API routes, Next.js internals, static files, and metadata
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|feed.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|mp4|pdf)).*)',
  ],
};
