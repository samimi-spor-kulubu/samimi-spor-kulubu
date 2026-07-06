'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {CloseIcon, MenuIcon} from '@/components/icons';
import {SmoothScrollLink} from '@/components/common/SmoothScrollLink';
import {LanguageSwitcher} from './LanguageSwitcher';
import {ThemeToggle} from '@/components/theme/ThemeToggle';

const NAV_LINKS = [
  {href: '/', tKey: 'home'},
  {href: '/branslar', tKey: 'branches'},
  {href: '/egitmenler', tKey: 'trainers'},
  {href: '/galeri', tKey: 'gallery'},
  {href: '/blog', tKey: 'blog'},
  {href: '/hakkimizda', tKey: 'about'},
  {href: '/iletisim', tKey: 'contact'}
] as const;

function Logo() {
  return (
    <SmoothScrollLink
      href="/"
      className="font-heading text-2xl tracking-wider text-brand-black dark:text-white"
    >
      SAMİMİ <span className="gold-shimmer">SPOR</span> KULÜBÜ
    </SmoothScrollLink>
  );
}

export function Navbar({whatsappUrl}: {whatsappUrl: string}) {
  const t = useTranslations('Nav');
  const [open, setOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const getFocusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    // Initial focus on first menu item
    const focusables = getFocusables();
    focusables[0]?.focus();

    // Scroll-lock the body while the menu is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }
      if (e.key === 'Tab') {
        const items = getFocusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement as HTMLElement;
        const inside = panelRef.current?.contains(active);
        if (e.shiftKey && (active === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    toggleBtnRef.current?.focus();
  };

  // Clicking a nav link should close the menu and immediately release the
  // body scroll lock so the browser back button works cleanly on mobile.
  const handleNavLinkClick = () => {
    setOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-white/95 backdrop-blur dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map(({href, tKey}) => (
            <SmoothScrollLink
              key={href}
              href={href}
              className="text-sm font-medium text-brand-black/80 hover:text-brand-amber transition-colors dark:text-white/80 dark:hover:text-brand-yellow"
            >
              {t(tKey)}
            </SmoothScrollLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <span data-tour="theme-toggle">
            <ThemeToggle />
          </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-tour="whatsapp"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand-yellow px-5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
          >
            {t('whatsapp')}
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('closeMenu') : t('openMenu')}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-black dark:text-white"
          >
            {open ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="origin-top border-t border-brand-border bg-white animate-in fade-in slide-in-from-top-2 animation-duration-200 dark:bg-zinc-950 lg:hidden motion-reduce:animate-none"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV_LINKS.map(({href, tKey}) => (
              <SmoothScrollLink
                key={href}
                href={href}
                onClick={handleNavLinkClick}
                className="rounded-md px-3 py-2 text-base font-medium text-brand-black hover:bg-brand-surface dark:text-white dark:hover:bg-zinc-800"
              >
                {t(tKey)}
              </SmoothScrollLink>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-4">
              <LanguageSwitcher />
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-full bg-brand-yellow px-5 text-sm font-semibold text-brand-black hover:bg-brand-yellow-dark"
              >
                {t('whatsapp')}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
