'use client';

import {useActionState, useState} from 'react';
import Link from 'next/link';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';

import {
  CATEGORY_LABELS_TR,
  GALLERY_CATEGORIES,
  type GalleryActionState
} from './constants';

const INITIAL: GalleryActionState = {status: 'idle'};

export type GalleryFormValues = {
  key?: string;
  category?: string;
  title_tr?: string;
  title_en?: string;
  order_index?: number;
  active?: boolean;
  existingSrc?: string | null;
};

export function GalleryForm({
  action,
  initial,
  submitLabel,
  photoRequired
}: {
  action: (
    state: GalleryActionState,
    fd: FormData
  ) => Promise<GalleryActionState>;
  initial?: GalleryFormValues;
  submitLabel: string;
  photoRequired: boolean;
}) {
  const [state, formAction, pending] = useActionState<
    GalleryActionState,
    FormData
  >(action, INITIAL);

  const errors = state.status === 'error' && state.errors ? state.errors : {};
  const serverError =
    state.status === 'error' && state.serverError ? state.serverError : null;

  const [preview, setPreview] = useState<string | null>(
    initial?.existingSrc ?? null
  );
  const [previewIsNew, setPreviewIsNew] = useState(false);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(initial?.existingSrc ?? null);
      setPreviewIsNew(false);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setPreviewIsNew(true);
  };

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
          Fotoğraf{' '}
          {photoRequired && (
            <span className="text-brand-amber" aria-hidden="true">
              *
            </span>
          )}
        </Label>

        {preview && (
          <div className="mt-3 overflow-hidden rounded-xl border-2 border-brand-border bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Önizleme"
              className="aspect-video w-full object-contain"
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
            required={photoRequired}
            className="block w-full text-sm text-brand-black file:mr-3 file:rounded-full file:border-0 file:bg-brand-yellow file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-black hover:file:bg-brand-yellow-dark"
          />
          <p className="mt-2 text-xs text-brand-gray">
            JPEG / PNG / WebP / AVIF / GIF — en fazla 5 MB.
          </p>
          {errors.photo && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {errors.photo}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Kategori" required error={errors.category}>
          <Select
            name="category"
            defaultValue={initial?.category ?? 'tesis'}
            aria-invalid={!!errors.category}
            required
          >
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS_TR[c]}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Anahtar (key)"
          hint="Boşsa TR başlık/dosya adından üretilir"
          error={errors.key}
        >
          <Input
            name="key"
            placeholder="ornek-anahtar"
            defaultValue={initial?.key ?? ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Başlık (TR)" error={errors.title_tr}>
          <Input
            name="title_tr"
            placeholder="Örn. Reformer pilates seansı"
            defaultValue={initial?.title_tr ?? ''}
          />
        </Field>
        <Field label="Başlık (EN)" error={errors.title_en}>
          <Input
            name="title_en"
            placeholder="e.g. Reformer pilates session"
            defaultValue={initial?.title_en ?? ''}
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
          href="/admin/galeri"
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
