import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';
import {
  ValuesAccordion,
  type AccordionItem
} from '@/components/about/ValuesAccordion';
import {pageMetadata} from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const tHero = await getTranslations({locale, namespace: 'About.hero'});
  const tAbout = await getTranslations({locale, namespace: 'About'});
  return pageMetadata({
    locale,
    path: '/hakkimizda',
    title: tHero('title'),
    description: tAbout('seoDescription')
  });
}

export default async function HakkimizdaPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations('About.hero');
  const tStory = await getTranslations('About.story');
  const tValues = await getTranslations('About.values');
  const tLocation = await getTranslations('About.location');
  const tCta = await getTranslations('About.cta');
  const tCommon = await getTranslations('Common');
  const contact = await getContactInfo();

  const storyParagraphs = (tStory.raw('paragraphs') ?? []) as string[];

  const valueIds = ['samimiyet', 'ahlak', 'guvenli'] as const;
  const items: AccordionItem[] = valueIds.map((id) => ({
    id,
    title: tValues(`items.${id}.title`),
    subtitle: tValues(`items.${id}.subtitle`),
    content: (
      <p className="text-base leading-relaxed text-brand-gray">
        {tValues(`items.${id}.text`)}
      </p>
    )
  }));

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

      {/* STORY */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-heading text-3xl tracking-wider text-brand-black dark:text-white sm:text-4xl">
            {tStory('title')}
          </h2>
          <div className="mt-6 space-y-5">
            {storyParagraphs.map((p, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-brand-gray sm:text-lg"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl tracking-wider text-brand-black dark:text-white sm:text-4xl">
              {tValues('title')}
            </h2>
            <p className="mt-3 text-brand-gray">{tValues('subtitle')}</p>
          </div>
          <div className="mt-10">
            <ValuesAccordion
              items={items}
              expandLabel={tValues('expand')}
              collapseLabel={tValues('collapse')}
            />
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-heading text-3xl tracking-wider text-brand-black dark:text-white sm:text-4xl">
            {tLocation('title')}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Info */}
            <div className="space-y-5 rounded-2xl border-2 border-brand-border bg-white dark:bg-zinc-900 p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                  {tLocation('addressLabel')}
                </p>
                <p className="mt-1 text-base font-medium text-brand-black dark:text-white">
                  {contact.address.full}
                </p>
                <a
                  href={contact.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-amber transition-colors hover:text-brand-black dark:hover:text-white"
                >
                  {tLocation('mapsCta')} →
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                  {tLocation('phoneLabel')}
                </p>
                <a
                  href={`tel:${contact.phone.tel}`}
                  className="mt-1 inline-block font-heading text-2xl tracking-wider text-brand-black dark:text-white transition-opacity hover:opacity-80"
                >
                  {contact.phone.display}
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                  {tLocation('hoursLabel')}
                </p>
                <p className="mt-1 text-base font-medium text-brand-black dark:text-white">
                  {contact.hours.days}: {contact.hours.weekdays}
                </p>
              </div>

              <a
                href={whatsAppUrl(contact, locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
              >
                {tLocation('whatsappLabel')}
              </a>
            </div>

            {/* Map embed */}
            <div className="overflow-hidden rounded-2xl border-2 border-brand-border bg-brand-surface">
              <iframe
                src={contact.address.embedUrl}
                title={tLocation('mapTitle')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full min-h-[340px] w-full"
              />
            </div>
          </div>
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
