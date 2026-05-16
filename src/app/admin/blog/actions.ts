'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

import {createAdminClient} from '@/lib/supabase/admin';
import {slugify} from '@/lib/admin/slugify';
import {
  deleteGalleryImage,
  uploadGalleryImage
} from '@/lib/storage/gallery';
import type {BlogPostInsert} from '@/types/database';

import type {BlogActionState} from './constants';

function readFields(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? '').trim();
  return {
    slug: get('slug'),
    category: get('category'),
    author: get('author'),
    date: get('date'),
    read_time: get('read_time'),
    title_tr: get('title_tr'),
    title_en: get('title_en'),
    excerpt_tr: get('excerpt_tr'),
    excerpt_en: get('excerpt_en'),
    content_tr: get('content_tr'),
    content_en: get('content_en'),
    published:
      formData.get('published') === 'on' ||
      formData.get('published') === 'true'
  };
}

function validate(
  fields: ReturnType<typeof readFields>
): NonNullable<Extract<BlogActionState, {status: 'error'}>['errors']> {
  const errors: NonNullable<
    Extract<BlogActionState, {status: 'error'}>['errors']
  > = {};
  if (!fields.title_tr) errors.title_tr = 'Türkçe başlık zorunlu.';
  if (!fields.title_en) errors.title_en = 'İngilizce başlık zorunlu.';
  if (!fields.category) errors.category = 'Kategori zorunlu.';
  if (fields.excerpt_tr.length > 240) {
    errors.excerpt_tr = 'Özet en fazla 240 karakter olmalı.';
  }
  if (fields.excerpt_en.length > 240) {
    errors.excerpt_en = 'Özet en fazla 240 karakter olmalı.';
  }
  if (fields.date && Number.isNaN(new Date(fields.date).getTime())) {
    errors.date = 'Geçerli bir yayın tarihi girin.';
  }
  if (fields.read_time && Number.isNaN(Number(fields.read_time))) {
    errors.read_time = 'Okuma süresi bir sayı olmalı.';
  }
  return errors;
}

function buildPayload(
  fields: ReturnType<typeof readFields>,
  imageUrl: string | null
): BlogPostInsert {
  const slug = fields.slug || slugify(fields.title_tr);
  return {
    slug,
    category: fields.category,
    author: fields.author || null,
    // `date` column is `date`; HTML datetime-local sends ISO with time —
    // collapse to YYYY-MM-DD so the column accepts it.
    date: fields.date ? fields.date.slice(0, 10) : undefined,
    image: imageUrl,
    read_time: fields.read_time ? Number(fields.read_time) : 5,
    title_tr: fields.title_tr,
    title_en: fields.title_en || null,
    excerpt_tr: fields.excerpt_tr || null,
    excerpt_en: fields.excerpt_en || null,
    content_tr: fields.content_tr || null,
    content_en: fields.content_en || null,
    published: fields.published
  };
}

function revalidateAll(slug?: string | null) {
  revalidatePath('/admin/blog');
  revalidatePath('/tr/blog');
  revalidatePath('/en/blog');
  if (slug) {
    revalidatePath(`/tr/blog/${slug}`);
    revalidatePath(`/en/blog/${slug}`);
  }
  revalidatePath('/admin');
}

export async function createBlogPost(
  _prev: BlogActionState,
  formData: FormData
): Promise<BlogActionState> {
  const fields = readFields(formData);
  const errors = validate(fields);

  let imageUrl: string | null = null;
  const photo = formData.get('image');
  if (photo instanceof File && photo.size > 0) {
    try {
      const result = await uploadGalleryImage(photo, {prefix: 'blog'});
      imageUrl = result.url;
    } catch (err) {
      errors.image =
        err instanceof Error ? err.message : 'Görsel yüklenemedi.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const payload = buildPayload(fields, imageUrl);
  const admin = createAdminClient();
  const {error} = await admin.from('blog_posts').insert(payload);

  if (error) {
    if (imageUrl) await deleteGalleryImage(imageUrl);
    console.error('[admin.blog.createBlogPost]', error);
    return {status: 'error', serverError: error.message};
  }

  revalidateAll(payload.slug);
  redirect('/admin/blog');
}

export async function updateBlogPost(
  id: string,
  _prev: BlogActionState,
  formData: FormData
): Promise<BlogActionState> {
  const fields = readFields(formData);
  const errors = validate(fields);

  const admin = createAdminClient();
  const {data: existing, error: loadErr} = await admin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (loadErr || !existing) {
    return {
      status: 'error',
      serverError: 'Kayıt bulunamadı veya yüklenemedi.'
    };
  }

  let imageUrl: string | null = existing.image;
  const photo = formData.get('image');
  if (photo instanceof File && photo.size > 0) {
    try {
      const result = await uploadGalleryImage(photo, {prefix: 'blog'});
      if (existing.image) await deleteGalleryImage(existing.image);
      imageUrl = result.url;
    } catch (err) {
      errors.image =
        err instanceof Error ? err.message : 'Görsel yüklenemedi.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {status: 'error', errors};
  }

  const payload = buildPayload(fields, imageUrl);
  const {error} = await admin
    .from('blog_posts')
    .update({
      ...payload,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('[admin.blog.updateBlogPost]', error);
    return {status: 'error', serverError: error.message};
  }

  revalidateAll(payload.slug);
  redirect('/admin/blog');
}

export async function deleteBlogPost(id: string): Promise<void> {
  const admin = createAdminClient();
  const {data: row} = await admin
    .from('blog_posts')
    .select('slug, image')
    .eq('id', id)
    .maybeSingle();

  const {error} = await admin.from('blog_posts').delete().eq('id', id);
  if (error) {
    console.error('[admin.blog.deleteBlogPost]', error);
    throw new Error('Yazı silinemedi.');
  }
  if (row?.image) await deleteGalleryImage(row.image);
  revalidateAll(row?.slug ?? null);
}

export async function togglePublished(
  id: string,
  next: boolean
): Promise<void> {
  const admin = createAdminClient();
  const {data: row} = await admin
    .from('blog_posts')
    .select('slug')
    .eq('id', id)
    .maybeSingle();
  const {error} = await admin
    .from('blog_posts')
    .update({published: next, updated_at: new Date().toISOString()})
    .eq('id', id);
  if (error) {
    console.error('[admin.blog.togglePublished]', error);
    throw new Error('Durum güncellenemedi.');
  }
  revalidateAll(row?.slug ?? null);
}
