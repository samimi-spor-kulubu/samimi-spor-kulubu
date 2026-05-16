'use client';

import {useActionState} from 'react';
import Link from 'next/link';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';

import type {BranchActionState} from './constants';

export type BranchFormValues = {
  slug?: string;
  emoji?: string;
  name_tr?: string;
  name_en?: string;
  schedule_tr?: string;
  schedule_en?: string;
  schedule_long_tr?: string;
  schedule_long_en?: string;
  description_tr?: string;
  description_en?: string;
  short_description_tr?: string;
  short_description_en?: string;
  features_tr?: string[] | null;
  features_en?: string[] | null;
  instructor_id?: string | null;
  price_info?: unknown;
  women_only?: boolean;
  order_index?: number;
  active?: boolean;
};

export type TrainerOption = {id: string; name: string};

const INITIAL: BranchActionState = {status: 'idle'};

export function BranchForm({
  action,
  initial,
  trainers,
  submitLabel
}: {
  action: (
    state: BranchActionState,
    fd: FormData
  ) => Promise<BranchActionState>;
  initial?: BranchFormValues;
  trainers: TrainerOption[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    BranchActionState,
    FormData
  >(action, INITIAL);

  const errors = state.status === 'error' && state.errors ? state.errors : {};
  const serverError =
    state.status === 'error' && state.serverError ? state.serverError : null;

  const featuresDefault = (arr?: string[] | null) =>
    Array.isArray(arr) ? arr.join('\n') : '';

  const priceDefault = initial?.price_info
    ? JSON.stringify(initial.price_info, null, 2)
    : '';

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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          label="Anahtar (slug)"
          hint="Boşsa TR addan üretilir"
          error={errors.slug}
        >
          <Input
            name="slug"
            placeholder="ornek-brans"
            defaultValue={initial?.slug ?? ''}
          />
        </Field>
        <Field label="Emoji">
          <Input
            name="emoji"
            placeholder="🥋"
            defaultValue={initial?.emoji ?? ''}
            maxLength={4}
          />
        </Field>
        <Field label="Sıra" error={errors.order_index}>
          <Input
            name="order_index"
            type="number"
            min={0}
            defaultValue={String(initial?.order_index ?? 0)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Ad (TR)" required error={errors.name_tr}>
          <Input
            name="name_tr"
            placeholder="Reformer Pilates"
            defaultValue={initial?.name_tr ?? ''}
            aria-invalid={!!errors.name_tr}
            required
          />
        </Field>
        <Field label="Ad (EN)" required error={errors.name_en}>
          <Input
            name="name_en"
            placeholder="Reformer Pilates"
            defaultValue={initial?.name_en ?? ''}
            aria-invalid={!!errors.name_en}
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Program — kısa (TR)" error={errors.schedule_tr}>
          <Input
            name="schedule_tr"
            placeholder="Sal / Per · 16:30 – 17:30"
            defaultValue={initial?.schedule_tr ?? ''}
          />
        </Field>
        <Field label="Program — kısa (EN)" error={errors.schedule_en}>
          <Input
            name="schedule_en"
            placeholder="Tue / Thu · 16:30 – 17:30"
            defaultValue={initial?.schedule_en ?? ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Program — uzun (TR)">
          <Input
            name="schedule_long_tr"
            placeholder="Salı / Perşembe · 16:30 – 17:30"
            defaultValue={initial?.schedule_long_tr ?? ''}
          />
        </Field>
        <Field label="Program — uzun (EN)">
          <Input
            name="schedule_long_en"
            placeholder="Tuesday / Thursday · 16:30 – 17:30"
            defaultValue={initial?.schedule_long_en ?? ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Kısa açıklama (TR)"
          error={errors.short_description_tr}
        >
          <Textarea
            name="short_description_tr"
            rows={3}
            defaultValue={initial?.short_description_tr ?? ''}
          />
        </Field>
        <Field
          label="Kısa açıklama (EN)"
          error={errors.short_description_en}
        >
          <Textarea
            name="short_description_en"
            rows={3}
            defaultValue={initial?.short_description_en ?? ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Uzun açıklama (TR)" error={errors.description_tr}>
          <Textarea
            name="description_tr"
            rows={5}
            defaultValue={initial?.description_tr ?? ''}
          />
        </Field>
        <Field label="Uzun açıklama (EN)" error={errors.description_en}>
          <Textarea
            name="description_en"
            rows={5}
            defaultValue={initial?.description_en ?? ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Öne çıkan özellikler (TR)"
          hint="Her satır bir madde"
          error={errors.features_tr}
        >
          <Textarea
            name="features_tr"
            rows={5}
            placeholder={'Her yaşa uygun\nDisiplin ve özgüven'}
            defaultValue={featuresDefault(initial?.features_tr)}
          />
        </Field>
        <Field
          label="Öne çıkan özellikler (EN)"
          hint="Her satır bir madde"
          error={errors.features_en}
        >
          <Textarea
            name="features_en"
            rows={5}
            placeholder={'Suitable for all ages\nDiscipline and confidence'}
            defaultValue={featuresDefault(initial?.features_en)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Eğitmen" error={errors.instructor_id}>
          <Select
            name="instructor_id"
            defaultValue={initial?.instructor_id ?? ''}
          >
            <option value="">— Atama yok —</option>
            {trainers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>

        <div>
          <Label className="text-sm font-semibold text-brand-black">
            Bayanlara özel
          </Label>
          <div className="mt-2 flex items-center gap-3">
            <Switch
              name="women_only"
              defaultChecked={initial?.women_only ?? false}
              value="on"
            />
            <span className="text-sm text-brand-gray">
              Reformer Pilates gibi sadece bayanların erişebileceği branşlar
            </span>
          </div>
        </div>
      </div>

      <Field
        label="Fiyat bilgisi (JSON, opsiyonel)"
        hint='Örn. {"packages": [{"key":"group4","campaign":"4.200 TL","normal":"5.000 TL"}]}'
        error={errors.price_info}
      >
        <Textarea
          name="price_info"
          rows={6}
          className="font-mono text-sm"
          defaultValue={priceDefault}
        />
      </Field>

      <div>
        <Label className="text-sm font-semibold text-brand-black">Aktif</Label>
        <div className="mt-2 flex items-center gap-3">
          <Switch
            name="active"
            defaultChecked={initial?.active ?? true}
            value="on"
          />
          <span className="text-sm text-brand-gray">
            Pasif yaparsan sitede gözükmez
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Kaydediliyor…' : submitLabel}
        </Button>
        <Link
          href="/admin/branslar"
          className="inline-flex h-11 items-center justify-center rounded-full border-2 border-brand-border px-6 text-sm font-semibold text-brand-black transition-colors hover:border-brand-black"
        >
          İptal
        </Link>
      </div>
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
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <Label className="text-sm font-semibold text-brand-black">
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
      <div className="mt-1.5">{children}</div>
      <p className="mt-1 min-h-[1rem] text-xs text-red-600" role="alert">
        {error ?? ''}
      </p>
    </div>
  );
}
