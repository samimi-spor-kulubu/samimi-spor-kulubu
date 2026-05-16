import {createAdminClient} from '@/lib/supabase/admin';

import {SettingsForm} from './SettingsForm';

export const dynamic = 'force-dynamic';

async function loadSettings(): Promise<Record<string, string>> {
  const admin = createAdminClient();
  const {data, error} = await admin.from('settings').select('*');
  if (error) {
    console.error('[admin.ayarlar.load]', error);
    return {};
  }
  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.value !== null) map[row.key] = row.value;
  }

  // One-time backfill: if `phone_number` hasn't been set yet, seed it
  // from whichever legacy phone key has a value. Idempotent — once the
  // row exists the upsert below becomes a no-op for the next visitor.
  if (!map.phone_number) {
    const legacy = map.phone_tel || map.whatsapp_number || map.phone_display;
    if (legacy) {
      await admin
        .from('settings')
        .upsert(
          {key: 'phone_number', value: legacy},
          {onConflict: 'key', ignoreDuplicates: true}
        );
      map.phone_number = legacy;
    }
  }

  return map;
}

export default async function AyarlarPage() {
  const values = await loadSettings();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
          AYARLAR
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Site genelindeki iletişim, adres ve çalışma saati bilgilerini
          buradan güncelle.
        </p>
      </header>

      <SettingsForm values={values} />
    </div>
  );
}
