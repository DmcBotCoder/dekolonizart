import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale } from '@/i18n/config';

/**
 * Locale routing.
 * - `/de/...` and `/fr/...` are served as-is.
 * - `/en/...` permanently redirects to the unprefixed URL (English is the default).
 * - Everything else is rewritten internally to `/en/...`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/^\/(de|fr)(\/|$)/.test(pathname)) return NextResponse.next();

  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || '/';
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals and any path with a file extension (images, fonts, sitemap.xml, robots.txt…).
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
