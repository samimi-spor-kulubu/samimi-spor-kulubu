import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {GalleryClient} from '@/components/gallery/GalleryClient';
import {pageMetadata} from '@/lib/seo';
import {getAllGalleryItems} from '@/lib/services/gallery';
import {GALLERY_CATEGORIES} from '@/lib/constants/categories';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const tHero = await getTranslations({locale, namespace: 'Gallery.hero'});
  const t = await getTranslations({locale, namespace: 'Gallery'});
  return pageMetadata({
    locale,
    path: '/galeri',
    title: tHero('title'),
    description: t('seoDescription')
  });
}

export default async function GaleriPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations('Gallery.hero');
  const tFilter = await getTranslations('Gallery.filter');

  const items = await getAllGalleryItems(locale);

  // Fixed category list — every slug is always rendered as a pill on
  // /galeri regardless of how many photos exist in that bucket. The
  // client uses each category's `matchers` array to filter robustly
  // across legacy English slugs (boxing/archery/…) and new TR slugs.
  const categories = GALLERY_CATEGORIES.map((c) => ({
    slug: c.slug,
    label: locale === 'en' ? c.label_en : c.label_tr,
    matchers: [c.slug, ...c.aliases]
  }));

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

      {/* GALLERY */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <GalleryClient
            items={items}
            categories={categories}
            allLabel={tFilter('all')}
            noResultsLabel={tFilter('noResults')}
            emptyLabel={
              locale === 'en'
                ? 'No photos yet.'
                : 'Henüz fotoğraf eklenmedi.'
            }
          />
        </div>
      </section>
    </>
  );
}
