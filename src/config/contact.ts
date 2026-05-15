export const contact = {
  phone: {
    display: '0533 559 47 97',
    tel: '+905335594797'
  },
  whatsapp: {
    number: '905335594797',
    url: 'https://wa.me/905335594797',
    messages: {
      rezervasyon: 'Merhaba, seans rezervasyonu yaptırmak istiyorum.',
      iptal: 'Merhaba, rezervasyonumu iptal etmek istiyorum.',
      bilgi: 'Merhaba, branşlar hakkında bilgi almak istiyorum.'
    }
  },
  instagram: {
    handle: '@samimi_sportsclup',
    url: 'https://instagram.com/samimi_sportsclup'
  },
  address: {
    street: 'Sami Efendi Caddesi No:31/9',
    district: 'Yenimahalle (Demet)',
    city: 'Ankara',
    country: 'Türkiye',
    full: 'Sami Efendi Caddesi No:31/9, Yenimahalle (Demet), Ankara',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Sami+Efendi+Caddesi+No+31%2F9+Yenimahalle+Demet+Ankara',
    // Approximate area embed (no API key). Replace with exact pb=... URL from
    // Google Maps "Share → Embed a map" once the precise location is set.
    embedUrl:
      'https://maps.google.com/maps?q=Sami+Efendi+Caddesi+31%2F9+Yenimahalle+Demet+Ankara&hl=tr&z=16&ie=UTF8&iwloc=&output=embed'
  },
  hours: {
    weekdays: '12:00 – 23:00',
    weekend: '12:00 – 23:00',
    open: '12:00',
    close: '23:00',
    days: 'Pazartesi – Pazar'
  }
} as const;

export type Contact = typeof contact;

export function getWhatsAppUrl(message?: string): string {
  const text = message ?? contact.whatsapp.messages.bilgi;
  return `${contact.whatsapp.url}?text=${encodeURIComponent(text)}`;
}

