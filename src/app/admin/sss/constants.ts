/** Categories the admin UI offers. Matches the public site filter set. */
export const FAQ_CATEGORIES = [
  'membership',
  'classes',
  'facility',
  'pilates',
  'payment'
] as const;
export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const CATEGORY_LABELS_TR: Record<FaqCategory, string> = {
  membership: 'Üyelik',
  classes: 'Branşlar',
  facility: 'Tesis',
  pilates: 'Reformer Pilates',
  payment: 'Ödeme'
};

export type FaqFieldKey =
  | 'key'
  | 'category'
  | 'question_tr'
  | 'question_en'
  | 'answer_tr'
  | 'answer_en'
  | 'link_href'
  | 'link_label_tr'
  | 'link_label_en'
  | 'order_index';

export type FaqActionState =
  | {status: 'idle'}
  | {
      status: 'error';
      errors?: Partial<Record<FaqFieldKey, string>>;
      serverError?: string;
    };
