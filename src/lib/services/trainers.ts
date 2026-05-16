import 'server-only';
import {createClient} from '@/lib/supabase/server';
import type {Trainer} from '@/types/database';

export type LocalizedTrainer = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  shortBio: string | null;
  about: string[];
  certifications: string[];
  specialties: string[];
  photo: string | null;
  order_index: number;
};

function pick<T>(en: T | null | undefined, tr: T | null | undefined, locale: string): T | null {
  return (locale === 'en' ? en : tr) ?? null;
}

export function localizeTrainer(row: Trainer, locale: string): LocalizedTrainer {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: pick(row.title_en, row.title_tr, locale),
    shortBio: pick(row.short_bio_en, row.short_bio_tr, locale),
    about:
      (locale === 'en' ? row.about_en : row.about_tr) ?? row.about_tr ?? [],
    certifications: row.certifications ?? [],
    specialties: row.specialties ?? [],
    photo: row.photo,
    order_index: row.order_index
  };
}

/** All active trainers, ordered by order_index. */
export async function getAllTrainers(
  locale: string
): Promise<LocalizedTrainer[]> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from('trainers')
    .select('*')
    .eq('active', true)
    .order('order_index', {ascending: true});

  if (error) {
    console.error('[trainers.getAllTrainers]', error);
    return [];
  }
  return data?.map((row) => localizeTrainer(row, locale)) ?? [];
}

/** Single trainer by slug. Returns null if not found or inactive. */
export async function getTrainerBySlug(
  slug: string,
  locale: string
): Promise<LocalizedTrainer | null> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from('trainers')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error('[trainers.getTrainerBySlug]', error);
    return null;
  }
  if (!data) return null;
  return localizeTrainer(data, locale);
}
