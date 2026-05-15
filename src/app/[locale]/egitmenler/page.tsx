import type {Metadata} from 'next';
import Image from 'next/image';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {contact, getWhatsAppUrl} from '@/config/contact';
import {TRAINERS} from '@/lib/trainers';
import {pageMetadata} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Trainers.hero'});
  return pageMetadata({
    locale,
    path: '/egitmenler',
    title: t('title'),
    description: t('subtitle')
  });
}

export default async function TrainersPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const tHero = await getTranslations('Trainers.hero');
  const tLabels = await getTranslations('Trainers.labels');
  const tCta = await getTranslations('Trainers.cta');
  const tItems = await getTranslations('Trainers.items');

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

      {/* TRAINER CARDS */}
      <section className="bg-brand-surface">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 lg:px-8">
          {TRAINERS.map(({key, slug, photo}, idx) => (
            <Link
              key={key}
              href={`/egitmenler/${slug}`}
              className="group overflow-hidden rounded-2xl border-2 border-brand-border bg-white transition-all hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg"
            >
              <div className="relative h-96 w-full overflow-hidden bg-zinc-200">
                <Image
                  src={photo}
                  alt={tItems(`${key}.name`)}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="font-heading text-2xl tracking-wider text-brand-black">
                  {tItems(`${key}.name`)}
                </h2>
                <p className="mt-1 text-sm text-brand-gray">
                  {tItems(`${key}.title`)}
                </p>
                <span className="mt-5 inline-flex h-11 items-center justify-center rounded-full border-2 border-brand-black px-6 text-sm font-semibold text-brand-black transition-colors group-hover:bg-brand-black group-hover:text-white">
                  {tLabels('profileLink')} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHATSAPP CTA */}
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
              href={getWhatsAppUrl(contact.whatsapp.messages.bilgi)}
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
