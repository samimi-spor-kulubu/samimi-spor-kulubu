import 'server-only';
import {createPublicClient} from '@/lib/supabase/public';

/** Get a single setting value by key. Returns null if absent. */
export async function getSetting(key: string): Promise<string | null> {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('settings')
    .select('*')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    console.error('[settings.getSetting]', error);
    return null;
  }
  return data?.value ?? null;
}

/** All settings as a {key: value} map. */
export async function getAllSettings(): Promise<Record<string, string>> {
  const supabase = createPublicClient();
  const {data, error} = await supabase.from('settings').select('*');

  if (error) {
    console.error('[settings.getAllSettings]', error);
    return {};
  }
  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.value !== null) map[row.key] = row.value;
  }
  return map;
}
