'use client';

import {useEffect, useRef, useState, type FormEvent, type ReactNode} from 'react';
import {useTranslations} from 'next-intl';

const SUBJECTS = ['general', 'reservation', 'branch', 'other'] as const;
type Subject = (typeof SUBJECTS)[number];

type ErrorKey = 'name' | 'phone' | 'email' | 'message';
type FormErrors = Partial<Record<ErrorKey, string>>;

const ERROR_ORDER: ErrorKey[] = ['name', 'phone', 'email', 'message'];

export function ContactForm() {
  const t = useTranslations('Contact.form');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const fieldRef = (key: ErrorKey) => {
    switch (key) {
      case 'name':
        return nameRef.current;
      case 'phone':
        return phoneRef.current;
      case 'email':
        return emailRef.current;
      case 'message':
        return messageRef.current;
    }
  };

  // Scroll the success card into view when it replaces the form.
  useEffect(() => {
    if (submitted) {
      successRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [submitted]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — if filled, silently "succeed" without sending anything.
    if ((data.get('website') as string)?.trim()) {
      setSubmitted(true);
      return;
    }

    const name = ((data.get('name') as string) ?? '').trim();
    const phone = ((data.get('phone') as string) ?? '').trim();
    const email = ((data.get('email') as string) ?? '').trim();
    const message = ((data.get('message') as string) ?? '').trim();

    const next: FormErrors = {};
    if (!name) next.name = t('errorRequired');
    if (!phone) next.phone = t('errorRequired');
    if (!message) next.message = t('errorRequired');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = t('errorEmail');
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      const firstKey = ERROR_ORDER.find((k) => next[k]);
      if (firstKey) {
        const el = fieldRef(firstKey);
        el?.focus({preventScroll: true});
        el?.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
      return;
    }

    setErrors({});
    setSubmitting(true);

    const payload = {
      name,
      phone,
      email,
      subject: data.get('subject') as Subject,
      message
    };

    // Phase 1: mock submit (Phase 2: POST to /api/contact backed by Resend)
    console.log('[ContactForm] submit:', payload);

    await new Promise((r) => setTimeout(r, 500));

    form.reset();
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        ref={successRef}
        className="scroll-mt-24 rounded-2xl border-2 border-brand-yellow bg-white p-8 text-center sm:p-10"
      >
        <div
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-2xl font-bold text-brand-black"
        >
          ✓
        </div>
        <h3 className="mt-5 font-heading text-2xl tracking-wider text-brand-black">
          {t('successTitle')}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-brand-gray">
          {t('successText')}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full border-2 border-brand-black px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black hover:text-white"
        >
          {t('successAction')}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="scroll-mt-24 rounded-2xl border-2 border-brand-border bg-white p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label={t('fields.name')} required error={errors.name}>
          <input
            ref={nameRef}
            name="name"
            type="text"
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!errors.name}
            placeholder={t('fields.namePlaceholder')}
            className={inputClass(!!errors.name)}
          />
        </Field>

        <Field label={t('fields.phone')} required error={errors.phone}>
          <input
            ref={phoneRef}
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-required="true"
            aria-invalid={!!errors.phone}
            placeholder={t('fields.phonePlaceholder')}
            className={inputClass(!!errors.phone)}
          />
        </Field>

        <Field
          label={t('fields.email')}
          hint={t('optional')}
          error={errors.email}
        >
          <input
            ref={emailRef}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            placeholder={t('fields.emailPlaceholder')}
            className={inputClass(!!errors.email)}
          />
        </Field>

        <Field label={t('fields.subject')}>
          <select
            name="subject"
            defaultValue="general"
            className={inputClass(false)}
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {t(`subjects.${s}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label={t('fields.message')} required error={errors.message}>
          <textarea
            ref={messageRef}
            name="message"
            rows={6}
            aria-required="true"
            aria-invalid={!!errors.message}
            placeholder={t('fields.messagePlaceholder')}
            className={inputClass(!!errors.message) + ' resize-y'}
          />
        </Field>
      </div>

      {/* Honeypot — must remain empty. Hidden visually but in DOM. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-yellow px-8 text-base font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? t('sending') : t('submit')}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-semibold text-brand-black">
        <span>
          {label}{' '}
          {required && (
            <span className="text-brand-yellow-dark" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {hint && !error && (
          <span className="text-xs font-normal text-brand-gray">{hint}</span>
        )}
      </span>
      <div className="mt-1.5">{children}</div>
      <p
        className="mt-1 min-h-[1rem] text-xs text-red-600"
        role="alert"
        aria-live="polite"
      >
        {error ?? ''}
      </p>
    </label>
  );
}

function inputClass(hasError: boolean) {
  return (
    'w-full rounded-xl border-2 bg-white px-4 py-2.5 text-base text-brand-black placeholder:text-zinc-400 transition-colors focus:outline-none ' +
    (hasError
      ? 'border-red-500 focus:border-red-500'
      : 'border-brand-border focus:border-brand-yellow')
  );
}
