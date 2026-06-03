import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';

import {Link} from '@/i18n/navigation';

export const metadata: Metadata = {
  title: '404 — Samimi Spor Kulübü',
  robots: {index: false, follow: true}
};

export default async function NotFound() {
  let title = 'SAYFA BULUNAMADI';
  let description =
    'Aradığınız sayfa kaldırılmış veya hiç var olmamış olabilir. Aşağıdan ana sayfaya dönebilirsiniz.';
  let cta = 'Ana Sayfaya Dön';
  let subtitle = "The page you're looking for can't be found.";

  try {
    const t = await getTranslations('NotFound');
    title = t('title');
    description = t('description');
    cta = t('cta');
    subtitle = '';
  } catch {
    // No locale context — keep TR fallbacks with EN subtitle.
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-brand-surface px-4 py-20">
      <div className="mx-auto max-w-md rounded-2xl border-2 border-brand-border bg-white dark:bg-zinc-900 p-8 text-center sm:p-10">
        <p className="font-heading text-7xl tracking-wider text-brand-amber">
          404
        </p>
        <h1 className="mt-4 font-heading text-3xl tracking-wider text-brand-black dark:text-white">
          {title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-brand-gray">
          {description}
        </p>
        {subtitle && (
          <p className="mt-1 text-sm text-brand-gray">{subtitle}</p>
        )}
        <Link
          href="/"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand-yellow px-8 text-base font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
        >
          {cta} →
        </Link>
      </div>
    </main>
  );
}
