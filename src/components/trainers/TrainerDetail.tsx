import Image from 'next/image';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {personJsonLd} from '@/lib/seo';
import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';
import type {LocalizedTrainer} from '@/lib/services/trainers';

export type TrainerBranchInfo = {
  name: string;
  slug: string;
};

export async function TrainerDetail({
  trainer,
  branch,
  locale
}: {
  trainer: LocalizedTrainer;
  branch: TrainerBranchInfo | null;
  locale: string;
}) {
  setRequestLocale(locale);

  const tNav = await getTranslations('Nav');
  const tDetail = await getTranslations('Trainers.detail');
  const contact = await getContactInfo();
  const reservationWaUrl = whatsAppUrl(contact, locale);

  const schema = personJsonLd({
    locale,
    name: trainer.name,
    jobTitle: trainer.title ?? '',
    image: trainer.photo ?? undefined,
    slug: trainer.slug
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
            <Link href="/" className="transition-colors hover:text-brand-black">
              {tNav('home')}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link
              href="/egitmenler"
              className="transition-colors hover:text-brand-black"
            >
              {tNav('trainers')}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="font-medium text-brand-black">{trainer.name}</li>
        </ol>
      </nav>

      {/* MAIN — two-column */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-3 md:gap-12 lg:px-8">
          {/* LEFT — identity */}
          <aside className="md:col-span-1">
            <div className="md:sticky md:top-20">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-200">
                {trainer.photo && (
                  <Image
                    src={trainer.photo}
                    alt={trainer.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                    className="object-cover object-top"
                  />
                )}
              </div>
              <h1 className="mt-6 font-heading text-4xl tracking-wider text-brand-black sm:text-5xl">
                {trainer.name}
              </h1>
              {trainer.title && (
                <p className="mt-2 text-base text-brand-gray">{trainer.title}</p>
              )}

              {branch && (
                <div className="mt-6 rounded-2xl border-2 border-brand-border bg-brand-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                    {tDetail('branchLabel')}
                  </p>
                  <p className="mt-1 font-heading text-xl tracking-wider text-brand-black">
                    {branch.name}
                  </p>
                  <Link
                    href={`/branslar/${branch.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-amber transition-colors hover:text-brand-black"
                  >
                    {tDetail('branchLink')} →
                  </Link>
                </div>
              )}

              <a
                href={reservationWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
              >
                {tDetail('bookButton')}
              </a>
            </div>
          </aside>

          {/* RIGHT — about + cert + expertise */}
          <div className="md:col-span-2">
            <h2 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
              {tDetail('aboutLabel')}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-gray">
              {trainer.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {trainer.certifications.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-2xl tracking-wider text-brand-black">
                  {tDetail('certificatesLabel')}
                </h2>
                <ul className="mt-4 space-y-3">
                  {trainer.certifications.map((c, i) => (
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
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {trainer.specialties.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-2xl tracking-wider text-brand-black">
                  {tDetail('expertiseLabel')}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {trainer.specialties.map((e, i) => (
                    <li
                      key={i}
                      className="rounded-full border-2 border-brand-border bg-brand-surface px-4 py-1.5 text-sm font-medium text-brand-black"
                    >
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
