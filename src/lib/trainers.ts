import type {BranchKey, BranchSlug} from './branches';

export const TRAINERS = [
  {
    key: 'beyza',
    slug: 'beyza-erdas',
    branchKey: 'pilates',
    branchSlug: 'reformer-pilates',
    photo: '/images/trainers/beyza-erdas.jpg'
  },
  {
    key: 'esat',
    slug: 'esat-mahmut-akin',
    branchKey: 'taekwondo',
    branchSlug: 'taekwondo',
    photo: '/images/trainers/esat-mahmut-akin.jpg'
  }
] as const satisfies ReadonlyArray<{
  key: string;
  slug: string;
  branchKey: BranchKey;
  branchSlug: BranchSlug;
  photo: string;
}>;

export type Trainer = (typeof TRAINERS)[number];
export type TrainerKey = Trainer['key'];
export type TrainerSlug = Trainer['slug'];

export const TRAINER_BY_KEY = new Map<TrainerKey, Trainer>(
  TRAINERS.map((t) => [t.key, t])
);
