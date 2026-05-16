import Link from 'next/link';

import {getAllAdminBlogPosts} from '@/lib/services/blog';

import {BlogRow} from './BlogRow';
import {StatusFilter} from './StatusFilter';

export const dynamic = 'force-dynamic';

type StatusFilterValue = 'all' | 'published' | 'draft' | 'scheduled';

export default async function BlogAdminPage({
  searchParams
}: {
  searchParams: Promise<{status?: string}>;
}) {
  const {status: rawStatus} = await searchParams;
  const current: StatusFilterValue =
    rawStatus === 'published' ||
    rawStatus === 'draft' ||
    rawStatus === 'scheduled'
      ? rawStatus
      : 'all';

  const posts = await getAllAdminBlogPosts();
  const filtered =
    current === 'all' ? posts : posts.filter((p) => p.status === current);

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    draft: posts.filter((p) => p.status === 'draft').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
            BLOG
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            Blog yazılarını buradan yönet — taslak, yayında ve zamanlanmış.
          </p>
        </div>
        <Link
          href="/admin/blog/yeni"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
        >
          + Yeni Yazı
        </Link>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatusFilter current={current} />
        <p className="text-xs text-brand-gray">
          Toplam {counts.all} · Yayında {counts.published} · Taslak{' '}
          {counts.draft} · Zamanlanmış {counts.scheduled}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-border bg-white p-12 text-center">
          <p className="text-base text-brand-gray">
            Henüz hiç blog yazısı yok. &quot;Yeni Yazı&quot; ile başla.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-brand-border bg-white p-10 text-center text-brand-gray">
          Bu filtrede yazı yok.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((p) => (
            <BlogRow
              key={p.id}
              id={p.id}
              slug={p.slug}
              image={p.image}
              titleTr={p.title_tr}
              category={p.category}
              date={p.date}
              status={p.status}
              published={p.published}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
