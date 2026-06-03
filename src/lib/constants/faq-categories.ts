/**
 * Canonical FAQ categories — shared by /admin/sss and the public
 * /sss page so the filter pill order, slugs and TR labels stay in
 * sync between the two surfaces.
 */
export const FAQ_CATEGORIES = [
  'membership',
  'classes',
  'facility',
  'pilates',
  'payment'
] as const;

export type FAQCategory = (typeof FAQ_CATEGORIES)[number];

/** Lightweight type for FAQ rows the public FaqClient consumes. */
export type LocalizedFAQItem = {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  link?: {label: string; href: string};
};
