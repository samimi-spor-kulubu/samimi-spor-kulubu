/**
 * Anon-key Supabase client without cookie wiring.
 *
 * Use this from contexts that run outside an HTTP request — chiefly
 * `generateStaticParams`, build-time data collection, or static
 * `generateMetadata` for prerendered pages. RLS still applies (this
 * uses the publishable / anon key, not the service role).
 *
 * For request-time server work that needs session cookies, use
 * `@/lib/supabase/server`. For RLS-bypass work, use
 * `@/lib/supabase/admin`.
 */
import 'server-only';
import {createClient as createSupabaseClient} from '@supabase/supabase-js';

import type {Database} from '@/types/database';

let cached: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createPublicClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing public Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set.'
    );
  }

  cached = createSupabaseClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  return cached;
}
