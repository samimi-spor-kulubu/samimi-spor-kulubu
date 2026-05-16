import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';

import {Link} from '@/i18n/navigation';

export const metadata: Metadata = {
  title: '404 — Samimi Spor Kulübü',
  robots: {index: false, follow: true}
};

// Fallback `useTranslations` doesn't fire here (this file is outside the
// localised render tree on a 404), so we render a locale-agnostic page
// that links back to both TR and EN home routes.
export default async function NotFound() {
  // best-effort locale lookup; falls back to TR labels if it throws.
  let homeLabel = 'Anasayfaya dön';
  try {
    const t = await getTranslations('Nav');
    homeLabel = t('home');
  } catch {
    // ignore — happens when no locale context is available.
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-brand-surface px-4 py-20">
      <div className="mx-auto max-w-md rounded-2xl border-2 border-brand-border bg-white p-8 text-center sm:p-10">
        <p className="font-heading text-7xl tracking-wider text-brand-amber">
          404
        </p>
        <h1 className="mt-4 font-heading text-3xl tracking-wider text-brand-black">
          SAYFA BULUNAMADI
        </h1>
        <p className="mt-3 text-base leading-relaxed text-brand-gray">
          Aradığınız sayfa kaldırılmış veya hiç var olmamış olabilir. Aşağıdan
          ana sayfaya dönebilirsiniz.
        </p>
        <p className="mt-1 text-sm text-brand-gray">
          The page you’re looking for can’t be found.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand-yellow px-8 text-base font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
        >
          {homeLabel} →
        </Link>
      </div>
    </main>
  );
}
