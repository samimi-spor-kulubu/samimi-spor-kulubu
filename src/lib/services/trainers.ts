import 'server-only';
import {createPublicClient} from '@/lib/supabase/public';
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
  const supabase = createPublicClient();
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

/** Just the slugs of active trainers — for generateStaticParams.
 *  Uses the cookie-less public client since this runs at build time. */
export async function getAllTrainerSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('trainers')
    .select('slug')
    .eq('active', true);
  if (error) {
    console.error('[trainers.getAllTrainerSlugs]', error);
    return [];
  }
  return data?.map((r) => r.slug) ?? [];
}

/** Single trainer by slug. Returns null if not found or inactive. */
export async function getTrainerBySlug(
  slug: string,
  locale: string
): Promise<LocalizedTrainer | null> {
  const supabase = createPublicClient();
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

/** Branches this trainer teaches. Sourced from the trainer_branches
 *  junction so a single trainer can be linked to multiple branches.
 *  Returns an ordered list of {name, slug}. */
export async function getBranchesForTrainer(
  trainerId: string,
  locale: string
): Promise<{name: string; slug: string}[]> {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('trainer_branches')
    .select('branches!inner(slug, name_tr, name_en, order_index, active)')
    .eq('trainer_id', trainerId)
    .eq('branches.active', true);

  if (error) {
    console.error('[trainers.getBranchesForTrainer]', error);
    return [];
  }
  if (!data) return [];

  type Row = {
    branches: {
      slug: string;
      name_tr: string;
      name_en: string | null;
      order_index: number;
      active: boolean;
    } | null;
  };

  return (data as unknown as Row[])
    .map((row) => row.branches)
    .filter((b): b is NonNullable<typeof b> => b !== null)
    .sort((a, b) => a.order_index - b.order_index)
    .map((b) => ({
      name: (locale === 'en' ? b.name_en : b.name_tr) ?? b.name_tr,
      slug: b.slug
    }));
}

/** All trainer_branches rows joined to active branches, grouped per
 *  trainer. Lets list pages render every trainer's full branch set in
 *  one round-trip instead of N. */
export async function getBranchesByTrainer(
  locale: string
): Promise<Map<string, {name: string; slug: string}[]>> {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('trainer_branches')
    .select(
      'trainer_id, branches!inner(slug, name_tr, name_en, order_index, active)'
    )
    .eq('branches.active', true);

  if (error) {
    console.error('[trainers.getBranchesByTrainer]', error);
    return new Map();
  }
  if (!data) return new Map();

  type Row = {
    trainer_id: string;
    branches: {
      slug: string;
      name_tr: string;
      name_en: string | null;
      order_index: number;
      active: boolean;
    } | null;
  };

  const grouped = new Map<
    string,
    {name: string; slug: string; order_index: number}[]
  >();
  for (const row of data as unknown as Row[]) {
    if (!row.branches) continue;
    const list = grouped.get(row.trainer_id) ?? [];
    list.push({
      name:
        (locale === 'en' ? row.branches.name_en : row.branches.name_tr) ??
        row.branches.name_tr,
      slug: row.branches.slug,
      order_index: row.branches.order_index
    });
    grouped.set(row.trainer_id, list);
  }

  const out = new Map<string, {name: string; slug: string}[]>();
  for (const [id, list] of grouped.entries()) {
    out.set(
      id,
      list
        .sort((a, b) => a.order_index - b.order_index)
        .map(({name, slug}) => ({name, slug}))
    );
  }
  return out;
}
