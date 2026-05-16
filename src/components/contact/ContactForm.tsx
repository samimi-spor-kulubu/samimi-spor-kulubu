'use client';

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from 'react';
import {useLocale, useTranslations} from 'next-intl';

import {contact, getWhatsAppUrl} from '@/config/contact';
import {
  submitContactMessage,
  type ContactFormState
} from '@/app/[locale]/iletisim/actions';

const SUBJECTS = ['general', 'reservation', 'branch', 'other'] as const;
type Subject = (typeof SUBJECTS)[number];

const INITIAL_STATE: ContactFormState = {status: 'idle'};

export function ContactForm() {
  const t = useTranslations('Contact.form');
  const locale = useLocale();

  const [state, formAction, pending] = useActionState<
    ContactFormState,
    FormData
  >(submitContactMessage, INITIAL_STATE);

  // Remount counter — when the user clicks "send another", we bump
  // this to force a fresh useActionState/<form/>, clearing fields and
  // any lingering state.
  const [resetTick, setResetTick] = useState(0);

  if (state.status === 'success') {
    return (
      <SuccessCard
        title={t('successTitle')}
        text={t('successText')}
        actionLabel={t('successAction')}
        onAction={() => setResetTick((n) => n + 1)}
      />
    );
  }

  return (
    <FormBody
      key={resetTick}
      t={t}
      locale={locale}
      formAction={formAction}
      pending={pending}
      state={state}
    />
  );
}

function FormBody({
  t,
  locale,
  formAction,
  pending,
  state
}: {
  t: ReturnType<typeof useTranslations>;
  locale: string;
  formAction: (formData: FormData) => void;
  pending: boolean;
  state: ContactFormState;
}) {
  const errors =
    state.status === 'error' && state.errors ? state.errors : {};
  const serverError =
    state.status === 'error' && state.serverError ? state.serverError : null;

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // After a failed submit, scroll the first invalid field (or the
  // server-error banner) into view and focus it.
  useEffect(() => {
    if (state.status !== 'error') return;
    if (serverError) {
      bannerRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
      return;
    }
    const order: Array<['name' | 'phone' | 'email' | 'message', HTMLElement | null]> = [
      ['name', nameRef.current],
      ['phone', phoneRef.current],
      ['email', emailRef.current],
      ['message', messageRef.current]
    ];
    const first = order.find(([key]) => errors[key]);
    if (first?.[1]) {
      first[1].focus({preventScroll: true});
      first[1].scrollIntoView({behavior: 'smooth', block: 'center'});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form
      action={formAction}
      noValidate
      className="scroll-mt-24 rounded-2xl border-2 border-brand-border bg-white p-6 sm:p-8"
    >
      <input type="hidden" name="locale" value={locale} />

      {serverError && (
        <div
          ref={bannerRef}
          role="alert"
          className="mb-6 flex flex-col gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-red-700">{serverError}</p>
          <a
            href={getWhatsAppUrl(contact.whatsapp.messages.bilgi)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow px-5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
          >
            {t('errorBannerCta')} →
          </a>
        </div>
      )}

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
        disabled={pending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-8 text-base font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending && <Spinner />}
        {pending ? t('sending') : t('submit')}
      </button>
    </form>
  );
}

function SuccessCard({
  title,
  text,
  actionLabel,
  onAction
}: {
  title: string;
  text: string;
  actionLabel: string;
  onAction: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    cardRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }, []);

  return (
    <div
      ref={cardRef}
      role="status"
      aria-live="polite"
      className="scroll-mt-24 rounded-2xl border-2 border-brand-yellow bg-white p-8 text-center sm:p-10"
    >
      <div
        aria-hidden="true"
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-2xl font-bold text-brand-black"
      >
        ✓
      </div>
      <h3 className="mt-5 font-heading text-2xl tracking-wider text-brand-black">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-brand-gray">{text}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full border-2 border-brand-black px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black hover:text-white"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
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
            <span className="text-brand-amber" aria-hidden="true">
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

// Subject type is used only to validate select default; the action
// re-validates against SUBJECTS.
void ({} as Subject);
