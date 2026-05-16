import Link from 'next/link';
import {notFound} from 'next/navigation';

import {createAdminClient} from '@/lib/supabase/admin';
import type {GalleryItem} from '@/types/database';

import {updateGalleryItem} from '../../actions';
import type {GalleryActionState} from '../../constants';
import {GalleryForm, type GalleryFormValues} from '../../GalleryForm';

export const dynamic = 'force-dynamic';

async function loadItem(id: string): Promise<GalleryItem | null> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('gallery_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[admin.galeri.edit.load]', error);
    return null;
  }
  return (data as GalleryItem | null) ?? null;
}

export default async function GaleriDuzenlePage({
  params
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const item = await loadItem(id);
  if (!item) notFound();

  const initial: GalleryFormValues = {
    key: item.key,
    category: item.category,
    title_tr: item.title_tr ?? '',
    title_en: item.title_en ?? '',
    order_index: item.order_index,
    active: item.active,
    existingSrc: item.src
  };

  const boundUpdate = async (state: GalleryActionState, fd: FormData) => {
    'use server';
    return updateGalleryItem(id, state, fd);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/galeri"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-amber transition-colors hover:text-brand-black"
        >
          ← Geri
        </Link>
      </div>

      <header>
        <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
          FOTOĞRAFI DÜZENLE
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Anahtar: <code className="text-brand-black">{item.key}</code>
        </p>
      </header>

      <GalleryForm
        action={boundUpdate}
        initial={initial}
        submitLabel="Değişiklikleri Kaydet"
        photoRequired={false}
      />
    </div>
  );
}
