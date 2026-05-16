/**
 * Server-side Supabase client for Next.js Server Components,
 * Route Handlers and Server Actions.
 *
 * Uses the publishable (anon) key + cookie-based session, so RLS still
 * applies. For admin / RLS-bypass work see `./admin.ts`.
 *
 * Note: `cookies()` is async in Next 16.
 */
import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';

import type {Database} from '@/types/database';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // setAll may be called from a Server Component, where setting
          // cookies isn't allowed. In that case `cookieStore.set` throws —
          // swallow it; the session will be refreshed when next hitting
          // middleware / a Route Handler / Server Action.
          try {
            cookiesToSet.forEach(({name, value, options}) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ignore
          }
        }
      }
    }
  );
}
