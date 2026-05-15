export const BRANCHES = [
  {key: 'taekwondo', slug: 'taekwondo', emoji: '🥋'},
  {key: 'boxing', slug: 'boks-kick-boks', emoji: '🥊'},
  {key: 'archery', slug: 'geleneksel-okculuk', emoji: '🏹'},
  {key: 'gymnastics', slug: 'cocuk-jimnastigi', emoji: '🤸'},
  {key: 'pilates', slug: 'reformer-pilates', emoji: '🧘'}
] as const;

export type Branch = (typeof BRANCHES)[number];
export type BranchKey = Branch['key'];
export type BranchSlug = Branch['slug'];

export const BRANCH_BY_SLUG = new Map<BranchSlug, Branch>(
  BRANCHES.map((b) => [b.slug, b])
);

export const PILATES_PRICES = [
  {key: 'group4', campaign: '4.200 TL', normal: '5.000 TL'},
  {key: 'group3', campaign: '5.200 TL', normal: '5.750 TL'},
  {key: 'group2', campaign: '6.500 TL', normal: '6.750 TL'},
  {key: 'individual', campaign: '9.000 TL', normal: '10.500 TL'}
] as const;
