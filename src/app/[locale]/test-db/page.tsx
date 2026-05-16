/**
 * Phase 2 sanity check. Hits Supabase from a Server Component and
 * dumps the result so we can verify env vars + RLS + service mapping
 * before wiring real pages to the DB.
 *
 * Remove this route once the real pages are migrated.
 */
import {setRequestLocale} from 'next-intl/server';

import {getAllBranches} from '@/lib/services/branches';
import {getAllTrainers} from '@/lib/services/trainers';
import {getAllFaqs} from '@/lib/services/faqs';
import {getAllSettings} from '@/lib/services/settings';

export const dynamic = 'force-dynamic';

export default async function TestDbPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const [branches, trainers, faqs, settings] = await Promise.all([
    getAllBranches(locale),
    getAllTrainers(locale),
    getAllFaqs(locale),
    getAllSettings()
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 p-8">
      <header>
        <h1 className="font-heading text-3xl tracking-wider text-brand-black">
          Supabase Bağlantı Testi
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Locale: <strong>{locale}</strong> · Bu sayfa yalnızca geliştirme
          doğrulaması içindir.
        </p>
      </header>

      <Section
        title={`Branches (${branches.length})`}
        empty={branches.length === 0}
      >
        <ul className="space-y-3">
          {branches.map((b) => (
            <li
              key={b.id}
              className="rounded-xl border-2 border-brand-border bg-white p-4"
            >
              <p className="font-heading text-lg tracking-wider text-brand-black">
                {b.emoji} {b.name}{' '}
                {b.women_only && (
                  <span className="ml-2 rounded-full bg-brand-yellow px-2 py-0.5 text-xs font-semibold text-brand-black">
                    bayanlara özel
                  </span>
                )}
              </p>
              <p className="text-sm text-brand-amber">{b.schedule}</p>
              <p className="mt-1 text-sm text-brand-gray">
                {b.shortDescription}
              </p>
              {b.instructor && (
                <p className="mt-2 text-xs text-brand-gray">
                  Eğitmen:{' '}
                  <strong className="text-brand-black">
                    {b.instructor.name}
                  </strong>{' '}
                  — {b.instructor.title}
                </p>
              )}
              {b.features.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2 text-xs">
                  {b.features.map((f, i) => (
                    <li
                      key={i}
                      className="rounded-full border border-brand-border bg-brand-surface px-2 py-0.5"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title={`Trainers (${trainers.length})`}
        empty={trainers.length === 0}
      >
        <ul className="space-y-3">
          {trainers.map((t) => (
            <li
              key={t.id}
              className="rounded-xl border-2 border-brand-border bg-white p-4"
            >
              <p className="font-heading text-lg tracking-wider text-brand-black">
                {t.name}
              </p>
              <p className="text-sm text-brand-gray">{t.title}</p>
              {t.specialties.length > 0 && (
                <p className="mt-2 text-xs text-brand-gray">
                  Uzmanlık: {t.specialties.join(', ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`FAQs (${faqs.length})`} empty={faqs.length === 0}>
        <ul className="space-y-2 text-sm">
          {faqs.map((f) => (
            <li key={f.id} className="rounded-lg bg-brand-surface p-3">
              <p className="font-semibold text-brand-black">
                [{f.category}] {f.question}
              </p>
              <p className="mt-1 whitespace-pre-line text-brand-gray">
                {f.answer}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title={`Settings (${Object.keys(settings).length})`}
        empty={Object.keys(settings).length === 0}
      >
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {Object.entries(settings).map(([k, v]) => (
            <div
              key={k}
              className="rounded-lg border border-brand-border bg-white p-3"
            >
              <dt className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                {k}
              </dt>
              <dd className="mt-1 break-words text-brand-black">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}

function Section({
  title,
  empty,
  children
}: {
  title: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-xl tracking-wider text-brand-black">
        {title}
      </h2>
      <div className="mt-3">
        {empty ? (
          <p className="rounded-lg border-2 border-dashed border-brand-border bg-brand-surface p-4 text-sm text-brand-gray">
            Hiç kayıt yok. Supabase&apos;de migration&apos;ları çalıştırdığından
            ve <code>NEXT_PUBLIC_SUPABASE_URL</code> /{' '}
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> ortam
            değişkenlerinin tanımlı olduğundan emin ol.
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
