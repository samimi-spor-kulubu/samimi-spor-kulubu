export const GALLERY_CATEGORIES = [
  'taekwondo',
  'boxing',
  'archery',
  'gymnastics',
  'pilates',
  'facility'
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export type GalleryItem = {
  id: string;
  src: string;
  category: GalleryCategory;
};

export const GALLERY: GalleryItem[] = [
  {id: 'tw-1', src: '', category: 'taekwondo'},
  {id: 'tw-2', src: '', category: 'taekwondo'},
  {id: 'bx-1', src: '', category: 'boxing'},
  {id: 'bx-2', src: '', category: 'boxing'},
  {id: 'ar-1', src: '', category: 'archery'},
  {id: 'ar-2', src: '', category: 'archery'},
  {id: 'gy-1', src: '', category: 'gymnastics'},
  {id: 'gy-2', src: '', category: 'gymnastics'},
  {id: 'pl-1', src: '', category: 'pilates'},
  {id: 'pl-2', src: '', category: 'pilates'},
  {id: 'fc-1', src: '', category: 'facility'},
  {id: 'fc-2', src: '', category: 'facility'}
];
