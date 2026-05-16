'use client';

import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

type NavLink = {href: string; label: string; exact?: boolean};

const NAV_LINKS: ReadonlyArray<NavLink> = [
  {href: '/admin', label: 'Anasayfa', exact: true},
  {href: '/admin/branslar', label: 'Branşlar'},
  {href: '/admin/egitmenler', label: 'Eğitmenler'},
  {href: '/admin/galeri', label: 'Galeri'},
  {href: '/admin/sss', label: 'SSS'},
  {href: '/admin/mesajlar', label: 'Mesajlar'},
  {href: '/admin/ayarlar', label: 'Ayarlar'}
];

export function AdminChrome({children}: {children: React.ReactNode}) {
  const pathname = usePathname() ?? '';
  const [open, setOpen] = useState(false);

  // Login screen has no chrome.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Topbar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-brand-border bg-white px-4 lg:hidden">
        <Link
          href="/admin"
          className="font-heading text-lg tracking-wider text-brand-black"
        >
          SAMİMİ <span className="text-brand-amber">ADMIN</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={open}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-border text-brand-black"
        >
          {open ? '✕' : '☰'}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={
          'border-b border-brand-border bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r ' +
          (open ? 'block' : 'hidden lg:block')
        }
      >
        <div className="hidden h-16 items-center px-6 lg:flex">
          <Link
            href="/admin"
            className="font-heading text-xl tracking-wider text-brand-black"
          >
            SAMİMİ <span className="text-brand-amber">ADMIN</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map(({href, label, exact}) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors ' +
                  (active
                    ? 'bg-brand-yellow text-brand-black'
                    : 'text-brand-black hover:bg-brand-surface')
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-brand-border p-4">
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-full border-2 border-brand-black text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black hover:text-white"
            >
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
