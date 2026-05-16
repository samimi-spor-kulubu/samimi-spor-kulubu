import type {MetadataRoute} from 'next';

import {absoluteUrl, localePath, LOCALES} from '@/lib/seo';
import {getAllBranchSlugs} from '@/lib/services/branches';
import {getAllTrainerSlugs} from '@/lib/services/trainers';
import {getAllPublicBlogSlugs} from '@/lib/services/blog';

const STATIC_PATHS = [
  '/',
  '/branslar',
  '/egitmenler',
  '/galeri',
  '/blog',
  '/hakkimizda',
  '/iletisim',
  '/sss',
  '/tesis-turu'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [branchSlugs, trainerSlugs, blogSlugs] = await Promise.all([
    getAllBranchSlugs(),
    getAllTrainerSlugs(),
    getAllPublicBlogSlugs()
  ]);

  const branchPaths = branchSlugs.map((s) => `/branslar/${s}`);
  const trainerPaths = trainerSlugs.map((s) => `/egitmenler/${s}`);
  const blogPaths = blogSlugs.map((s) => `/blog/${s}`);

  const allPaths = [
    ...STATIC_PATHS,
    ...branchPaths,
    ...trainerPaths,
    ...blogPaths
  ];

  return allPaths.map((path) => {
    const languages = Object.fromEntries(
      LOCALES.map((l) => [l, absoluteUrl(localePath(path, l))])
    );
    return {
      url: absoluteUrl(localePath(path, 'tr')),
      lastModified: now,
      changeFrequency: path === '/' ? 'weekly' : 'monthly',
      priority: path === '/' ? 1 : path.startsWith('/blog/') ? 0.6 : 0.8,
      alternates: {languages}
    };
  });
}
