'use client';

import {useMemo, useState} from 'react';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {
  BLOG_CATEGORIES,
  BLOG_POSTS_PER_PAGE,
  type BlogCategory,
  type LocalizedBlogPost
} from '@/lib/blog';

type Filter = 'all' | BlogCategory;

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(iso));
}

export function BlogClient({posts}: {posts: LocalizedBlogPost[]}) {
  const locale = useLocale();
  const tFilter = useTranslations('Blog.filter');
  const tCard = useTranslations('Blog.card');
  const tPagination = useTranslations('Blog.pagination');
  const tCats = useTranslations('Blog.categories');

  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (filter === 'all' ? posts : posts.filter((p) => p.category === filter)),
    [filter, posts]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_POSTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * BLOG_POSTS_PER_PAGE;
  const paginated = filtered.slice(start, start + BLOG_POSTS_PER_PAGE);

  const setFilterAndReset = (next: Filter) => {
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
          {tFilter('all')}
        </FilterPill>
        {BLOG_CATEGORIES.map((c) => (
          <FilterPill
            key={c}
            active={filter === c}
            onClick={() => setFilterAndReset(c)}
          >
            {tCats(c)}
          </FilterPill>
        ))}
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <p className="mt-12 text-center text-brand-gray">{tFilter('noResults')}</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              dateText={formatDate(post.date, locale)}
              categoryLabel={tCats(post.category)}
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
            className="inline-flex h-10 items-center rounded-full border-2 border-brand-black px-5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-brand-black"
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
            className="inline-flex h-10 items-center rounded-full border-2 border-brand-black px-5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-brand-black"
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
          : 'border-brand-border bg-white text-brand-black hover:border-brand-black')
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
  post: LocalizedBlogPost;
  dateText: string;
  categoryLabel: string;
  readTimeText: string;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-brand-border bg-white transition-all hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
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
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-heading text-xl tracking-wider text-brand-black">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-gray">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-brand-gray">
          <span>{dateText}</span>
          <span>· {readTimeText}</span>
        </div>
      </div>
    </Link>
  );
}
