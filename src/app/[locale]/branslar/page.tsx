import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';
import {pageMetadata} from '@/lib/seo';
import {getAllBranches} from '@/lib/services/branches';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const tHero = await getTranslations({locale, namespace: 'Branches.hero'});
  const t = await getTranslations({locale, namespace: 'Branches'});
  return pageMetadata({
    locale,
    path: '/branslar',
    title: tHero('title'),
    description: t('seoDescription')
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
  const tCommon = await getTranslations('Common');

  const branches = await getAllBranches(locale);
  const contact = await getContactInfo();

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

      {/* BRANCH CARDS */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
          {branches.map((b) => (
            <article
              key={b.id}
              className="overflow-hidden rounded-2xl border-2 border-brand-border bg-white dark:bg-zinc-900 transition-colors hover:border-brand-yellow active:border-brand-yellow active:bg-brand-yellow/5"
            >
              <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-start md:gap-8">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-surface text-4xl"
                  aria-hidden="true"
                >
                  {b.emoji}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-heading text-2xl tracking-wider text-brand-black dark:text-white sm:text-3xl">
                      {b.name}
                    </h2>
                    {b.women_only && (
                      <span className="inline-flex items-center rounded-full bg-brand-yellow px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-black">
                        {tLabels('womenOnly')}
                      </span>
                    )}
                  </div>
                  {b.schedule && (
                    <p className="mt-2 text-sm font-medium text-brand-amber">
                      {b.schedule}
                    </p>
                  )}
                  {b.shortDescription && (
                    <p className="mt-3 text-base leading-relaxed text-brand-gray">
                      {b.shortDescription}
                    </p>
                  )}
                </div>

                <Link
                  href={`/branslar/${b.slug}`}
                  className="inline-flex h-11 shrink-0 items-center justify-center self-start rounded-full border-2 border-brand-black px-6 text-sm font-semibold text-brand-black dark:text-white transition-colors hover:bg-brand-black hover:text-white md:self-center"
                >
                  {tLabels('detailLink')} →
                </Link>
              </div>
            </article>
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
