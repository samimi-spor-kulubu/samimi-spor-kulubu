export type TrainerActionState =
  | {status: 'idle'}
  | {
      status: 'error';
      errors?: Partial<
        Record<
          | 'photo'
          | 'slug'
          | 'name'
          | 'title_tr'
          | 'title_en'
          | 'short_bio_tr'
          | 'short_bio_en'
          | 'about_tr'
          | 'about_en'
          | 'specialties'
          | 'certifications'
          | 'order_index',
          string
        >
      >;
      serverError?: string;
    };
