import 'server-only';
import {cache} from 'react';

import {contact as FALLBACK} from '@/config/contact';
import {
  formatPhoneDisplay,
  formatPhoneTel,
  formatPhoneWhatsApp
} from '@/lib/utils/phone';

import {getAllSettings} from './settings';

/**
 * Shape of contact info consumed by pages, navbar and footer. Mirrors
 * the structure of `src/config/contact.ts` so existing code reads
 * intuitively; values come from the Supabase `settings` table with
 * `contact.ts` as the fallback when a key is empty or DB is down.
 */
export type ContactInfo = {
  phone: {display: string; tel: string};
  whatsapp: {
    number: string;
    url: string;
    messages: typeof FALLBACK.whatsapp.messages;
  };
  instagram: {handle: string; url: string};
  address: {
    street: string;
    district: string;
    city: string;
    country: string;
    full: string;
    short: string;
    mapsUrl: string;
    embedUrl: string;
  };
  hours: {
    weekdays: string;
    weekend: string;
    open: string;
    close: string;
    days: string;
  };
};

/**
 * Loads contact info from `settings` (with static `contact.ts` fallback).
 *
 * Wrapped in React `cache` so multiple callers within the same request
 * (layout, page, server components) share a single DB hit. The layout
 * also calls `getContactInfo()` and passes the result to Navbar/Footer
 * so client components don't need their own copy.
 */
export const getContactInfo = cache(async (): Promise<ContactInfo> => {
  const s = await getAllSettings();

  // Single phone source of truth. The admin types one raw number into
  // `phone_number`; we derive every format the site needs. Legacy
  // settings keys (phone_tel / whatsapp_number / phone_display) are
  // tried as a fallback so the site keeps working even before a
  // backfill has run.
  const rawPhone =
    s.phone_number ||
    s.phone_tel ||
    s.whatsapp_number ||
    s.phone_display ||
    FALLBACK.phone.tel;

  const phoneDisplay = formatPhoneDisplay(rawPhone);
  const phoneTel = formatPhoneTel(rawPhone);
  const whatsappNumber = formatPhoneWhatsApp(rawPhone);

  return {
    phone: {
      display: phoneDisplay,
      tel: phoneTel
    },
    whatsapp: {
      number: whatsappNumber,
      url: `https://wa.me/${whatsappNumber}`,
      messages: FALLBACK.whatsapp.messages
    },
    instagram: {
      handle: s.instagram_handle || FALLBACK.instagram.handle,
      url: s.instagram_url || FALLBACK.instagram.url
    },
    address: {
      // street/district/city are split fields only used by JSON-LD; keep
      // them on the static config (settings stores composed strings only).
      street: FALLBACK.address.street,
      district: FALLBACK.address.district,
      city: FALLBACK.address.city,
      country: FALLBACK.address.country,
      full: s.address_full || FALLBACK.address.full,
      short: s.address_short || FALLBACK.address.full,
      mapsUrl: FALLBACK.address.mapsUrl,
      embedUrl: s.google_maps_embed_url || FALLBACK.address.embedUrl
    },
    hours: {
      weekdays: s.hours_weekdays || FALLBACK.hours.weekdays,
      weekend: s.hours_weekends || FALLBACK.hours.weekend,
      open: FALLBACK.hours.open,
      close: FALLBACK.hours.close,
      days: FALLBACK.hours.days
    }
  };
});

/**
 * Builds a `wa.me` URL using the live WhatsApp number with an optional
 * prefilled message. Pure helper — no DB calls.
 */
export function whatsAppUrl(info: ContactInfo, message?: string): string {
  const text = message ?? info.whatsapp.messages.bilgi;
  return `${info.whatsapp.url}?text=${encodeURIComponent(text)}`;
}
