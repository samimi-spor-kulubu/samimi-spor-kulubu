import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PilatesPrices} from '@/components/branches/PilatesPrices';
import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';
import {pageMetadata} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Prices'});
  return pageMetadata({
    locale,
    path: '/fiyatlar',
    title: t('title'),
    description: t('seoDescription')
  });
}

export default async function FiyatlarPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Prices');
  const tCta = await getTranslations('Branches.detail.cta');
  const contact = await getContactInfo();

  return (
    <>
      <section className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-heading text-4xl tracking-wider text-brand-black dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-gray">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="bg-brand-surface">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="overflow-hidden rounded-2xl border-2 border-brand-border bg-white dark:bg-zinc-900">
            <PilatesPrices as="h2" className="p-6 sm:p-8" />
          </div>
        </div>
      </section>

      <section className="bg-brand-yellow">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-heading text-3xl leading-tight tracking-wider text-brand-black sm:text-4xl">
            {tCta('title')}
          </h2>
          <p className="mt-4 text-base text-brand-black/80 sm:text-lg">
            {tCta('description')}
          </p>
          <div className="mt-8">
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
