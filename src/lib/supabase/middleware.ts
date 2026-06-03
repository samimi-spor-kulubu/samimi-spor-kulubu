/**
 * Supabase session refresh for the Next.js proxy (middleware).
 *
 * `updateSession` is called from src/proxy.ts on every matched request.
 * It:
 *   1) reads cookies off the request,
 *   2) refreshes the Supabase auth session if needed,
 *   3) writes the refreshed cookies onto the outgoing response.
 *
 * Without this, server components can't see fresh auth state on the
 * next request after a sign-in/sign-out.
 *
 * Returns the (possibly updated) NextResponse so the caller can chain
 * additional logic (locale routing, admin redirects, etc.) without
 * losing the cookie writes.
 */
import {createServerClient} from '@supabase/ssr';
import {NextResponse, type NextRequest} from 'next/server';

import type {Database} from '@/types/database';

export async function updateSession(
  request: NextRequest,
  response: NextResponse
): Promise<{response: NextResponse; user: {id: string; email?: string} | null}> {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({name, value}) => {
            request.cookies.set(name, value);
          });
          cookiesToSet.forEach(({name, value, options}) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  // IMPORTANT: this call MUST happen between the cookie wiring above and
  // any subsequent response shaping below — it's what triggers a session
  // refresh (and the cookie writes in setAll).
  const {
    data: {user}
  } = await supabase.auth.getUser();

  return {
    response,
    user: user ? {id: user.id, email: user.email} : null
  };
}
