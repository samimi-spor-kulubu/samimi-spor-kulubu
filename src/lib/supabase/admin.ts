/**
 * Server-only Supabase admin client.
 *
 * Uses SUPABASE_SECRET_KEY → bypasses RLS. NEVER import this from a
 * Client Component. Use only inside:
 *   - Route Handlers (`app/api/.../route.ts`)
 *   - Server Actions
 *   - Server Components that explicitly need full access (rare)
 *
 * `import 'server-only'` makes the build fail loudly if a Client
 * Component ever picks this up.
 */
import 'server-only';
import {createClient as createSupabaseClient} from '@supabase/supabase-js';

import type {Database} from '@/types/database';

let cachedAdmin: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createAdminClient() {
  if (cachedAdmin) return cachedAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secret) {
    throw new Error(
      'Missing Supabase admin env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set.'
    );
  }

  cachedAdmin = createSupabaseClient<Database>(url, secret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  return cachedAdmin;
}
