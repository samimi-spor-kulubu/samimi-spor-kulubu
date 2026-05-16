'use client';

import {cloneElement, isValidElement, useActionState} from 'react';
import Link from 'next/link';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';

import {
  CATEGORY_LABELS_TR,
  FAQ_CATEGORIES,
  type FaqActionState
} from './constants';

export type FaqFormValues = {
  key?: string;
  category?: string;
  question_tr?: string;
  question_en?: string;
  answer_tr?: string;
  answer_en?: string;
  link_href?: string;
  link_label_tr?: string;
  link_label_en?: string;
  order_index?: number;
  active?: boolean;
};

const INITIAL: FaqActionState = {status: 'idle'};

export function FaqForm({
  action,
  initial,
  submitLabel
}: {
  action: (state: FaqActionState, fd: FormData) => Promise<FaqActionState>;
  initial?: FaqFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    FaqActionState,
    FormData
  >(action, INITIAL);

  const errors = state.status === 'error' && state.errors ? state.errors : {};
  const serverError =
    state.status === 'error' && state.serverError ? state.serverError : null;

  return (
    <form action={formAction} className="space-y-6">
      {serverError && (
        <p
          role="alert"
          className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldBlock id="category" label="Kategori" required error={errors.category}>
          <Select
            name="category"
            defaultValue={initial?.category ?? 'membership'}
            aria-invalid={!!errors.category}
            required
          >
            {FAQ_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS_TR[c]}
              </option>
            ))}
          </Select>
        </FieldBlock>

        <FieldBlock
          id="key"
          label="Anahtar (slug)"
          hint="Boş bırakırsan TR sorudan üretilir"
          error={errors.key}
        >
          <Input
            name="key"
            placeholder="ornek-sorulan-soru"
            defaultValue={initial?.key ?? ''}
          />
        </FieldBlock>
      </div>

      <FieldBlock id="question_tr" label="Soru (TR)" required error={errors.question_tr}>
        <Input
          name="question_tr"
          placeholder="Örn. Üyelik nasıl başlar?"
          defaultValue={initial?.question_tr ?? ''}
          aria-invalid={!!errors.question_tr}
          required
        />
      </FieldBlock>

      <FieldBlock id="question_en" label="Soru (EN)" error={errors.question_en}>
        <Input
          name="question_en"
          placeholder="e.g. How does a membership start?"
          defaultValue={initial?.question_en ?? ''}
        />
      </FieldBlock>

      <FieldBlock id="answer_tr" label="Cevap (TR)" required error={errors.answer_tr}>
        <Textarea
          name="answer_tr"
          rows={6}
          placeholder="Cevabı buraya yazın…"
          defaultValue={initial?.answer_tr ?? ''}
          aria-invalid={!!errors.answer_tr}
          required
        />
      </FieldBlock>

      <FieldBlock id="answer_en" label="Cevap (EN)" error={errors.answer_en}>
        <Textarea
          name="answer_en"
          rows={6}
          placeholder="Write the answer here…"
          defaultValue={initial?.answer_en ?? ''}
        />
      </FieldBlock>

      <div className="rounded-2xl border-2 border-brand-border bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
          İlgili sayfa linki (opsiyonel)
        </p>
        <p className="mt-1 text-xs text-brand-gray">
          Cevabın altında bir sayfaya bağlantı göstermek için doldurun.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FieldBlock id="link_href" label="Link hedefi" error={errors.link_href}>
            <Input
              name="link_href"
              placeholder="/branslar/reformer-pilates"
              defaultValue={initial?.link_href ?? ''}
            />
          </FieldBlock>
          <FieldBlock id="link_label_tr" label="Etiket (TR)" error={errors.link_label_tr}>
            <Input
              name="link_label_tr"
              placeholder="Reformer Pilates sayfası"
              defaultValue={initial?.link_label_tr ?? ''}
            />
          </FieldBlock>
          <FieldBlock id="link_label_en" label="Etiket (EN)" error={errors.link_label_en}>
            <Input
              name="link_label_en"
              placeholder="Reformer Pilates page"
              defaultValue={initial?.link_label_en ?? ''}
            />
          </FieldBlock>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldBlock id="order_index" label="Sıra (order_index)" error={errors.order_index}>
          <Input
            name="order_index"
            type="number"
            min={0}
            defaultValue={String(initial?.order_index ?? 0)}
          />
        </FieldBlock>

        <div>
          <Label
            htmlFor="active"
            className="text-sm font-semibold text-brand-black"
          >
            Aktif
          </Label>
          <div className="mt-2 flex items-center gap-3">
            <Switch
              id="active"
              name="active"
              defaultChecked={initial?.active ?? true}
              value="on"
            />
            <span className="text-sm text-brand-gray">
              Pasif yaparsan sitede gözükmez
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Kaydediliyor…' : submitLabel}
        </Button>
        <Link
          href="/admin/sss"
          className="inline-flex h-11 items-center justify-center rounded-full border-2 border-brand-border px-6 text-sm font-semibold text-brand-black transition-colors hover:border-brand-black"
        >
          İptal
        </Link>
      </div>
    </form>
  );
}

type FieldChildProps = {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
};

function FieldBlock({
  id,
  label,
  required,
  hint,
  error,
  children
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const errorId = `${id}-error`;
  const child = isValidElement<FieldChildProps>(children)
    ? cloneElement(children, {
        id,
        'aria-describedby': error ? errorId : undefined,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined
      })
    : children;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <Label
          htmlFor={id}
          className="text-sm font-semibold text-brand-black"
        >
          {label}{' '}
          {required && (
            <span className="text-brand-amber" aria-hidden="true">
              *
            </span>
          )}
        </Label>
        {hint && !error && (
          <span className="text-xs font-normal text-brand-gray">{hint}</span>
        )}
      </div>
      <div className="mt-1.5">{child}</div>
      <p
        id={errorId}
        className="mt-1 min-h-[1rem] text-xs text-red-600"
        role="alert"
      >
        {error ?? ''}
      </p>
    </div>
  );
}
