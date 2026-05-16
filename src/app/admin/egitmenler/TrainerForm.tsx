'use client';

import {useActionState, useState} from 'react';
import Link from 'next/link';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';

import type {TrainerActionState} from './constants';

export type TrainerFormValues = {
  slug?: string;
  name?: string;
  title_tr?: string;
  title_en?: string;
  short_bio_tr?: string;
  short_bio_en?: string;
  about_tr?: string[] | null;
  about_en?: string[] | null;
  specialties?: string[] | null;
  certifications?: string[] | null;
  order_index?: number;
  active?: boolean;
  existingPhoto?: string | null;
};

const INITIAL: TrainerActionState = {status: 'idle'};

export function TrainerForm({
  action,
  initial,
  submitLabel
}: {
  action: (
    state: TrainerActionState,
    fd: FormData
  ) => Promise<TrainerActionState>;
  initial?: TrainerFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    TrainerActionState,
    FormData
  >(action, INITIAL);

  const errors = state.status === 'error' && state.errors ? state.errors : {};
  const serverError =
    state.status === 'error' && state.serverError ? state.serverError : null;

  const [preview, setPreview] = useState<string | null>(
    initial?.existingPhoto ?? null
  );
  const [previewIsNew, setPreviewIsNew] = useState(false);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(initial?.existingPhoto ?? null);
      setPreviewIsNew(false);
      return;
    }
    setPreview(URL.createObjectURL(file));
    setPreviewIsNew(true);
  };

  const joinLines = (arr?: string[] | null) =>
    Array.isArray(arr) ? arr.join('\n') : '';

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

      <div className="rounded-2xl border-2 border-brand-border bg-white p-5 sm:p-6">
        <Label className="text-sm font-semibold text-brand-black">
          Fotoğraf
        </Label>

        {preview && (
          <div className="mt-3 overflow-hidden rounded-xl border-2 border-brand-border bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Önizleme"
              className="aspect-[4/5] w-48 max-w-full object-cover"
            />
            <p className="border-t border-brand-border px-3 py-1.5 text-xs text-brand-gray">
              {previewIsNew ? 'Yeni seçilen görsel' : 'Mevcut görsel'}
            </p>
          </div>
        )}

        <div className="mt-3">
          <input
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            onChange={onFileChange}
            className="block w-full text-sm text-brand-black file:mr-3 file:rounded-full file:border-0 file:bg-brand-yellow file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-black hover:file:bg-brand-yellow-dark"
          />
          <p className="mt-2 text-xs text-brand-gray">
            JPEG / PNG / WebP / AVIF / GIF — en fazla 5 MB. Boş bırakırsan
            mevcut fotoğraf korunur.
          </p>
          {errors.photo && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.photo}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          label="Slug"
          hint="Boşsa isimden üretilir"
          error={errors.slug}
        >
          <Input
            name="slug"
            placeholder="ornek-egitmen"
            defaultValue={initial?.slug ?? ''}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="İsim" required error={errors.name}>
            <Input
              name="name"
              placeholder="Adı Soyadı"
              defaultValue={initial?.name ?? ''}
              aria-invalid={!!errors.name}
              required
            />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Unvan (TR)" error={errors.title_tr}>
          <Input
            name="title_tr"
            placeholder="Fizyoterapist · Reformer Pilates"
            defaultValue={initial?.title_tr ?? ''}
          />
        </Field>
        <Field label="Unvan (EN)" error={errors.title_en}>
          <Input
            name="title_en"
            placeholder="Physiotherapist · Reformer Pilates"
            defaultValue={initial?.title_en ?? ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Kısa biyografi (TR)" error={errors.short_bio_tr}>
          <Textarea
            name="short_bio_tr"
            rows={3}
            defaultValue={initial?.short_bio_tr ?? ''}
          />
        </Field>
        <Field label="Kısa biyografi (EN)" error={errors.short_bio_en}>
          <Textarea
            name="short_bio_en"
            rows={3}
            defaultValue={initial?.short_bio_en ?? ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Hakkında — paragraflar (TR)"
          hint="Her satır bir paragraf"
          error={errors.about_tr}
        >
          <Textarea
            name="about_tr"
            rows={6}
            defaultValue={joinLines(initial?.about_tr)}
          />
        </Field>
        <Field
          label="Hakkında — paragraflar (EN)"
          hint="Her satır bir paragraf"
          error={errors.about_en}
        >
          <Textarea
            name="about_en"
            rows={6}
            defaultValue={joinLines(initial?.about_en)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Uzmanlıklar"
          hint="Satır ya da virgülle ayır"
          error={errors.specialties}
        >
          <Textarea
            name="specialties"
            rows={5}
            placeholder={'Manuel terapi\nKinezyo bantlama\nPilates'}
            defaultValue={joinLines(initial?.specialties)}
          />
        </Field>
        <Field
          label="Sertifikalar"
          hint="Satır ya da virgülle ayır"
          error={errors.certifications}
        >
          <Textarea
            name="certifications"
            rows={5}
            placeholder={'MPT\nHacamat-Kupa Masajı'}
            defaultValue={joinLines(initial?.certifications)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Sıra (order_index)" error={errors.order_index}>
          <Input
            name="order_index"
            type="number"
            min={0}
            defaultValue={String(initial?.order_index ?? 0)}
          />
        </Field>

        <div>
          <Label className="text-sm font-semibold text-brand-black">
            Aktif
          </Label>
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
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Kaydediliyor…' : submitLabel}
        </Button>
        <Link
          href="/admin/egitmenler"
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
