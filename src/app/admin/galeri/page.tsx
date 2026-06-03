import Link from 'next/link';

import {createAdminClient} from '@/lib/supabase/admin';
import type {GalleryItem} from '@/types/database';

import {GALLERY_CATEGORIES, type GalleryCategory} from './constants';
import {GalleryCard} from './GalleryCard';
import {GalleryFilter} from './GalleryFilter';

export const dynamic = 'force-dynamic';

async function loadGalleryItems(cat: string | null): Promise<GalleryItem[]> {
  const admin = createAdminClient();
  let q = admin.from('gallery_items').select('*');
  if (cat && GALLERY_CATEGORIES.includes(cat as GalleryCategory)) {
    q = q.eq('category', cat);
  }
  const {data, error} = await q.order('order_index', {ascending: true});
  if (error) {
    console.error('[admin.galeri.list]', error);
    return [];
  }
  return (data ?? []) as GalleryItem[];
}

export default async function GaleriAdminPage({
  searchParams
}: {
  searchParams: Promise<{cat?: string}>;
}) {
  const {cat} = await searchParams;
  const current = cat ?? null;
  const items = await loadGalleryItems(current);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
            GALERİ
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            Sitede gösterilen fotoğrafları buradan yönet.
          </p>
        </div>
        <Link
          href="/admin/galeri/yeni"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
        >
          + Yeni Fotoğraf Yükle
        </Link>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <GalleryFilter current={current} />
        <p className="text-xs text-brand-gray">
          {items.length} fotoğraf gösteriliyor
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-border bg-white p-12 text-center">
          <p className="text-base text-brand-gray">
            {current ? 'Bu kategoride fotoğraf yok.' : 'Henüz fotoğraf yok.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <GalleryCard
              key={it.id}
              id={it.id}
              src={it.src}
              category={it.category}
              titleTr={it.title_tr}
              orderIndex={it.order_index}
              active={it.active}
            />
          ))}
        </div>
      )}
    </div>
  );
}
