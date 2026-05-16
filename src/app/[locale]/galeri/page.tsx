import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {GalleryClient} from '@/components/gallery/GalleryClient';
import {pageMetadata} from '@/lib/seo';
import {getAllGalleryItems} from '@/lib/services/gallery';

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
  const tCats = await getTranslations('Gallery.categories');
  const tFilter = await getTranslations('Gallery.filter');

  const items = await getAllGalleryItems(locale);

  // Distinct categories present in the DB. Known categories use the
  // localised label from messages; unknown ones (added by an admin
  // later) fall back to the raw category string.
  const uniqueCategories = Array.from(new Set(items.map((i) => i.category)));
  const categories = uniqueCategories.map((cat) => ({
    key: cat,
    label: tCats.has(cat) ? tCats(cat) : cat
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
          {items.length === 0 ? (
            <p className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-brand-border bg-white p-10 text-center text-brand-gray">
              {locale === 'en'
                ? 'No photos yet.'
                : 'Henüz fotoğraf eklenmedi.'}
            </p>
          ) : (
            <GalleryClient
              items={items}
              categories={categories}
              allLabel={tFilter('all')}
              noResultsLabel={tFilter('noResults')}
            />
          )}
        </div>
      </section>
    </>
  );
}
