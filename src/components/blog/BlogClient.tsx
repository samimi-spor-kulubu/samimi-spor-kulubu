'use client';

import {useMemo, useState} from 'react';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

import type {LocalizedBlogListItem} from '@/lib/services/blog';

const POSTS_PER_PAGE = 9;

export type BlogCategoryOption = {
  slug: string;
  label: string;
  matchers: string[];
};

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(iso));
}

export function BlogClient({
  posts,
  categories,
  categoryLabels
}: {
  posts: LocalizedBlogListItem[];
  categories: BlogCategoryOption[];
  categoryLabels: Record<string, string>;
}) {
  const locale = useLocale();
  const tFilter = useTranslations('Blog.filter');
  const tCard = useTranslations('Blog.card');
  const tPagination = useTranslations('Blog.pagination');

  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const matchersBySlug = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const c of categories) {
      map.set(c.slug, new Set(c.matchers));
    }
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    if (filter === 'all') return posts;
    const set = matchersBySlug.get(filter);
    if (!set) return [];
    return posts.filter((p) => set.has(p.category));
  }, [filter, posts, matchersBySlug]);

  // Post count per category slug (handles legacy aliases via matchers).
  const countBySlug = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of categories) {
      const set = matchersBySlug.get(c.slug);
      map.set(
        c.slug,
        set ? posts.filter((p) => set.has(p.category)).length : 0
      );
    }
    return map;
  }, [categories, posts, matchersBySlug]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const paginated = filtered.slice(start, start + POSTS_PER_PAGE);

  const setFilterAndReset = (next: string) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FilterPill
          active={filter === 'all'}
          onClick={() => setFilterAndReset('all')}
        >
          {tFilter('all')} ({posts.length})
        </FilterPill>
        {categories.map((c) => (
          <FilterPill
            key={c.slug}
            active={filter === c.slug}
            onClick={() => setFilterAndReset(c.slug)}
          >
            {c.label} ({countBySlug.get(c.slug) ?? 0})
          </FilterPill>
        ))}
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <p className="mx-auto mt-12 max-w-md rounded-2xl border-2 border-dashed border-brand-border bg-white dark:bg-zinc-900 p-10 text-center text-brand-gray">
          {locale === 'en'
            ? 'No blog posts yet.'
            : 'Henüz blog yazısı yok.'}
        </p>
      ) : paginated.length === 0 ? (
        <p className="mt-12 text-center text-brand-gray">
          {tFilter('noResults')}
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              dateText={formatDate(post.date, locale)}
              categoryLabel={categoryLabels[post.category] ?? post.category}
              readTimeText={tCard('readTime', {minutes: post.readTime})}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-10 items-center rounded-full border-2 border-brand-black px-5 text-sm font-semibold text-brand-black dark:text-white transition-colors hover:bg-brand-black hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-brand-black"
          >
            ← {tPagination('prev')}
          </button>
          <span className="text-sm text-brand-gray">
            {tPagination('pageOf', {current: currentPage, total: totalPages})}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-10 items-center rounded-full border-2 border-brand-black px-5 text-sm font-semibold text-brand-black dark:text-white transition-colors hover:bg-brand-black hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-brand-black"
          >
            {tPagination('next')} →
          </button>
        </div>
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
          : 'border-brand-border bg-white dark:bg-zinc-900 text-brand-black dark:text-white hover:border-brand-black')
      }
    >
      {children}
    </button>
  );
}

function BlogCard({
  post,
  dateText,
  categoryLabel,
  readTimeText
}: {
  post: LocalizedBlogListItem;
  dateText: string;
  categoryLabel: string;
  readTimeText: string;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-brand-border bg-white dark:bg-zinc-900 transition-all hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg active:scale-[0.98] active:border-brand-yellow active:bg-brand-yellow/5"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 transition-transform duration-300 group-hover:scale-105">
            <span className="px-4 text-center text-xs font-medium text-brand-gray">
              {post.title}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-brand-yellow px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-black">
          {categoryLabel}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-brand-black/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-3.5 w-3.5"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {readTimeText}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-heading text-xl tracking-wider text-brand-black dark:text-white">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-gray">
          {post.excerpt}
        </p>
        <div className="mt-auto pt-5 text-xs text-brand-gray">{dateText}</div>
      </div>
    </Link>
  );
}
