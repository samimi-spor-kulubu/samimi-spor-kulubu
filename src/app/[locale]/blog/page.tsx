import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {BLOG_POSTS, localizePost} from '@/lib/blog';
import {BlogClient} from '@/components/blog/BlogClient';
import {pageMetadata} from '@/lib/seo';

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

  const posts = BLOG_POSTS.map((p) => {
    const localized = localizePost(p, locale);
    // strip content from list view to keep payload small
    return {...localized, content: ''};
  }).sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      {/* HEADER */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-heading text-4xl tracking-wider text-brand-black sm:text-5xl md:text-6xl lg:text-7xl">
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
          <BlogClient posts={posts} />
        </div>
      </section>
    </>
  );
}
