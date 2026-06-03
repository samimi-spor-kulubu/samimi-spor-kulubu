'use server';

import {revalidatePath} from 'next/cache';
import {headers} from 'next/headers';

import {sendContactEmail} from '@/lib/email/resend';
import {createPublicClient} from '@/lib/supabase/public';

const SUBJECTS = ['general', 'reservation', 'branch', 'other'] as const;
type Subject = (typeof SUBJECTS)[number];

type FieldErrors = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

export type ContactFormState =
  | {status: 'idle'}
  | {status: 'success'}
  | {status: 'error'; errors?: FieldErrors; serverError?: string};

const TR = {
  nameTooShort: 'Adınızı en az 2 karakter olarak girin.',
  phoneTooShort:
    'Telefon numaranızı 10 haneli olarak girin (örn. 0532 123 45 67).',
  emailInvalid: 'Geçerli bir e-posta girin.',
  messageTooShort: 'Mesajınızı en az 10 karakter olarak yazın.',
  rateLimited:
    'Çok hızlı gönderim yapıldı. Lütfen bir dakika sonra tekrar deneyin.',
  serverError:
    'Bir sorun oluştu, lütfen tekrar deneyin veya WhatsApp’tan yazın.'
};

const EN = {
  nameTooShort: 'Please enter at least 2 characters.',
  phoneTooShort:
    'Please enter a phone number with at least 10 digits (e.g. +90 532 123 45 67).',
  emailInvalid: 'Please enter a valid email.',
  messageTooShort: 'Your message must be at least 10 characters.',
  rateLimited: 'Too many submissions. Please try again in a minute.',
  serverError:
    'Something went wrong — please try again or message us on WhatsApp.'
};

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 3;
const rateBuckets = new Map<string, number[]>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;
  const hits = (rateBuckets.get(key) ?? []).filter((t) => t > cutoff);
  if (hits.length >= RATE_MAX) {
    rateBuckets.set(key, hits);
    return false;
  }
  hits.push(now);
  rateBuckets.set(key, hits);

  if (rateBuckets.size > 1000) {
    for (const [k, v] of rateBuckets) {
      const fresh = v.filter((t) => t > cutoff);
      if (fresh.length === 0) rateBuckets.delete(k);
      else rateBuckets.set(k, fresh);
    }
  }
  return true;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return h.get('x-real-ip') ?? 'unknown';
}

export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot — silently "succeed" without inserting anything.
  if (String(formData.get('website') ?? '').trim()) {
    return {status: 'success'};
  }

  const locale = String(formData.get('locale') ?? 'tr');
  const t = locale === 'en' ? EN : TR;

  const ip = await clientIp();
  if (!rateLimit(ip)) {
    return {status: 'error', serverError: t.rateLimited};
  }

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const subjectInput = String(formData.get('subject') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  const errors: FieldErrors = {};

  if (name.length < 2) errors.name = t.nameTooShort;

  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) errors.phone = t.phoneTooShort;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = t.emailInvalid;
  }

  if (message.length < 10) errors.message = t.messageTooShort;

  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const subject: Subject | null = SUBJECTS.includes(subjectInput as Subject)
    ? (subjectInput as Subject)
    : null;

  const supabase = createPublicClient();
  const [insertRes, emailRes] = await Promise.all([
    supabase.from('contact_messages').insert({
      name,
      phone: phone || null,
      email: email || null,
      subject,
      message,
      status: 'new'
    }),
    sendContactEmail({
      name,
      phone,
      email: email || null,
      subject,
      message,
      locale: locale === 'en' ? 'en' : 'tr'
    })
  ]);

  if (insertRes.error) {
    console.error('[contact.submitContactMessage] supabase', insertRes.error);
    return {status: 'error', serverError: t.serverError};
  }

  if (!emailRes.ok) {
    console.error('[contact.submitContactMessage] resend', emailRes.reason);
    // Supabase kaydı tutuldu; admin dashboard'dan görülebilir.
    // Kullanıcıya hata göstermiyoruz çünkü mesaj kaydedildi.
  }

  // Refresh the admin views so the new message shows up immediately
  // for any admin who is already on the dashboard / messages list.
  revalidatePath('/admin');
  revalidatePath('/admin/mesajlar');

  return {status: 'success'};
}
