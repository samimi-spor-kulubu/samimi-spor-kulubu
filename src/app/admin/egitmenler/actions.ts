'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

import {createAdminClient} from '@/lib/supabase/admin';
import {slugify, splitLines, splitLinesOrCommas} from '@/lib/admin/slugify';
import {
  deleteGalleryImage,
  uploadGalleryImage
} from '@/lib/storage/gallery';
import type {TrainerInsert} from '@/types/database';

import type {TrainerActionState} from './constants';

function readFields(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? '').trim();
  return {
    slug: get('slug'),
    name: get('name'),
    title_tr: get('title_tr'),
    title_en: get('title_en'),
    short_bio_tr: get('short_bio_tr'),
    short_bio_en: get('short_bio_en'),
    about_tr_raw: get('about_tr'),
    about_en_raw: get('about_en'),
    specialties_raw: get('specialties'),
    certifications_raw: get('certifications'),
    order_index: get('order_index'),
    active:
      formData.get('active') === 'on' || formData.get('active') === 'true'
  };
}

function validate(
  fields: ReturnType<typeof readFields>
): NonNullable<Extract<TrainerActionState, {status: 'error'}>['errors']> {
  const errors: NonNullable<
    Extract<TrainerActionState, {status: 'error'}>['errors']
  > = {};
  if (!fields.name) errors.name = 'İsim zorunlu.';
  if (fields.order_index && Number.isNaN(Number(fields.order_index))) {
    errors.order_index = 'Sıra bir sayı olmalı.';
  }
  return errors;
}

function buildPayload(
  fields: ReturnType<typeof readFields>,
  photoUrl: string | null
): Omit<TrainerInsert, 'photo'> & {photo: string | null} {
  const slug = fields.slug || slugify(fields.name);
  const about_tr = splitLines(fields.about_tr_raw);
  const about_en = splitLines(fields.about_en_raw);
  const specialties = splitLinesOrCommas(fields.specialties_raw);
  const certifications = splitLinesOrCommas(fields.certifications_raw);
  return {
    slug,
    name: fields.name,
    title_tr: fields.title_tr || null,
    title_en: fields.title_en || null,
    short_bio_tr: fields.short_bio_tr || null,
    short_bio_en: fields.short_bio_en || null,
    about_tr: about_tr.length > 0 ? about_tr : null,
    about_en: about_en.length > 0 ? about_en : null,
    specialties: specialties.length > 0 ? specialties : null,
    certifications: certifications.length > 0 ? certifications : null,
    photo: photoUrl,
    order_index: fields.order_index ? Number(fields.order_index) : 0,
    active: fields.active
  };
}

function revalidateAll(slug?: string | null) {
  revalidatePath('/admin/egitmenler');
  revalidatePath('/tr/egitmenler');
  revalidatePath('/en/egitmenler');
  if (slug) {
    revalidatePath(`/tr/egitmenler/${slug}`);
    revalidatePath(`/en/egitmenler/${slug}`);
  }
  // Trainer changes ripple into the branches join + homepage roster.
  revalidatePath('/tr/branslar');
  revalidatePath('/en/branslar');
  revalidatePath('/tr');
  revalidatePath('/en');
  revalidatePath('/admin');
}

export async function createTrainer(
  _prev: TrainerActionState,
  formData: FormData
): Promise<TrainerActionState> {
  const fields = readFields(formData);
  const errors = validate(fields);

  let photoUrl: string | null = null;
  const photo = formData.get('photo');
  if (photo instanceof File && photo.size > 0) {
    try {
      const result = await uploadGalleryImage(photo, {prefix: 'trainers'});
      photoUrl = result.url;
    } catch (err) {
      errors.photo =
        err instanceof Error ? err.message : 'Görsel yüklenemedi.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const payload = buildPayload(fields, photoUrl);
  const admin = createAdminClient();
  const {error} = await admin.from('trainers').insert(payload);

  if (error) {
    if (photoUrl) await deleteGalleryImage(photoUrl);
    console.error('[admin.egitmenler.createTrainer]', error);
    return {status: 'error', serverError: error.message};
  }

  revalidateAll(payload.slug);
  redirect('/admin/egitmenler');
}

export async function updateTrainer(
  id: string,
  _prev: TrainerActionState,
  formData: FormData
): Promise<TrainerActionState> {
  const fields = readFields(formData);
  const errors = validate(fields);

  const admin = createAdminClient();
  const {data: existing, error: loadErr} = await admin
    .from('trainers')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (loadErr || !existing) {
    return {
      status: 'error',
      serverError: 'Kayıt bulunamadı veya yüklenemedi.'
    };
  }

  let photoUrl: string | null = existing.photo;
  const photo = formData.get('photo');
  if (photo instanceof File && photo.size > 0) {
    try {
      const result = await uploadGalleryImage(photo, {prefix: 'trainers'});
      if (existing.photo) await deleteGalleryImage(existing.photo);
      photoUrl = result.url;
    } catch (err) {
      errors.photo =
        err instanceof Error ? err.message : 'Görsel yüklenemedi.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const payload = buildPayload(fields, photoUrl);
  const {error} = await admin
    .from('trainers')
    .update({
      ...payload,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('[admin.egitmenler.updateTrainer]', error);
    return {status: 'error', serverError: error.message};
  }

  revalidateAll(payload.slug);
  redirect('/admin/egitmenler');
}

export async function deleteTrainer(id: string): Promise<void> {
  const admin = createAdminClient();
  const {data: row} = await admin
    .from('trainers')
    .select('slug, photo')
    .eq('id', id)
    .maybeSingle();

  const {error} = await admin.from('trainers').delete().eq('id', id);
  if (error) {
    console.error('[admin.egitmenler.deleteTrainer]', error);
    throw new Error('Eğitmen silinemedi.');
  }
  if (row?.photo) await deleteGalleryImage(row.photo);
  revalidateAll(row?.slug ?? null);
}

export async function toggleActive(id: string, next: boolean): Promise<void> {
  const admin = createAdminClient();
  const {error} = await admin
    .from('trainers')
    .update({active: next, updated_at: new Date().toISOString()})
    .eq('id', id);
  if (error) {
    console.error('[admin.egitmenler.toggleActive]', error);
    throw new Error('Durum güncellenemedi.');
  }
  revalidateAll();
}
