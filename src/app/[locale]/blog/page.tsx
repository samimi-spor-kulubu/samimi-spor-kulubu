import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {BlogClient} from '@/components/blog/BlogClient';
import {pageMetadata} from '@/lib/seo';
import {getAllBlogPosts} from '@/lib/services/blog';
import {
  BLOG_CATEGORIES,
  blogCategoryLabel
} from '@/lib/constants/blog-categories';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const tHero = await getTranslations({locale, namespace: 'Blog.hero'});
  const t = await getTranslations({locale, namespace: 'Blog'});
  return pageMetadata({
    locale,
    path: '/blog',
    title: tHero('title'),
    description: t('seoDescription')
  });
}

export default async function BlogPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const tHero = await getTranslations('Blog.hero');

  const posts = await getAllBlogPosts(locale);

  const categories = BLOG_CATEGORIES.map((c) => ({
    slug: c.slug,
    label: locale === 'en' ? c.label_en : c.label_tr,
    matchers: [c.slug, ...c.aliases]
  }));

  // Per-post category label (handles legacy aliases gracefully).
  const categoryLabelMap: Record<string, string> = {};
  for (const post of posts) {
    if (!categoryLabelMap[post.category]) {
      categoryLabelMap[post.category] = blogCategoryLabel(
        post.category,
        locale
      );
    }
  }

  return (
    <>
      {/* HEADER */}
      <section className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-heading text-4xl tracking-wider text-brand-black dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {tHero('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-gray">
            {tHero('subtitle')}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <BlogClient
            posts={posts}
            categories={categories}
            categoryLabels={categoryLabelMap}
          />
        </div>
      </section>
    </>
  );
}
