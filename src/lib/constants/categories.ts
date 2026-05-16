/**
 * Canonical gallery categories.
 *
 * Single source of truth for the fixed filter set on /galeri AND the
 * dropdown options in /admin/galeri. Slugs are Turkish-friendly.
 * `aliases` keeps backwards compatibility with the original English
 * slugs (boxing, archery, …) so old photos keep filtering correctly
 * after the renaming.
 */
export type GalleryCategoryDef = {
  /** Canonical slug stored in `gallery_items.category` for new uploads. */
  slug: string;
  label_tr: string;
  label_en: string;
  /** Legacy slugs that should be treated as this category when filtering. */
  aliases: readonly string[];
};

export const GALLERY_CATEGORIES: ReadonlyArray<GalleryCategoryDef> = [
  {
    slug: 'taekwondo',
    label_tr: 'Taekwondo',
    label_en: 'Taekwondo',
    aliases: []
  },
  {
    slug: 'boks-kick-boks',
    label_tr: 'Boks & Kick Boks',
    label_en: 'Boxing & Kickboxing',
    aliases: ['boxing']
  },
  {
    slug: 'okculuk',
    label_tr: 'Okçuluk',
    label_en: 'Archery',
    aliases: ['archery']
  },
  {
    slug: 'jimnastik',
    label_tr: 'Jimnastik',
    label_en: 'Gymnastics',
    aliases: ['gymnastics']
  },
  {
    slug: 'reformer-pilates',
    label_tr: 'Reformer Pilates',
    label_en: 'Reformer Pilates',
    aliases: ['pilates']
  },
  {
    slug: 'tesis',
    label_tr: 'Tesis',
    label_en: 'Facility',
    aliases: ['facility']
  }
];

/** All slugs (canonical + aliases) that should map to the given category. */
export function getCategoryMatchers(slug: string): string[] {
  const def = GALLERY_CATEGORIES.find((c) => c.slug === slug);
  if (!def) return [slug];
  return [def.slug, ...def.aliases];
}

/** Localised label for a category slug. Falls back to the raw slug. */
export function categoryLabel(slug: string, locale: string): string {
  const def = GALLERY_CATEGORIES.find(
    (c) => c.slug === slug || c.aliases.includes(slug)
  );
  if (!def) return slug;
  return locale === 'en' ? def.label_en : def.label_tr;
}
