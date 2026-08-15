import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Image from 'next/image';
import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';
import {getAllBlogPosts} from '@/lib/services/blog';
import {PlayIcon} from '@/components/icons';
import {pageMetadata} from '@/lib/seo';
import {createPublicClient} from '@/lib/supabase/public';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const tHero = await getTranslations({locale, namespace: 'Tour.hero'});
  const t = await getTranslations({locale, namespace: 'Tour'});
  return pageMetadata({
    locale,
    path: '/tesis-turu',
    title: tHero('title'),
    description: t('seoDescription')
  });
}

// Fetch gallery photos from 'tesis' category
async function getTesisPhotos() {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('gallery_items')
    .select('id, slug, title_tr, title_en, src, image')
    .eq('category', 'tesis')
    .eq('active', true)
    .order('order_index', {ascending: true});

  if (error || !data) {
    console.error('[tesis-turu] Gallery fetch error:', error);
    return [];
  }

  return data;
}

export default async function TesisTuruPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const tHero = await getTranslations('Tour.hero');
  const tVideo = await getTranslations('Tour.video');
  const tSections = await getTranslations('Tour.sections');
  const tCta = await getTranslations('Tour.cta');
  const tCommon = await getTranslations('Common');
  const contact = await getContactInfo();
  const tesisPhotos = await getTesisPhotos();

  return (
    <>
      {/* HERO */}
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

      {/* VIDEO */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-brand-border bg-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
            <div className="relative flex h-full flex-col items-center justify-center gap-4 text-center text-white">
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-yellow text-brand-black shadow-lg">
                <PlayIcon className="h-8 w-8" />
              </span>
              <p className="font-heading text-2xl tracking-wider sm:text-3xl">
                {tVideo('title')}
              </p>
              <p className="text-sm text-zinc-300">{tVideo('placeholder')}</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-brand-gray">
            {tVideo('caption')}
          </p>
        </div>
      </section>

      {/* ZIGZAG SECTIONS */}
      <section className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:space-y-24 sm:px-6 sm:py-20 lg:px-8">
          {tesisPhotos.map((photo, i) => {
            const reversed = i % 2 === 1;
            const photoTitle = locale === 'en' ? photo.title_en : photo.title_tr;
            return (
              <div
                key={photo.id}
                className={
                  'grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 ' +
                  (reversed ? 'md:[direction:rtl]' : '')
                }
              >
                {/* Photo */}
                <div className="md:[direction:ltr]">
                  {photo.src ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-brand-border bg-zinc-200 dark:bg-zinc-800">
                      <Image
                        src={photo.src}
                        alt={photoTitle || 'Tesis Fotoğrafı'}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority={i < 2}
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-brand-border bg-zinc-200 dark:bg-zinc-800">
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="md:[direction:ltr]">
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand-amber">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-2 font-heading text-3xl leading-tight tracking-wider text-brand-black dark:text-white sm:text-4xl lg:text-5xl">
                    {photoTitle}
                  </h2>
                  <p className="mt-3 font-heading text-lg tracking-wide text-brand-gray">
                    Samimi Spor Kulübü Tesisleri
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-brand-gray sm:text-lg">
                    Tesislerimiz, en modern ekipmanlarla donatılmış ve rahat ortam sağlamak için tasarlanmıştır.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-yellow">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-heading text-3xl leading-tight tracking-wider text-brand-black sm:text-4xl">
            {tCta('title')}
          </h2>
          <p className="mt-4 text-base text-brand-black/80 sm:text-lg">
            {tCta('description')}
          </p>
          <a
            href={`tel:${contact.phone.tel}`}
            className="mt-6 inline-block font-heading text-2xl tracking-wider text-brand-black transition-opacity hover:opacity-80 sm:text-3xl"
          >
            {tCommon('callNow')} — {contact.phone.display}
          </a>
          <div className="mt-6">
            <a
              href={whatsAppUrl(contact, locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-black px-8 text-base font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              {tCta('button')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
