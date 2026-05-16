import {BLOG_CATEGORIES as CATEGORY_DEFS} from '@/lib/constants/blog-categories';

/** Admin dropdown options — same fixed list as the public /blog page. */
export const BLOG_CATEGORIES = CATEGORY_DEFS.map((c) => c.slug);
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/** Slug → TR label, includes aliases so legacy posts show a proper label. */
export const BLOG_CATEGORY_LABELS_TR: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const c of CATEGORY_DEFS) {
    map[c.slug] = c.label_tr;
    for (const alias of c.aliases) map[alias] = c.label_tr;
  }
  return map;
})();

export type BlogActionState =
  | {status: 'idle'}
  | {
      status: 'error';
      errors?: Partial<
        Record<
          | 'image'
          | 'slug'
          | 'category'
          | 'author'
          | 'date'
          | 'read_time'
          | 'title_tr'
          | 'title_en'
          | 'excerpt_tr'
          | 'excerpt_en'
          | 'content_tr'
          | 'content_en',
          string
        >
      >;
      serverError?: string;
    };
