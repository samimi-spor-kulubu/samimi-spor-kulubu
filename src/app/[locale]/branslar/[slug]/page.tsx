import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/navigation';
import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';
import {PilatesPrices} from '@/components/branches/PilatesPrices';
import {pageMetadata, serviceJsonLd} from '@/lib/seo';
import {
  getAllBranchSlugs,
  getBranchBySlug
} from '@/lib/services/branches';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllBranchSlugs();
  return slugs.map((slug) => ({slug}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const branch = await getBranchBySlug(slug, locale);
  if (!branch) return {};
  return pageMetadata({
    locale,
    path: `/branslar/${slug}`,
    title: branch.name,
    description: branch.shortDescription ?? branch.description ?? branch.name
  });
}

export default async function BranchDetailPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const branch = await getBranchBySlug(slug, locale);
  if (!branch) notFound();

  const tNav = await getTranslations('Nav');
  const tDetail = await getTranslations('Branches.detail');
  const tDetailCta = await getTranslations('Branches.detail.cta');
  const tLabels = await getTranslations('Branches.labels');
  const tCommon = await getTranslations('Common');
  const contact = await getContactInfo();

  const schema = serviceJsonLd({
    locale,
    name: branch.name,
    description: branch.shortDescription ?? branch.description ?? branch.name,
    slug: branch.slug
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
      />
      {/* BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-brand-border bg-brand-surface"
      >
        <ol className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 text-sm text-brand-gray sm:px-6 lg:px-8">
          <li>
            <Link href="/" className="transition-colors hover:text-brand-black dark:hover:text-white">
              {tNav('home')}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link
              href="/branslar"
              className="transition-colors hover:text-brand-black dark:hover:text-white"
            >
              {tNav('branches')}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="font-medium text-brand-black dark:text-white">{branch.name}</li>
        </ol>
      </nav>

      {/* MAIN — two-column */}
      <section className="bg-white dark:bg-zinc-900">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-3 md:gap-12 lg:px-8">
          {/* LEFT */}
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              {branch.emoji && (
                <span className="text-5xl" aria-hidden="true">
                  {branch.emoji}
                </span>
              )}
              {branch.women_only && (
                <span className="inline-flex items-center rounded-full bg-brand-yellow px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-black">
                  {tLabels('womenOnly')}
                </span>
              )}
            </div>
            {branch.slug === 'reformer-pilates' && (
              <div className="mt-5 inline-flex items-center rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-bold tracking-wide text-brand-black shadow-md sm:text-base">
                {tDetail('freeTrialBadge')}
              </div>
            )}
            <h1 className="mt-4 font-heading text-4xl leading-[0.95] tracking-wider text-brand-black dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {branch.name.toLocaleUpperCase(locale)}
            </h1>
            {branch.scheduleLong && (
              <p className="mt-4 text-base font-semibold text-brand-amber sm:text-lg">
                {branch.scheduleLong}
              </p>
            )}
            {branch.description && (
              <p className="mt-6 text-lg leading-relaxed text-brand-gray">
                {branch.description}
              </p>
            )}

            {/* Features */}
            {branch.features.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-2xl tracking-wider text-brand-black dark:text-white">
                  {tDetail('featuresLabel')}
                </h2>
                <ul className="mt-4 space-y-3">
                  {branch.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-base text-brand-black dark:text-white"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-sm font-bold text-brand-black"
                      >
                        ✓
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor */}
            {branch.instructor && (
              <div className="mt-10">
                <h2 className="font-heading text-2xl tracking-wider text-brand-black dark:text-white">
                  {tDetail('instructorLabel')}
                </h2>
                <p className="mt-3 text-base text-brand-gray">
                  {branch.instructor.name}
                  {branch.instructor.title ? ` — ${branch.instructor.title}` : ''}
                </p>
              </div>
            )}

            {/* Pilates prices */}
            {branch.women_only && (
              <PilatesPrices
                as="h2"
                className="mt-10 rounded-2xl border-2 border-brand-border bg-brand-surface p-6 sm:p-8"
                packages={branch.price_info?.packages ?? null}
              />
            )}
          </div>

          {/* RIGHT — info box */}
          <aside className="md:col-span-1">
            <div className="rounded-2xl border-2 border-brand-black bg-white dark:bg-zinc-900 p-6 shadow-sm md:sticky md:top-20">
              <h3 className="font-heading text-xl tracking-wider text-brand-black dark:text-white">
                {tDetail('infoBoxTitle')}
              </h3>

              {branch.scheduleLong && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                    {tDetail('scheduleLabel')}
                  </p>
                  <p className="mt-1 text-base font-medium text-brand-black dark:text-white">
                    {branch.scheduleLong}
                  </p>
                </div>
              )}

              {branch.instructor && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                    {tDetail('instructorLabel')}
                  </p>
                  <p className="mt-1 text-base font-medium text-brand-black dark:text-white">
                    {branch.instructor.name}
                  </p>
                </div>
              )}

              <a
                href={whatsAppUrl(contact, locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
              >
                {tDetail('bookButton')}
              </a>
              <a
                href={`tel:${contact.phone.tel}`}
                className="mt-3 block text-center text-sm text-brand-gray transition-colors hover:text-brand-black dark:hover:text-white"
              >
                {tCommon('callNow')} — {contact.phone.display}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-brand-yellow">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-heading text-3xl leading-tight tracking-wider text-brand-black sm:text-4xl">
            {tDetailCta('title')}
          </h2>
          <p className="mt-4 text-base text-brand-black/80 sm:text-lg">
            {tDetailCta('description')}
          </p>
          <div className="mt-8">
            <a
              href={whatsAppUrl(contact, locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-black px-8 text-base font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              {tDetailCta('button')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
