import Image from 'next/image';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {contact, getWhatsAppUrl} from '@/config/contact';
import {TRAINER_BY_KEY, type TrainerKey} from '@/lib/trainers';
import {personJsonLd} from '@/lib/seo';

export async function TrainerDetail({
  trainerKey,
  locale
}: {
  trainerKey: TrainerKey;
  locale: string;
}) {
  setRequestLocale(locale);
  const trainer = TRAINER_BY_KEY.get(trainerKey);
  if (!trainer) {
    throw new Error(`Unknown trainer key: ${trainerKey}`);
  }

  const tNav = await getTranslations('Nav');
  const tDetail = await getTranslations('Trainers.detail');
  const tItems = await getTranslations('Trainers.items');
  const tBranchItems = await getTranslations('Branches.items');

  const name = tItems(`${trainer.key}.name`);
  const title = tItems(`${trainer.key}.title`);
  const about = (tItems.raw(`${trainer.key}.about`) ?? []) as string[];
  const certificates = (tItems.raw(`${trainer.key}.certificates`) ??
    []) as string[];
  const expertise = (tItems.raw(`${trainer.key}.expertise`) ?? []) as string[];
  const branchName = tBranchItems(`${trainer.branchKey}.name`);

  const schema = personJsonLd({
    locale,
    name,
    jobTitle: title,
    image: trainer.photo,
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
          <li className="font-medium text-brand-black">{name}</li>
        </ol>
      </nav>

      {/* MAIN — two-column */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-3 md:gap-12 lg:px-8">
          {/* LEFT — identity */}
          <aside className="md:col-span-1">
            <div className="md:sticky md:top-20">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-200">
                <Image
                  src={trainer.photo}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                  className="object-cover object-top"
                />
              </div>
              <h1 className="mt-6 font-heading text-4xl tracking-wider text-brand-black sm:text-5xl">
                {name}
              </h1>
              <p className="mt-2 text-base text-brand-gray">{title}</p>

              <div className="mt-6 rounded-2xl border-2 border-brand-border bg-brand-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                  {tDetail('branchLabel')}
                </p>
                <p className="mt-1 font-heading text-xl tracking-wider text-brand-black">
                  {branchName}
                </p>
                <Link
                  href={`/branslar/${trainer.branchSlug}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-amber transition-colors hover:text-brand-black"
                >
                  {tDetail('branchLink')} →
                </Link>
              </div>

              <a
                href={getWhatsAppUrl(contact.whatsapp.messages.rezervasyon)}
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
              {about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {certificates.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-2xl tracking-wider text-brand-black">
                  {tDetail('certificatesLabel')}
                </h2>
                <ul className="mt-4 space-y-3">
                  {certificates.map((c, i) => (
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

            {expertise.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-2xl tracking-wider text-brand-black">
                  {tDetail('expertiseLabel')}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {expertise.map((e, i) => (
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
