'use server';

import {redirect} from 'next/navigation';

import {createClient} from '@/lib/supabase/server';
import {createAdminClient} from '@/lib/supabase/admin';

export type LoginState = {error?: string};

export async function signInAction(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/admin');

  if (!email || !password) {
    return {error: 'E-posta ve şifre zorunlu.'};
  }

  const supabase = await createClient();

  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    return {error: 'E-posta veya şifre hatalı.'};
  }

  // Verify the user is an active admin. Use the admin client so the RLS
  // on admin_users (service-role only) doesn't hide the row.
  const admin = createAdminClient();
  const {data: row, error: adminErr} = await admin
    .from('admin_users')
    .select('active')
    .eq('id', data.user.id)
    .maybeSingle();

  if (adminErr || !row || !row.active) {
    // Not an authorised admin — sign them out so the cookie doesn't
    // give them a half-authenticated state.
    await supabase.auth.signOut();
    return {
      error: 'Bu hesabın yönetici yetkisi yok. Lütfen yetkili kişiyle iletişime geçin.'
    };
  }

  // Only allow redirecting to internal /admin paths.
  const safeNext = next.startsWith('/admin') ? next : '/admin';
  redirect(safeNext);
}
