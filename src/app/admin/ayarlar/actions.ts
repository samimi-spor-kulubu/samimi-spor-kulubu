'use server';

import {revalidatePath} from 'next/cache';

import {createAdminClient} from '@/lib/supabase/admin';

import {KNOWN_SETTINGS_KEYS, type SettingsActionState} from './constants';

export async function updateSettings(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const rows = KNOWN_SETTINGS_KEYS.map((key) => ({
    key,
    value: String(formData.get(key) ?? '').trim() || null,
    updated_at: new Date().toISOString()
  }));

  const admin = createAdminClient();
  const {error} = await admin.from('settings').upsert(rows, {onConflict: 'key'});

  if (error) {
    console.error('[admin.ayarlar.updateSettings]', error);
    return {status: 'error', serverError: error.message};
  }

  // The whole layout (footer + nav links sometimes pull from settings)
  // and every locale page reads these — invalidate broadly.
  revalidatePath('/', 'layout');

  return {status: 'success'};
}
