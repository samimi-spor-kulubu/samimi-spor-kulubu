'use client';

import {useEffect, useState} from 'react';
import {useTheme} from 'next-themes';
import {useTranslations} from 'next-intl';

export function ThemeToggle({className = ''}: {className?: string}) {
  const {theme, resolvedTheme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Theme');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a same-shape placeholder until mounted so SSR & first paint match.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label={t('toggle')}
        className={
          'inline-flex h-10 w-10 items-center justify-center rounded-full ' +
          className
        }
      />
    );
  }

  const current = theme === 'system' ? resolvedTheme : theme;
  const isDark = current === 'dark';
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={t('toggle')}
      title={isDark ? t('toLight') : t('toDark')}
      className={
        'inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-border bg-white text-brand-black transition-colors hover:border-brand-yellow dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:border-brand-yellow ' +
        className
      }
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}

function SunIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({className}: {className?: string}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
