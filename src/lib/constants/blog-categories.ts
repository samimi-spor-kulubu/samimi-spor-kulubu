/**
 * Canonical blog categories.
 *
 * Single source of truth for the filter pills on /blog AND the
 * dropdown options in /admin/blog. Each slug carries TR/EN labels +
 * an `aliases` list that maps the original English seed slugs
 * (training / nutrition / martial-arts / kids-sports / general) to
 * the new canonical Turkish ones for backwards compatibility.
 */
export type BlogCategoryDef = {
  slug: string;
  label_tr: string;
  label_en: string;
  aliases: readonly string[];
};

export const BLOG_CATEGORIES: ReadonlyArray<BlogCategoryDef> = [
  {
    slug: 'pilates',
    label_tr: 'Pilates',
    label_en: 'Pilates',
    aliases: []
  },
  {
    slug: 'taekwondo',
    label_tr: 'Taekwondo',
    label_en: 'Taekwondo',
    aliases: ['martial-arts', 'kids-sports']
  },
  {
    slug: 'beslenme',
    label_tr: 'Beslenme',
    label_en: 'Nutrition',
    aliases: ['nutrition']
  },
  {
    slug: 'antrenman',
    label_tr: 'Antrenman',
    label_en: 'Training',
    aliases: ['training']
  },
  {
    slug: 'genel',
    label_tr: 'Genel',
    label_en: 'General',
    aliases: ['general']
  }
];

/** Resolve any slug (canonical or alias) to a localised label. */
export function blogCategoryLabel(slug: string, locale: string): string {
  const def = BLOG_CATEGORIES.find(
    (c) => c.slug === slug || c.aliases.includes(slug)
  );
  if (!def) return slug;
  return locale === 'en' ? def.label_en : def.label_tr;
}

/** Canonical slug for the given category slug or alias. */
export function canonicalBlogCategory(slug: string): string {
  const def = BLOG_CATEGORIES.find(
    (c) => c.slug === slug || c.aliases.includes(slug)
  );
  return def?.slug ?? slug;
}
