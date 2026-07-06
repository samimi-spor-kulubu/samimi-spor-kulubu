import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {pageMetadata} from '@/lib/seo';
import {getAllBranches} from '@/lib/services/branches';
import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';
import {getAllTrainers, getBranchesByTrainer} from '@/lib/services/trainers';
import {TrainerPhotoPlaceholder} from '@/components/trainers/TrainerPhotoPlaceholder';
import {
  HomeFaqAccordion,
  type HomeFaqItem
} from '@/components/faq/HomeFaqAccordion';
import {
  AwardIcon,
  ClockIcon,
  HeartIcon,
  LayersIcon,
  MapPinIcon
} from '@/components/icons';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const tSite = await getTranslations({locale, namespace: 'Site'});
  const tHome = await getTranslations({locale, namespace: 'Home'});
  return pageMetadata({
    locale,
    path: '/',
    title: tSite('name'),
    description: tHome('seoDescription')
  });
}

type StatKey = 'branches' | 'hours' | 'whatsapp';
const STATS: {key: StatKey; prefixKey?: string; valueKey: string; labelKey: string}[] = [
  {key: 'branches', valueKey: 'branchesValue', labelKey: 'branchesLabel'},
  {
    key: 'hours',
    prefixKey: 'hoursPrefix',
    valueKey: 'hoursValue',
    labelKey: 'hoursLabel'
  },
  {key: 'whatsapp', valueKey: 'whatsappValue', labelKey: 'whatsappLabel'}
];

const WHY_ITEMS = [
  {key: 'community', Icon: HeartIcon},
  {key: 'trainers', Icon: AwardIcon},
  {key: 'variety', Icon: LayersIcon},
  {key: 'location', Icon: MapPinIcon},
  {key: 'hours', Icon: ClockIcon}
] as const;

const FAQ_ITEMS = ['beginner', 'pilatesWomen', 'ageGroups'] as const;

export default async function Home({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const tTrainerLabels = await getTranslations('Trainers.labels');
  const tCommon = await getTranslations('Common');
  const [contact, branches, trainers, branchesByTrainer] = await Promise.all([
    getContactInfo(),
    getAllBranches(locale),
    getAllTrainers(locale),
    getBranchesByTrainer(locale)
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white dark:bg-zinc-900">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
          <div>
            <p className="font-heading text-base tracking-widest text-brand-gray sm:text-lg">
              {t.rich('hero.subtitle', {
                yellow: (chunks) => (
                  <span className="gold-shimmer">{chunks}</span>
                )
              })}
            </p>
            <h1
              data-tour="hero"
              className="mt-4 font-heading text-4xl leading-[0.95] tracking-wide text-brand-black dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {t.rich('hero.title', {
                cyan: (chunks) => (
                  <span className="text-brand-cyan">{chunks}</span>
                )
              })}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-gray">
              {t('hero.description')}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={whatsAppUrl(contact, locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand-yellow px-8 text-base font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
              >
                {t('hero.ctaPrimary')}
              </a>
              <Link
                href="/branslar"
                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-black px-8 text-base font-semibold text-brand-black dark:text-white transition-colors hover:bg-brand-black hover:text-white"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* Dekoratif geometrik alan */}
          <div className="relative hidden h-[460px] lg:block" aria-hidden="true">
            <div className="absolute right-4 top-4 h-72 w-72 rounded-full bg-brand-yellow" />
            <div className="absolute right-40 bottom-6 h-44 w-44 rounded-3xl bg-brand-black" />
            <div className="absolute left-8 bottom-24 h-28 w-28 rotate-12 rounded-2xl border-4 border-brand-yellow-dark" />
            <div className="absolute left-44 top-8 h-20 w-20 rounded-full border-4 border-brand-black" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-brand-border bg-brand-surface">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3 sm:gap-10 sm:px-6 lg:gap-12 lg:px-8">
          {STATS.map(({key, prefixKey, valueKey, labelKey}) => (
            <div key={key} className="text-center">
              {/* Prefix row — rendered as an invisible spacer for stats
                  that don't use it so the big value lines up across all
                  three columns on desktop. */}
              <p
                className={`text-xs font-semibold uppercase tracking-widest text-brand-gray sm:text-sm ${
                  prefixKey ? '' : 'invisible'
                }`}
                aria-hidden={prefixKey ? undefined : true}
              >
                {prefixKey ? t(`stats.${prefixKey}`) : '·'}
              </p>
              <p className="mt-1 font-heading text-3xl leading-tight tracking-wider text-brand-amber sm:text-4xl">
                {t(`stats.${valueKey}`)}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-brand-gray sm:text-sm">
                {t(`stats.${labelKey}`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BRANCHES */}
      <section className="bg-white dark:bg-zinc-900" data-tour="branches">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-4xl tracking-wider text-brand-black dark:text-brand-cyan sm:text-5xl">
              {t('branches.title')}
            </h2>
            <p className="mt-3 text-brand-gray">{t('branches.subtitle')}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((b) => (
              <Link
                key={b.slug}
                href={`/branslar/${b.slug}`}
                className="group rounded-2xl border-2 border-brand-border bg-white dark:bg-zinc-900 p-6 transition-all hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg active:scale-[0.98] active:border-brand-yellow active:bg-brand-yellow/5"
              >
                <div className="text-4xl" aria-hidden="true">
                  {b.emoji ?? '🏅'}
                </div>
                <h3 className="mt-4 font-heading text-2xl tracking-wider text-brand-black dark:text-white">
                  {b.name}
                </h3>
                <p className="mt-2 text-sm text-brand-gray">{b.schedule}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-4xl tracking-wider text-brand-black dark:text-brand-cyan sm:text-5xl">
              {t('why.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-brand-gray">
              {t('why.subtitle')}
            </p>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {WHY_ITEMS.map(({key, Icon}) => (
              <li
                key={key}
                className="flex flex-col items-center rounded-2xl border-2 border-brand-border bg-white dark:bg-zinc-900 p-6 text-center transition-colors hover:border-brand-yellow"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-brand-black">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-heading text-xl tracking-wider text-brand-black dark:text-white">
                  {t(`why.items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                  {t(`why.items.${key}.text`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TRAINERS */}
      <section className="bg-white dark:bg-zinc-900" data-tour="trainers">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-4xl tracking-wider text-brand-black dark:text-brand-cyan sm:text-5xl">
              {t('trainers.title')}
            </h2>
            <p className="mt-3 text-brand-gray">{t('trainers.subtitle')}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5 lg:gap-8">
            {trainers.map((tr) => {
              const trainerBranches = branchesByTrainer.get(tr.id) ?? [];
              return (
                <Link
                  key={tr.id}
                  href={`/egitmenler/${tr.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border-2 border-brand-border bg-white dark:bg-zinc-900 transition-all hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg active:scale-[0.98] active:border-brand-yellow active:bg-brand-yellow/5"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    {tr.photo ? (
                      <Image
                        src={tr.photo}
                        alt={tr.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <TrainerPhotoPlaceholder label={tr.name} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-xl leading-tight tracking-wider text-brand-black dark:text-white sm:text-2xl">
                      {tr.name}
                    </h3>
                    {tr.title && (
                      <p className="mt-1 text-sm text-brand-gray">{tr.title}</p>
                    )}
                    {trainerBranches.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {trainerBranches.map((b) => (
                          <span
                            key={b.slug}
                            className="inline-flex items-center rounded-full bg-brand-yellow/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-amber"
                          >
                            {b.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {tr.shortBio && (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-brand-gray">
                        {tr.shortBio}
                      </p>
                    )}
                    <span className="mt-auto pt-4 text-sm font-semibold text-brand-black dark:text-white underline-offset-4 group-hover:underline">
                      {tTrainerLabels('profileLink')} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FACILITY TOUR CTA */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/tesis-turu"
            className="group grid grid-cols-1 overflow-hidden rounded-3xl border-2 border-brand-border bg-white dark:bg-zinc-900 transition-all hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg active:scale-[0.99] active:border-brand-yellow active:bg-brand-yellow/5 md:grid-cols-2"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-zinc-200 to-zinc-300 md:aspect-auto md:min-h-[280px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="text-7xl opacity-60 transition-transform duration-300 group-hover:scale-110 sm:text-8xl"
                >
                  🏟️
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <span className="text-sm font-semibold uppercase tracking-widest text-brand-amber">
                {t('tour.eyebrow')}
              </span>
              <h2 className="mt-3 font-heading text-3xl leading-tight tracking-wider text-brand-black dark:text-brand-cyan sm:text-4xl">
                {t('tour.title')}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-brand-gray">
                {t('tour.description')}
              </p>
              <span className="mt-6 inline-flex h-12 items-center justify-center self-start rounded-full bg-brand-yellow px-7 text-sm font-semibold text-brand-black transition-colors group-hover:bg-brand-yellow-dark">
                {t('tour.button')} →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-4xl tracking-wider text-brand-black dark:text-brand-cyan sm:text-5xl">
              {t('faq.title')}
            </h2>
            <p className="mt-3 text-brand-gray">{t('faq.subtitle')}</p>
          </div>
          <HomeFaqAccordion
            items={FAQ_ITEMS.map<HomeFaqItem>((key) => ({
              id: key,
              question: t(`faq.items.${key}.question`),
              answer: t(`faq.items.${key}.answer`)
            }))}
          />
          <div className="mt-10 text-center">
            <Link
              href="/sss"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-black px-8 text-base font-semibold text-brand-black dark:text-white transition-colors hover:bg-brand-black hover:text-white"
            >
              {t('faq.cta')} →
            </Link>
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="bg-brand-yellow">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-heading text-3xl leading-tight tracking-wider text-brand-black sm:text-5xl">
            {t('cta.title')}
          </h2>
          <p className="mt-4 text-base text-brand-black/80 sm:text-lg">
            {t('cta.description')}
          </p>
          <a
            href={`tel:${contact.phone.tel}`}
            className="mt-6 inline-block font-heading text-3xl tracking-wider text-brand-black transition-opacity hover:opacity-80 sm:text-4xl"
          >
            {tCommon('callNow')} — {contact.phone.display}
          </a>
          <div className="mt-8">
            <a
              href={whatsAppUrl(contact, locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-black px-8 text-base font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              {t('cta.button')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
