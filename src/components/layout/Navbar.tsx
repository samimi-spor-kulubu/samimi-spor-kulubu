'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {getWhatsAppUrl} from '@/config/contact';
import {CloseIcon, MenuIcon} from '@/components/icons';
import {LanguageSwitcher} from './LanguageSwitcher';

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
    <Link
      href="/"
      className="font-heading text-2xl tracking-wider text-brand-black"
    >
      SAMİMİ <span className="text-brand-yellow">SPOR</span> KULÜBÜ
    </Link>
  );
}

export function Navbar() {
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map(({href, tKey}) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-brand-black/80 hover:text-brand-amber transition-colors"
            >
              {t(tKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand-yellow px-5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
          >
            {t('whatsapp')}
          </a>
        </div>

        <button
          ref={toggleBtnRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('closeMenu') : t('openMenu')}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-black lg:hidden"
        >
          {open ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="origin-top border-t border-brand-border bg-white animate-in fade-in slide-in-from-top-2 animation-duration-200 lg:hidden motion-reduce:animate-none"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV_LINKS.map(({href, tKey}) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className="rounded-md px-3 py-2 text-base font-medium text-brand-black hover:bg-brand-surface"
              >
                {t(tKey)}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-4">
              <LanguageSwitcher />
              <a
                href={getWhatsAppUrl()}
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
