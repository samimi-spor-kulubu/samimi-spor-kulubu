'use client';

import {useEffect, useRef, useState} from 'react';
import Image from 'next/image';

import {useTranslations} from 'next-intl';
import {
  GALLERY,
  GALLERY_CATEGORIES,
  type GalleryCategory,
  type GalleryItem
} from '@/lib/gallery';

type Filter = 'all' | GalleryCategory;

export function GalleryClient() {
  const tFilter = useTranslations('Gallery.filter');
  const tCats = useTranslations('Gallery.categories');
  const tItems = useTranslations('Gallery.items');

  const [filter, setFilter] = useState<Filter>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered =
    filter === 'all' ? GALLERY : GALLERY.filter((g) => g.category === filter);

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setOpenIndex(null);
  };

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FilterPill
          active={filter === 'all'}
          onClick={() => changeFilter('all')}
        >
          {tFilter('all')}
        </FilterPill>
        {GALLERY_CATEGORIES.map((c) => (
          <FilterPill
            key={c}
            active={filter === c}
            onClick={() => changeFilter(c)}
          >
            {tCats(c)}
          </FilterPill>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-brand-gray">
          {tFilter('noResults')}
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenIndex(idx)}
              aria-label={tItems(`${item.id}.title`)}
              className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-brand-border bg-zinc-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-brand-yellow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
            >
              <PlaceholderOrImage
                item={item}
                title={tItems(`${item.id}.title`)}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {tItems(`${item.id}.title`)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {openIndex !== null && filtered[openIndex] && (
        <Lightbox
          items={filtered}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex h-10 items-center rounded-full border-2 px-5 text-sm font-semibold transition-colors ' +
        (active
          ? 'border-brand-black bg-brand-yellow text-brand-black'
          : 'border-brand-border bg-white text-brand-black hover:border-brand-black')
      }
    >
      {children}
    </button>
  );
}

function PlaceholderOrImage({
  item,
  title,
  className
}: {
  item: GalleryItem;
  title: string;
  className?: string;
}) {
  if (item.src) {
    return (
      <Image
        src={item.src}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={`object-cover object-center ${className ?? ''}`}
      />
    );
  }
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 ${className ?? ''}`}
    >
      <span className="px-3 text-center text-xs font-medium text-brand-gray">
        {title}
      </span>
    </div>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onIndexChange
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const tLightbox = useTranslations('Gallery.lightbox');
  const tItems = useTranslations('Gallery.items');
  const item = items[index];
  const total = items.length;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusables = () =>
      Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft' && hasPrev) {
        onIndexChange(index - 1);
        return;
      }
      if (e.key === 'ArrowRight' && hasNext) {
        onIndexChange(index + 1);
        return;
      }
      if (e.key === 'Tab') {
        const focusables = getFocusables();
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement;
        if (e.shiftKey && (active === first || !containerRef.current?.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !containerRef.current?.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [index, hasPrev, hasNext, onClose, onIndexChange]);

  const title = tItems(`${item.id}.title`);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-800">
          {item.src ? (
            <Image
              src={item.src}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900">
              <span className="font-heading text-2xl tracking-wider text-white">
                {title}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-white">
          <p className="text-sm">{title}</p>
          <p className="text-xs text-zinc-400">
            {tLightbox('imageCounter', {current: index + 1, total})}
          </p>
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label={tLightbox('close')}
          className="absolute -right-2 -top-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-xl font-bold text-brand-black shadow-lg transition-colors hover:bg-brand-yellow-dark sm:-right-4 sm:-top-4"
        >
          ×
        </button>

        {hasPrev && (
          <button
            type="button"
            onClick={() => onIndexChange(index - 1)}
            aria-label={tLightbox('prev')}
            className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-bold text-brand-black shadow-lg transition-colors hover:bg-white sm:-left-6"
          >
            ‹
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            onClick={() => onIndexChange(index + 1)}
            aria-label={tLightbox('next')}
            className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-bold text-brand-black shadow-lg transition-colors hover:bg-white sm:-right-6"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
