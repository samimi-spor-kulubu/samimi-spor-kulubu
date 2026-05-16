import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';
import {PlayIcon} from '@/components/icons';
import {pageMetadata} from '@/lib/seo';

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

const SECTIONS = [
  {id: 'main-hall', emoji: '🥋'},
  {id: 'archery', emoji: '🏹'},
  {id: 'gymnastics', emoji: '🤸'},
  {id: 'pilates', emoji: '🧘'},
  {id: 'locker', emoji: '🚪'}
] as const;

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
  const contact = await getContactInfo();

  return (
    <>
      {/* HERO */}
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
      <section className="bg-white">
        <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:space-y-24 sm:px-6 sm:py-20 lg:px-8">
          {SECTIONS.map(({id, emoji}, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={id}
                className={
                  'grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 ' +
                  (reversed ? 'md:[direction:rtl]' : '')
                }
              >
                {/* Photo */}
                <div className="md:[direction:ltr]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-brand-border bg-zinc-200">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300">
                      <span
                        aria-hidden="true"
                        className="text-7xl opacity-60 sm:text-8xl"
                      >
                        {emoji}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="md:[direction:ltr]">
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand-amber">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-2 font-heading text-3xl leading-tight tracking-wider text-brand-black sm:text-4xl lg:text-5xl">
                    {tSections(`${id}.title`)}
                  </h2>
                  <p className="mt-3 font-heading text-lg tracking-wide text-brand-gray">
                    {tSections(`${id}.subtitle`)}
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-brand-gray sm:text-lg">
                    {tSections(`${id}.text`)}
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
            {contact.phone.display}
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
