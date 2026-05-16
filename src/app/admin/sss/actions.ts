'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

import {createAdminClient} from '@/lib/supabase/admin';
import type {FaqInsert} from '@/types/database';

import type {FaqActionState, FaqFieldKey} from './constants';

function slugify(input: string): string {
  return input
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function readFields(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? '').trim();

  return {
    key: get('key'),
    category: get('category'),
    question_tr: get('question_tr'),
    question_en: get('question_en'),
    answer_tr: get('answer_tr'),
    answer_en: get('answer_en'),
    link_href: get('link_href'),
    link_label_tr: get('link_label_tr'),
    link_label_en: get('link_label_en'),
    order_index: get('order_index'),
    active:
      formData.get('active') === 'on' || formData.get('active') === 'true'
  };
}

function validate(
  fields: ReturnType<typeof readFields>
): Partial<Record<FaqFieldKey, string>> {
  const errors: Partial<Record<FaqFieldKey, string>> = {};
  if (!fields.category) errors.category = 'Kategori zorunlu.';
  if (!fields.question_tr) errors.question_tr = 'Türkçe soru zorunlu.';
  if (!fields.answer_tr) errors.answer_tr = 'Türkçe cevap zorunlu.';
  if (fields.order_index && Number.isNaN(Number(fields.order_index))) {
    errors.order_index = 'Sıra bir sayı olmalı.';
  }
  return errors;
}

function buildInsert(fields: ReturnType<typeof readFields>): FaqInsert {
  const key = fields.key || slugify(fields.question_tr);
  return {
    key,
    category: fields.category,
    question_tr: fields.question_tr,
    question_en: fields.question_en || null,
    answer_tr: fields.answer_tr,
    answer_en: fields.answer_en || null,
    link_href: fields.link_href || null,
    link_label_tr: fields.link_label_tr || null,
    link_label_en: fields.link_label_en || null,
    order_index: fields.order_index ? Number(fields.order_index) : 0,
    active: fields.active
  };
}

function revalidateAll() {
  revalidatePath('/admin/sss');
  revalidatePath('/tr/sss');
  revalidatePath('/en/sss');
}

export async function createFaq(
  _prev: FaqActionState,
  formData: FormData
): Promise<FaqActionState> {
  const fields = readFields(formData);
  const errors = validate(fields);
  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const admin = createAdminClient();
  const {error} = await admin.from('faqs').insert(buildInsert(fields));

  if (error) {
    console.error('[admin.sss.createFaq]', error);
    return {status: 'error', serverError: error.message};
  }

  revalidateAll();
  redirect('/admin/sss');
}

export async function updateFaq(
  id: string,
  _prev: FaqActionState,
  formData: FormData
): Promise<FaqActionState> {
  const fields = readFields(formData);
  const errors = validate(fields);
  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const admin = createAdminClient();
  const {error} = await admin
    .from('faqs')
    .update({
      ...buildInsert(fields),
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('[admin.sss.updateFaq]', error);
    return {status: 'error', serverError: error.message};
  }

  revalidateAll();
  redirect('/admin/sss');
}

export async function deleteFaq(id: string): Promise<void> {
  const admin = createAdminClient();
  const {error} = await admin.from('faqs').delete().eq('id', id);
  if (error) {
    console.error('[admin.sss.deleteFaq]', error);
    throw new Error('SSS silinemedi.');
  }
  revalidateAll();
}

export async function toggleActive(id: string, next: boolean): Promise<void> {
  const admin = createAdminClient();
  const {error} = await admin
    .from('faqs')
    .update({active: next, updated_at: new Date().toISOString()})
    .eq('id', id);
  if (error) {
    console.error('[admin.sss.toggleActive]', error);
    throw new Error('Durum güncellenemedi.');
  }
  revalidateAll();
}
