/**
 * Project proxy (middleware in pre-Next-16 terms).
 *
 * Two responsibilities, in order:
 *   1. Admin auth gate for /admin/* — unauthenticated users are sent to
 *      /admin/login, and signed-in users hitting /admin/login are sent
 *      to /admin. Supabase session is refreshed on every request via
 *      updateSession so cookies stay fresh.
 *   2. next-intl locale routing for everything else (tr default,
 *      /en/* for English).
 */
import {NextResponse, type NextRequest} from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import {routing} from './i18n/routing';
import {updateSession} from './lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // /admin/* is outside the locale tree — handle auth separately.
  if (pathname.startsWith('/admin')) {
    const initial = NextResponse.next({request});
    const {response, user} = await updateSession(request, initial);

    const onLoginPage = pathname === '/admin/login';

    if (!user && !onLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    if (user && onLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      url.search = '';
      return NextResponse.redirect(url);
    }

    return response;
  }

  // Everything else: locale routing.
  return intlMiddleware(request);
}

export const config = {
  // Skip api/_next/_vercel/static files; otherwise run on every request
  // including /admin (handled above) and locale routes (delegated to
  // next-intl).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
