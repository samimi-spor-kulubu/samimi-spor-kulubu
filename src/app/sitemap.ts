import type {MetadataRoute} from 'next';
import {absoluteUrl, localePath, LOCALES} from '@/lib/seo';
import {BRANCHES} from '@/lib/branches';
import {TRAINERS} from '@/lib/trainers';
import {BLOG_POSTS} from '@/lib/blog';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const branchPaths = BRANCHES.map((b) => `/branslar/${b.slug}`);
  const trainerPaths = TRAINERS.map((t) => `/egitmenler/${t.slug}`);
  const blogPaths = BLOG_POSTS.map((p) => `/blog/${p.slug}`);

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
    const blogPost = BLOG_POSTS.find((p) => `/blog/${p.slug}` === path);
    return {
      url: absoluteUrl(localePath(path, 'tr')),
      lastModified: blogPost ? new Date(blogPost.date) : now,
      changeFrequency: path === '/' ? 'weekly' : 'monthly',
      priority:
        path === '/' ? 1 : path.startsWith('/blog/') ? 0.6 : 0.8,
      alternates: {languages}
    };
  });
}
