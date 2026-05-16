'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

import {createAdminClient} from '@/lib/supabase/admin';
import {slugify} from '@/lib/admin/slugify';
import {
  deleteGalleryImage,
  uploadGalleryImage
} from '@/lib/storage/gallery';
import type {GalleryItemInsert} from '@/types/database';

import {GALLERY_CATEGORIES, type GalleryActionState} from './constants';

function readBaseFields(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? '').trim();
  return {
    key: get('key'),
    category: get('category'),
    title_tr: get('title_tr'),
    title_en: get('title_en'),
    order_index: get('order_index'),
    active:
      formData.get('active') === 'on' || formData.get('active') === 'true'
  };
}

function validateBase(
  fields: ReturnType<typeof readBaseFields>
): NonNullable<Extract<GalleryActionState, {status: 'error'}>['errors']> {
  const errors: NonNullable<
    Extract<GalleryActionState, {status: 'error'}>['errors']
  > = {};
  if (!fields.category) errors.category = 'Kategori zorunlu.';
  if (
    fields.category &&
    !GALLERY_CATEGORIES.includes(fields.category as never)
  ) {
    errors.category = 'Geçersiz kategori.';
  }
  if (fields.order_index && Number.isNaN(Number(fields.order_index))) {
    errors.order_index = 'Sıra bir sayı olmalı.';
  }
  return errors;
}

function revalidateAll() {
  revalidatePath('/admin/galeri');
  revalidatePath('/tr/galeri');
  revalidatePath('/en/galeri');
}

export async function createGalleryItem(
  _prev: GalleryActionState,
  formData: FormData
): Promise<GalleryActionState> {
  const fields = readBaseFields(formData);
  const errors = validateBase(fields);

  const photo = formData.get('photo');
  if (!(photo instanceof File) || photo.size === 0) {
    errors.photo = 'Görsel zorunlu.';
  }

  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  // Upload first — if it fails we never touch the DB.
  let uploadedUrl = '';
  try {
    const result = await uploadGalleryImage(photo as File);
    uploadedUrl = result.url;
  } catch (err) {
    return {
      status: 'error',
      errors: {
        photo: err instanceof Error ? err.message : 'Görsel yüklenemedi.'
      }
    };
  }

  const key =
    fields.key ||
    slugify(fields.title_tr || (photo as File).name) ||
    `gallery-${Date.now()}`;

  const row: GalleryItemInsert = {
    key,
    src: uploadedUrl,
    category: fields.category,
    title_tr: fields.title_tr || null,
    title_en: fields.title_en || null,
    order_index: fields.order_index ? Number(fields.order_index) : 0,
    active: fields.active
  };

  const admin = createAdminClient();
  const {error} = await admin.from('gallery_items').insert(row);

  if (error) {
    // Roll the uploaded file back to keep storage consistent.
    await deleteGalleryImage(uploadedUrl);
    console.error('[admin.galeri.createGalleryItem]', error);
    return {status: 'error', serverError: error.message};
  }

  revalidateAll();
  redirect('/admin/galeri');
}

export async function updateGalleryItem(
  id: string,
  _prev: GalleryActionState,
  formData: FormData
): Promise<GalleryActionState> {
  const fields = readBaseFields(formData);
  const errors = validateBase(fields);
  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const admin = createAdminClient();

  // Load existing row to know the current src (for potential replacement).
  const {data: existing, error: loadErr} = await admin
    .from('gallery_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (loadErr || !existing) {
    return {
      status: 'error',
      serverError: 'Kayıt bulunamadı veya yüklenemedi.'
    };
  }

  // If a new file was provided, upload it and remove the old one.
  let nextSrc: string | null = existing.src;
  const photo = formData.get('photo');
  if (photo instanceof File && photo.size > 0) {
    try {
      const result = await uploadGalleryImage(photo);
      // Best-effort cleanup; failures are logged but don't abort.
      if (existing.src) await deleteGalleryImage(existing.src);
      nextSrc = result.url;
    } catch (err) {
      return {
        status: 'error',
        errors: {
          photo: err instanceof Error ? err.message : 'Görsel yüklenemedi.'
        }
      };
    }
  }

  const key = fields.key || existing.key;

  const {error: updErr} = await admin
    .from('gallery_items')
    .update({
      key,
      src: nextSrc,
      category: fields.category,
      title_tr: fields.title_tr || null,
      title_en: fields.title_en || null,
      order_index: fields.order_index
        ? Number(fields.order_index)
        : existing.order_index,
      active: fields.active
    })
    .eq('id', id);

  if (updErr) {
    console.error('[admin.galeri.updateGalleryItem]', updErr);
    return {status: 'error', serverError: updErr.message};
  }

  revalidateAll();
  redirect('/admin/galeri');
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const admin = createAdminClient();
  const {data: row} = await admin
    .from('gallery_items')
    .select('src')
    .eq('id', id)
    .maybeSingle();

  const {error} = await admin.from('gallery_items').delete().eq('id', id);
  if (error) {
    console.error('[admin.galeri.deleteGalleryItem]', error);
    throw new Error('Fotoğraf silinemedi.');
  }

  if (row?.src) {
    await deleteGalleryImage(row.src);
  }
  revalidateAll();
}

export async function toggleActive(id: string, next: boolean): Promise<void> {
  const admin = createAdminClient();
  const {error} = await admin
    .from('gallery_items')
    .update({active: next})
    .eq('id', id);
  if (error) {
    console.error('[admin.galeri.toggleActive]', error);
    throw new Error('Durum güncellenemedi.');
  }
  revalidateAll();
}
