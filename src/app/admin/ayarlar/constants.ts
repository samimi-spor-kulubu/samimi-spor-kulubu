/**
 * Settings keys + Turkish labels.
 *
 * Mirrors the seed list in supabase/migrations/0002_settings.sql.
 * The admin form upserts each row individually so adding a new entry
 * here is enough to surface it in the panel.
 */
export type SettingDef = {
  key: string;
  label: string;
  hint?: string;
  placeholder?: string;
  type?: 'text' | 'url' | 'tel' | 'textarea';
};

export type SettingsGroup = {
  title: string;
  description: string;
  fields: SettingDef[];
};

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    title: 'İletişim',
    description: 'Telefon ve Instagram bilgileri.',
    fields: [
      {
        key: 'phone_number',
        label: 'Telefon Numarası',
        placeholder: '05335594797',
        type: 'tel',
        hint:
          'Hem "Ara" hem WhatsApp butonu bu numarayı kullanır. Boşluksuz girin: 05335594797'
      },
      {
        key: 'instagram_handle',
        label: 'Instagram kullanıcı adı',
        placeholder: '@samimi_sportsclub'
      },
      {
        key: 'instagram_url',
        label: 'Instagram URL',
        placeholder: 'https://instagram.com/samimi_sportsclub',
        type: 'url'
      }
    ]
  },
  {
    title: 'Adres',
    description: 'Tesisin konum bilgileri.',
    fields: [
      {
        key: 'address_full',
        label: 'Adres — tam',
        placeholder: 'Sami Efendi Caddesi No:31/9, Yenimahalle (Demet), Ankara',
        type: 'textarea'
      },
      {
        key: 'address_short',
        label: 'Adres — kısa',
        placeholder: 'Sami Efendi Cad. No:31/9, Yenimahalle, Ankara'
      },
      {
        key: 'google_maps_embed_url',
        label: 'Google Maps embed URL',
        placeholder: 'https://www.google.com/maps/embed?pb=...',
        type: 'url',
        hint: 'Google Maps → Paylaş → Haritayı yerleştir → iframe içindeki src değeri'
      }
    ]
  },
  {
    title: 'Çalışma Saatleri',
    description: 'Hafta içi ve hafta sonu için açılış/kapanış aralıkları.',
    fields: [
      {
        key: 'hours_weekdays',
        label: 'Hafta içi',
        placeholder: '12:00 - 23:00'
      },
      {
        key: 'hours_weekends',
        label: 'Hafta sonu',
        placeholder: '12:00 - 23:00'
      }
    ]
  }
];

/** Flat list of every key we manage, for upsert delete-protection. */
export const KNOWN_SETTINGS_KEYS = SETTINGS_GROUPS.flatMap((g) =>
  g.fields.map((f) => f.key)
);

export type SettingsActionState =
  | {status: 'idle'}
  | {status: 'success'}
  | {status: 'error'; serverError?: string};
