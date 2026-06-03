import type {MetadataRoute} from 'next';

import {absoluteUrl, localePath, LOCALES} from '@/lib/seo';
import {getAllBranchSlugs} from '@/lib/services/branches';
import {getAllTrainerSlugs} from '@/lib/services/trainers';
import {getAllPublicBlogSitemapEntries} from '@/lib/services/blog';

type ChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

type Entry = {
  path: string;
  lastModified: Date;
  changeFrequency: ChangeFreq;
  priority: number;
};

const STATIC_ENTRIES: Omit<Entry, 'lastModified'>[] = [
  {path: '/', changeFrequency: 'weekly', priority: 1.0},
  {path: '/branslar', changeFrequency: 'monthly', priority: 0.9},
  {path: '/egitmenler', changeFrequency: 'monthly', priority: 0.7},
  {path: '/galeri', changeFrequency: 'monthly', priority: 0.7},
  {path: '/blog', changeFrequency: 'weekly', priority: 0.8},
  {path: '/hakkimizda', changeFrequency: 'monthly', priority: 0.7},
  {path: '/iletisim', changeFrequency: 'monthly', priority: 0.7},
  {path: '/sss', changeFrequency: 'monthly', priority: 0.7},
  {path: '/tesis-turu', changeFrequency: 'monthly', priority: 0.7}
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [branchSlugs, trainerSlugs, blogEntries] = await Promise.all([
    getAllBranchSlugs(),
    getAllTrainerSlugs(),
    getAllPublicBlogSitemapEntries()
  ]);

  const entries: Entry[] = [
    ...STATIC_ENTRIES.map((e) => ({...e, lastModified: now})),
    ...branchSlugs.map((slug) => ({
      path: `/branslar/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9
    })),
    ...trainerSlugs.map((slug) => ({
      path: `/egitmenler/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7
    })),
    ...blogEntries.map(({slug, updatedAt}) => ({
      path: `/blog/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  ];

  return entries.map(({path, lastModified, changeFrequency, priority}) => ({
    url: absoluteUrl(localePath(path, 'tr')),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, absoluteUrl(localePath(path, l))])
      )
    }
  }));
}
