'use server';

import {revalidatePath} from 'next/cache';

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
  serverError:
    'Bir sorun oluştu, lütfen tekrar deneyin veya WhatsApp’tan yazın.'
};

const EN = {
  nameTooShort: 'Please enter at least 2 characters.',
  phoneTooShort:
    'Please enter a phone number with at least 10 digits (e.g. +90 532 123 45 67).',
  emailInvalid: 'Please enter a valid email.',
  messageTooShort: 'Your message must be at least 10 characters.',
  serverError:
    'Something went wrong — please try again or message us on WhatsApp.'
};

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
  const {error} = await supabase.from('contact_messages').insert({
    name,
    phone: phone || null,
    email: email || null,
    subject,
    message,
    status: 'new'
  });

  if (error) {
    console.error('[contact.submitContactMessage]', error);
    return {status: 'error', serverError: t.serverError};
  }

  // Refresh the admin views so the new message shows up immediately
  // for any admin who is already on the dashboard / messages list.
  revalidatePath('/admin');
  revalidatePath('/admin/mesajlar');

  return {status: 'success'};
}
