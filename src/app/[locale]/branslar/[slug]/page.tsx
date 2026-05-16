import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/navigation';
import {contact, getWhatsAppUrl} from '@/config/contact';
import {BRANCHES, BRANCH_BY_SLUG, type BranchSlug} from '@/lib/branches';
import {PilatesPrices} from '@/components/branches/PilatesPrices';
import {pageMetadata, serviceJsonLd} from '@/lib/seo';

export function generateStaticParams() {
  return BRANCHES.map((b) => ({slug: b.slug}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const branch = BRANCH_BY_SLUG.get(slug as BranchSlug);
  if (!branch) return {};
  const t = await getTranslations({locale, namespace: 'Branches.items'});
  return pageMetadata({
    locale,
    path: `/branslar/${slug}`,
    title: t(`${branch.key}.name`),
    description: t(`${branch.key}.seoDescription`)
  });
}

export default async function BranchDetailPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const branch = BRANCH_BY_SLUG.get(slug as BranchSlug);
  if (!branch) notFound();

  const tNav = await getTranslations('Nav');
  const tDetail = await getTranslations('Branches.detail');
  const tDetailCta = await getTranslations('Branches.detail.cta');
  const tItems = await getTranslations('Branches.items');
  const tLabels = await getTranslations('Branches.labels');

  const features = (tItems.raw(`${branch.key}.features`) ?? []) as string[];
  const instructor = tItems(`${branch.key}.instructor`);
  const isPilates = branch.key === 'pilates';
  const name = tItems(`${branch.key}.name`);
  const description = tItems(`${branch.key}.description`);
  const schema = serviceJsonLd({locale, name, description, slug: branch.slug});

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
            <Link href="/" className="transition-colors hover:text-brand-black">
              {tNav('home')}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link
              href="/branslar"
              className="transition-colors hover:text-brand-black"
            >
              {tNav('branches')}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="font-medium text-brand-black">{name}</li>
        </ol>
      </nav>

      {/* MAIN — two-column */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-3 md:gap-12 lg:px-8">
          {/* LEFT */}
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-5xl" aria-hidden="true">
                {branch.emoji}
              </span>
              {isPilates && (
                <span className="inline-flex items-center rounded-full bg-brand-yellow px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-black">
                  {tLabels('womenOnly')}
                </span>
              )}
            </div>
            <h1 className="mt-4 font-heading text-4xl leading-[0.95] tracking-wider text-brand-black sm:text-5xl md:text-6xl lg:text-7xl">
              {name.toLocaleUpperCase(locale)}
            </h1>
            <p className="mt-4 text-base font-semibold text-brand-amber sm:text-lg">
              {tItems(`${branch.key}.scheduleLong`)}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-brand-gray">
              {tItems(`${branch.key}.longDescription`)}
            </p>

            {/* Features */}
            <div className="mt-10">
              <h2 className="font-heading text-2xl tracking-wider text-brand-black">
                {tDetail('featuresLabel')}
              </h2>
              <ul className="mt-4 space-y-3">
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-base text-brand-black"
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

            {/* Instructor */}
            {instructor && (
              <div className="mt-10">
                <h2 className="font-heading text-2xl tracking-wider text-brand-black">
                  {tDetail('instructorLabel')}
                </h2>
                <p className="mt-3 text-base text-brand-gray">{instructor}</p>
              </div>
            )}

            {/* Pilates prices */}
            {isPilates && (
              <PilatesPrices
                as="h2"
                className="mt-10 rounded-2xl border-2 border-brand-border bg-brand-surface p-6 sm:p-8"
              />
            )}
          </div>

          {/* RIGHT — info box */}
          <aside className="md:col-span-1">
            <div className="rounded-2xl border-2 border-brand-black bg-white p-6 shadow-sm md:sticky md:top-20">
              <h3 className="font-heading text-xl tracking-wider text-brand-black">
                {tDetail('infoBoxTitle')}
              </h3>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                  {tDetail('scheduleLabel')}
                </p>
                <p className="mt-1 text-base font-medium text-brand-black">
                  {tItems(`${branch.key}.scheduleLong`)}
                </p>
              </div>

              {instructor && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                    {tDetail('instructorLabel')}
                  </p>
                  <p className="mt-1 text-base font-medium text-brand-black">
                    {instructor}
                  </p>
                </div>
              )}

              <a
                href={getWhatsAppUrl(contact.whatsapp.messages.rezervasyon)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
              >
                {tDetail('bookButton')}
              </a>
              <a
                href={`tel:${contact.phone.tel}`}
                className="mt-3 block text-center text-sm text-brand-gray transition-colors hover:text-brand-black"
              >
                {contact.phone.display}
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
              href={getWhatsAppUrl(contact.whatsapp.messages.rezervasyon)}
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
