export const GALLERY_CATEGORIES = [
  'taekwondo',
  'boxing',
  'archery',
  'gymnastics',
  'pilates',
  'facility'
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const CATEGORY_LABELS_TR: Record<GalleryCategory, string> = {
  taekwondo: 'Taekwondo',
  boxing: 'Boks & Kick Boks',
  archery: 'Okçuluk',
  gymnastics: 'Jimnastik',
  pilates: 'Reformer Pilates',
  facility: 'Tesis'
};

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
