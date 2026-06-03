'use client';

import {cloneElement, isValidElement, useActionState, useState} from 'react';
import Link from 'next/link';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import {BLOG_CATEGORIES as CATEGORY_DEFS} from '@/lib/constants/blog-categories';

import type {BlogActionState} from './constants';

export type BlogFormValues = {
  slug?: string;
  category?: string;
  author?: string;
  date?: string;
  read_time?: number;
  title_tr?: string;
  title_en?: string;
  excerpt_tr?: string;
  excerpt_en?: string;
  content_tr?: string;
  content_en?: string;
  published?: boolean;
  existingImage?: string | null;
};

const INITIAL: BlogActionState = {status: 'idle'};

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export function BlogForm({
  action,
  initial,
  submitLabel,
  previewSlug
}: {
  action: (
    state: BlogActionState,
    fd: FormData
  ) => Promise<BlogActionState>;
  initial?: BlogFormValues;
  submitLabel: string;
  previewSlug?: string | null;
}) {
  const [state, formAction, pending] = useActionState<
    BlogActionState,
    FormData
  >(action, INITIAL);

  const errors = state.status === 'error' && state.errors ? state.errors : {};
  const serverError =
    state.status === 'error' && state.serverError ? state.serverError : null;

  const [preview, setPreview] = useState<string | null>(
    initial?.existingImage ?? null
  );
  const [previewIsNew, setPreviewIsNew] = useState(false);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(initial?.existingImage ?? null);
      setPreviewIsNew(false);
      return;
    }
    setPreview(URL.createObjectURL(file));
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
        <Label
          htmlFor="image"
          className="text-sm font-semibold text-brand-black"
        >
          Kapak Fotoğrafı
        </Label>

        {preview && (
          <div className="mt-3 overflow-hidden rounded-xl border-2 border-brand-border bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Önizleme"
              className="aspect-[16/9] w-full max-w-md object-cover"
            />
            <p className="border-t border-brand-border px-3 py-1.5 text-xs text-brand-gray">
              {previewIsNew ? 'Yeni seçilen görsel' : 'Mevcut görsel'}
            </p>
          </div>
        )}

        <div className="mt-3">
          <input
            id="image"
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            onChange={onFileChange}
            aria-invalid={errors.image ? true : undefined}
            aria-describedby={errors.image ? 'image-error' : undefined}
            className="block w-full text-sm text-brand-black file:mr-3 file:rounded-full file:border-0 file:bg-brand-yellow file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-black hover:file:bg-brand-yellow-dark"
          />
          <p className="mt-2 text-xs text-brand-gray">
            JPEG / PNG / WebP / AVIF / GIF — en fazla 5 MB. Boş bırakırsan
            mevcut kapak korunur.
          </p>
          {errors.image && (
            <p
              id="image-error"
              className="mt-1 text-xs text-red-600"
              role="alert"
            >
              {errors.image}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          id="slug"
          label="Slug"
          hint="Boşsa TR başlıktan üretilir"
          error={errors.slug}
        >
          <Input
            name="slug"
            placeholder="ornek-yazi"
            defaultValue={initial?.slug ?? ''}
          />
        </Field>
        <Field id="category" label="Kategori" required error={errors.category}>
          <Select
            name="category"
            defaultValue={initial?.category ?? 'genel'}
            required
            aria-invalid={!!errors.category}
          >
            {CATEGORY_DEFS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label_tr}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="author" label="Yazar" error={errors.author}>
          <Input
            name="author"
            placeholder="Örn. Beyza Erdaş"
            defaultValue={initial?.author ?? ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="title_tr" label="Başlık (TR)" required error={errors.title_tr}>
          <Input
            name="title_tr"
            placeholder="Örn. Reformer Pilates Nedir?"
            defaultValue={initial?.title_tr ?? ''}
            aria-invalid={!!errors.title_tr}
            required
          />
        </Field>
        <Field id="title_en" label="Başlık (EN)" required error={errors.title_en}>
          <Input
            name="title_en"
            placeholder="e.g. What is Reformer Pilates?"
            defaultValue={initial?.title_en ?? ''}
            aria-invalid={!!errors.title_en}
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          id="excerpt_tr"
          label="Özet (TR)"
          hint="Maks. 240 karakter"
          error={errors.excerpt_tr}
        >
          <Textarea
            name="excerpt_tr"
            rows={3}
            maxLength={240}
            defaultValue={initial?.excerpt_tr ?? ''}
          />
        </Field>
        <Field
          id="excerpt_en"
          label="Özet (EN)"
          hint="Max 240 chars"
          error={errors.excerpt_en}
        >
          <Textarea
            name="excerpt_en"
            rows={3}
            maxLength={240}
            defaultValue={initial?.excerpt_en ?? ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Field
          id="content_tr"
          label="İçerik (TR)"
          hint="Markdown destekli"
          error={errors.content_tr}
        >
          <Textarea
            name="content_tr"
            rows={14}
            className="font-mono text-sm"
            defaultValue={initial?.content_tr ?? ''}
          />
        </Field>
        <Field
          id="content_en"
          label="İçerik (EN)"
          hint="Markdown supported"
          error={errors.content_en}
        >
          <Textarea
            name="content_en"
            rows={14}
            className="font-mono text-sm"
            defaultValue={initial?.content_en ?? ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          id="date"
          label="Yayın Tarihi"
          hint="Geçmiş = hemen yayında · Gelecek = zamanlanmış"
          error={errors.date}
        >
          <Input
            type="date"
            name="date"
            defaultValue={initial?.date ?? todayIso()}
          />
        </Field>
        <Field
          id="read_time"
          label="Okuma süresi (dk)"
          error={errors.read_time}
        >
          <Input
            type="number"
            name="read_time"
            min={1}
            max={120}
            defaultValue={String(initial?.read_time ?? 5)}
          />
        </Field>

        <div>
          <Label
            htmlFor="published"
            className="text-sm font-semibold text-brand-black"
          >
            Yayında mı?
          </Label>
          <div className="mt-2 flex items-center gap-3">
            <Switch
              id="published"
              name="published"
              defaultChecked={initial?.published ?? true}
              value="on"
            />
            <span className="text-sm text-brand-gray">
              Kapatırsan taslakta kalır
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Kaydediliyor…' : submitLabel}
        </Button>
        {previewSlug && (
          <a
            href={`/blog/${previewSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full border-2 border-brand-border px-6 text-sm font-semibold text-brand-black transition-colors hover:border-brand-black"
          >
            Önizle ↗
          </a>
        )}
        <Link
          href="/admin/blog"
          className="inline-flex h-11 items-center justify-center rounded-full border-2 border-brand-border px-6 text-sm font-semibold text-brand-black transition-colors hover:border-brand-black"
        >
          İptal
        </Link>
      </div>

      {previewSlug && (
        <p className="text-xs text-brand-gray">
          Önizleme yalnızca yazı yayında ve yayın tarihi gelmişse açılır.
          Taslakta ise önce yayına alıp tarihini bugüne çek.
        </p>
      )}
    </form>
  );
}

type FieldChildProps = {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
};

function Field({
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
