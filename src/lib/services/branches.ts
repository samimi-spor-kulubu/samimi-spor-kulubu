import 'server-only';
import {createPublicClient} from '@/lib/supabase/public';
import type {Branch, BranchPriceInfo, Trainer} from '@/types/database';
import {localizeTrainer, type LocalizedTrainer} from './trainers';

export type LocalizedBranch = {
  id: string;
  slug: string;
  emoji: string | null;
  name: string;
  schedule: string | null;
  scheduleLong: string | null;
  description: string | null;
  shortDescription: string | null;
  features: string[];
  women_only: boolean;
  order_index: number;
  price_info: BranchPriceInfo | null;
  instructor: LocalizedTrainer | null;
};

type BranchWithInstructor = Branch & {instructor: Trainer | null};

function pick<T>(en: T | null | undefined, tr: T | null | undefined, locale: string): T | null {
  return (locale === 'en' ? en : tr) ?? null;
}

function localizeBranch(
  row: BranchWithInstructor,
  locale: string
): LocalizedBranch {
  return {
    id: row.id,
    slug: row.slug,
    emoji: row.emoji,
    name: pick(row.name_en, row.name_tr, locale) ?? row.name_tr,
    schedule: pick(row.schedule_en, row.schedule_tr, locale),
    scheduleLong: pick(row.schedule_long_en, row.schedule_long_tr, locale),
    description: pick(row.description_en, row.description_tr, locale),
    shortDescription: pick(
      row.short_description_en,
      row.short_description_tr,
      locale
    ),
    features:
      (locale === 'en' ? row.features_en : row.features_tr) ??
      row.features_tr ??
      [],
    women_only: row.women_only,
    order_index: row.order_index,
    price_info: row.price_info,
    instructor: row.instructor ? localizeTrainer(row.instructor, locale) : null
  };
}

/** All active branches, ordered by order_index. */
export async function getAllBranches(locale: string): Promise<LocalizedBranch[]> {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('branches')
    .select('*, instructor:trainers!instructor_id(*)')
    .eq('active', true)
    .order('order_index', {ascending: true});

  if (error) {
    console.error('[branches.getAllBranches]', error);
    return [];
  }
  return (data as BranchWithInstructor[] | null)?.map((row) =>
    localizeBranch(row, locale)
  ) ?? [];
}

/** Just the slugs of active branches — for generateStaticParams.
 *  Uses the cookie-less public client since this runs at build time. */
export async function getAllBranchSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('branches')
    .select('slug')
    .eq('active', true);
  if (error) {
    console.error('[branches.getAllBranchSlugs]', error);
    return [];
  }
  return data?.map((r) => r.slug) ?? [];
}

/** Single branch by slug. Returns null if not found or inactive. */
export async function getBranchBySlug(
  slug: string,
  locale: string
): Promise<LocalizedBranch | null> {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('branches')
    .select('*, instructor:trainers!instructor_id(*)')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error('[branches.getBranchBySlug]', error);
    return null;
  }
  if (!data) return null;
  return localizeBranch(data as BranchWithInstructor, locale);
}
