import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {contact, getWhatsAppUrl} from '@/config/contact';
import {BRANCHES} from '@/lib/branches';
import {PilatesPrices} from '@/components/branches/PilatesPrices';
import {pageMetadata} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Branches.hero'});
  return pageMetadata({
    locale,
    path: '/branslar',
    title: t('title'),
    description: t('subtitle')
  });
}

export default async function BranchesPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const tHero = await getTranslations('Branches.hero');
  const tLabels = await getTranslations('Branches.labels');
  const tCta = await getTranslations('Branches.cta');
  const tItems = await getTranslations('Branches.items');

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

      {/* BRANCH CARDS */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
          {BRANCHES.map(({key, slug, emoji}) => {
            const isPilates = key === 'pilates';
            return (
              <article
                key={key}
                className="overflow-hidden rounded-2xl border-2 border-brand-border bg-white transition-colors hover:border-brand-yellow"
              >
                <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-start md:gap-8">
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-surface text-4xl"
                    aria-hidden="true"
                  >
                    {emoji}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-heading text-2xl tracking-wider text-brand-black sm:text-3xl">
                        {tItems(`${key}.name`)}
                      </h2>
                      {isPilates && (
                        <span className="inline-flex items-center rounded-full bg-brand-yellow px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-black">
                          {tLabels('womenOnly')}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-brand-yellow-dark">
                      {tItems(`${key}.schedule`)}
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-brand-gray">
                      {tItems(`${key}.description`)}
                    </p>
                  </div>

                  <Link
                    href={`/branslar/${slug}`}
                    className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-full border-2 border-brand-black px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black hover:text-white md:self-center"
                  >
                    {tLabels('detailLink')} →
                  </Link>
                </div>

                {isPilates && (
                  <PilatesPrices className="border-t-2 border-brand-border bg-brand-surface px-6 py-6 sm:px-8" />
                )}
              </article>
            );
          })}
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
