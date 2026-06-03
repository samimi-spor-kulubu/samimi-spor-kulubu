export type BranchActionState =
  | {status: 'idle'}
  | {
      status: 'error';
      errors?: Partial<
        Record<
          | 'slug'
          | 'name_tr'
          | 'name_en'
          | 'schedule_tr'
          | 'schedule_en'
          | 'description_tr'
          | 'description_en'
          | 'short_description_tr'
          | 'short_description_en'
          | 'features_tr'
          | 'features_en'
          | 'instructor_id'
          | 'price_info'
          | 'order_index',
          string
        >
      >;
      serverError?: string;
    };
