'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

import {createAdminClient} from '@/lib/supabase/admin';
import {slugify, splitLines} from '@/lib/admin/slugify';
import type {BranchInsert} from '@/types/database';

import type {BranchActionState} from './constants';

function readFields(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? '').trim();
  return {
    slug: get('slug'),
    emoji: get('emoji'),
    name_tr: get('name_tr'),
    name_en: get('name_en'),
    schedule_tr: get('schedule_tr'),
    schedule_en: get('schedule_en'),
    schedule_long_tr: get('schedule_long_tr'),
    schedule_long_en: get('schedule_long_en'),
    description_tr: get('description_tr'),
    description_en: get('description_en'),
    short_description_tr: get('short_description_tr'),
    short_description_en: get('short_description_en'),
    features_tr_raw: get('features_tr'),
    features_en_raw: get('features_en'),
    instructor_id: get('instructor_id'),
    price_info_raw: get('price_info'),
    order_index: get('order_index'),
    women_only:
      formData.get('women_only') === 'on' ||
      formData.get('women_only') === 'true',
    active:
      formData.get('active') === 'on' || formData.get('active') === 'true'
  };
}

function validate(
  fields: ReturnType<typeof readFields>
): NonNullable<Extract<BranchActionState, {status: 'error'}>['errors']> {
  const errors: NonNullable<
    Extract<BranchActionState, {status: 'error'}>['errors']
  > = {};
  if (!fields.name_tr) errors.name_tr = 'Türkçe ad zorunlu.';
  if (!fields.name_en) errors.name_en = 'İngilizce ad zorunlu.';
  if (fields.order_index && Number.isNaN(Number(fields.order_index))) {
    errors.order_index = 'Sıra bir sayı olmalı.';
  }
  if (fields.price_info_raw) {
    try {
      JSON.parse(fields.price_info_raw);
    } catch {
      errors.price_info = 'Geçerli JSON girin (örn. {"packages": [...]}).';
    }
  }
  return errors;
}

function buildPayload(fields: ReturnType<typeof readFields>): BranchInsert {
  const slug = fields.slug || slugify(fields.name_tr);
  const features_tr = splitLines(fields.features_tr_raw);
  const features_en = splitLines(fields.features_en_raw);
  const priceInfo = fields.price_info_raw
    ? JSON.parse(fields.price_info_raw)
    : null;
  return {
    slug,
    emoji: fields.emoji || null,
    name_tr: fields.name_tr,
    name_en: fields.name_en || null,
    schedule_tr: fields.schedule_tr || null,
    schedule_en: fields.schedule_en || null,
    schedule_long_tr: fields.schedule_long_tr || null,
    schedule_long_en: fields.schedule_long_en || null,
    description_tr: fields.description_tr || null,
    description_en: fields.description_en || null,
    short_description_tr: fields.short_description_tr || null,
    short_description_en: fields.short_description_en || null,
    features_tr: features_tr.length > 0 ? features_tr : null,
    features_en: features_en.length > 0 ? features_en : null,
    instructor_id: fields.instructor_id || null,
    price_info: priceInfo,
    women_only: fields.women_only,
    order_index: fields.order_index ? Number(fields.order_index) : 0,
    active: fields.active
  };
}

function revalidateAll(slug?: string | null) {
  revalidatePath('/admin/branslar');
  revalidatePath('/tr/branslar');
  revalidatePath('/en/branslar');
  if (slug) {
    revalidatePath(`/tr/branslar/${slug}`);
    revalidatePath(`/en/branslar/${slug}`);
  }
  // The homepage shows a branches grid + the dashboard counts branches.
  revalidatePath('/tr');
  revalidatePath('/en');
  revalidatePath('/admin');
}

export async function createBranch(
  _prev: BranchActionState,
  formData: FormData
): Promise<BranchActionState> {
  const fields = readFields(formData);
  const errors = validate(fields);
  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const payload = buildPayload(fields);
  const admin = createAdminClient();
  const {error} = await admin.from('branches').insert(payload);

  if (error) {
    console.error('[admin.branslar.createBranch]', error);
    return {status: 'error', serverError: error.message};
  }

  revalidateAll(payload.slug ?? null);
  redirect('/admin/branslar');
}

export async function updateBranch(
  id: string,
  _prev: BranchActionState,
  formData: FormData
): Promise<BranchActionState> {
  const fields = readFields(formData);
  const errors = validate(fields);
  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const payload = buildPayload(fields);
  const admin = createAdminClient();
  const {error} = await admin
    .from('branches')
    .update({
      ...payload,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('[admin.branslar.updateBranch]', error);
    return {status: 'error', serverError: error.message};
  }

  revalidateAll(payload.slug ?? null);
  redirect('/admin/branslar');
}

export async function deleteBranch(id: string): Promise<void> {
  const admin = createAdminClient();
  const {data: row} = await admin
    .from('branches')
    .select('slug')
    .eq('id', id)
    .maybeSingle();

  const {error} = await admin.from('branches').delete().eq('id', id);
  if (error) {
    console.error('[admin.branslar.deleteBranch]', error);
    throw new Error('Branş silinemedi.');
  }
  revalidateAll(row?.slug ?? null);
}

export async function toggleActive(id: string, next: boolean): Promise<void> {
  const admin = createAdminClient();
  const {error} = await admin
    .from('branches')
    .update({active: next, updated_at: new Date().toISOString()})
    .eq('id', id);
  if (error) {
    console.error('[admin.branslar.toggleActive]', error);
    throw new Error('Durum güncellenemedi.');
  }
  revalidateAll();
}
