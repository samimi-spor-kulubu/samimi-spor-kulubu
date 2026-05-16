import {GALLERY_CATEGORIES as CATEGORY_DEFS} from '@/lib/constants/categories';

/** Admin dropdown options — same fixed list as the public /galeri page. */
export const GALLERY_CATEGORIES = CATEGORY_DEFS.map((c) => c.slug);
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

/**
 * Slug → TR label, including legacy aliases (boxing → 'Boks & Kick Boks').
 * Lets the admin list view show a proper label for old photos that were
 * uploaded before the slugs were renamed.
 */
export const CATEGORY_LABELS_TR: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const c of CATEGORY_DEFS) {
    map[c.slug] = c.label_tr;
    for (const alias of c.aliases) map[alias] = c.label_tr;
  }
  return map;
})();

export type GalleryActionState =
  | {status: 'idle'}
  | {
      status: 'error';
      errors?: Partial<
        Record<
          'photo' | 'category' | 'key' | 'title_tr' | 'title_en' | 'order_index',
          string
        >
      >;
      serverError?: string;
    };
