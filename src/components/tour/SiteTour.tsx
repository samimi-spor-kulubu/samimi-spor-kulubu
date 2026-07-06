'use client';

import {useCallback, useEffect, useState} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import {usePathname} from '@/i18n/navigation';
import {driver, type Driver} from 'driver.js';
import 'driver.js/dist/driver.css';

const STORAGE_KEY = 'site_tour_completed';

// Steps reference elements by `[data-tour="..."]` selector. If a selector
// isn't found on the current page, the step is skipped silently so the
// tour stays graceful when DOM shifts.
const STEPS = [
  {element: '[data-tour="hero"]', tKey: 'hero'},
  {element: '[data-tour="branches"]', tKey: 'branches'},
  {element: '[data-tour="trainers"]', tKey: 'trainers'},
  {element: '[data-tour="whatsapp"]', tKey: 'whatsapp'},
  {element: '[data-tour="faq-link"]', tKey: 'faq'}
] as const;

export function SiteTour() {
  const t = useTranslations('Tour.onboarding');
  const locale = useLocale();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runTour = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Build steps, filtering out any whose anchor element isn't on the page.
    const steps = STEPS.filter((s) => document.querySelector(s.element)).map(
      (s) => ({
        element: s.element,
        popover: {
          title: t(`steps.${s.tKey}.title`),
          description: t(`steps.${s.tKey}.description`)
        }
      })
    );

    if (steps.length === 0) return;

    const d: Driver = driver({
      popoverClass: 'samimi-driver',
      showProgress: true,
      progressText: t('progress'),
      nextBtnText: t('next'),
      prevBtnText: t('prev'),
      doneBtnText: t('done'),
      allowClose: true,
      stagePadding: 6,
      stageRadius: 12,
      animate: true,
      onCloseClick: () => {
        try {
          window.localStorage.setItem(STORAGE_KEY, '1');
        } catch {
          /* private mode etc. */
        }
        d.destroy();
      },
      onDestroyStarted: () => {
        try {
          window.localStorage.setItem(STORAGE_KEY, '1');
        } catch {
          /* ignore */
        }
        d.destroy();
      },
      steps
    });

    d.drive();
  }, [t]);

  // Auto-start on first visit (home page only).
  useEffect(() => {
    if (!mounted) return;
    if (pathname !== '/') return;
    let done = '0';
    try {
      done = window.localStorage.getItem(STORAGE_KEY) ?? '0';
    } catch {
      /* private mode etc. */
    }
    if (done === '1') return;
    // Small delay so layout / fonts settle before highlighting boxes.
    const id = window.setTimeout(runTour, 900);
    return () => window.clearTimeout(id);
  }, [mounted, pathname, runTour, locale]);

  // Replay-link target lives in the footer; expose a global so the footer
  // anchor can call back into this component without a context dance.
  useEffect(() => {
    if (!mounted) return;
    (window as unknown as {samimiReplayTour?: () => void}).samimiReplayTour =
      () => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        runTour();
      };
    return () => {
      delete (window as unknown as {samimiReplayTour?: () => void})
        .samimiReplayTour;
    };
  }, [mounted, runTour]);

  return null;
}

export function TourReplayLink({label}: {label: string}) {
  return (
    <button
      type="button"
      onClick={() => {
        const fn = (window as unknown as {samimiReplayTour?: () => void})
          .samimiReplayTour;
        if (fn) fn();
      }}
      className="text-zinc-400 underline-offset-2 transition-colors hover:text-brand-yellow hover:underline"
    >
      {label}
    </button>
  );
}
