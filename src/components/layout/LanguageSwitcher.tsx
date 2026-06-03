'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {useTransition} from 'react';

const LOCALES = ['tr', 'en'] as const;
type Locale = (typeof LOCALES)[number];

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, {locale: next});
    });
  };

  return (
    <div
      className="flex items-center gap-1 text-sm font-medium"
      aria-label="Language"
    >
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          <button
            type="button"
            onClick={() => switchTo(l)}
            disabled={isPending}
            className={
              l === locale
                ? 'text-brand-black dark:text-white underline underline-offset-4 decoration-2 decoration-brand-yellow'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-brand-black dark:hover:text-white transition-colors'
            }
          >
            {l.toUpperCase()}
          </button>
          {i < LOCALES.length - 1 && (
            <span className="mx-1 text-zinc-300">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
