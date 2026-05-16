import Link from 'next/link';

import {createGalleryItem} from '../actions';
import {GalleryForm} from '../GalleryForm';

export default function GaleriYeniPage() {
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
          YENİ FOTOĞRAF
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Bir görsel seç ve kategori belirle. En fazla 5 MB.
        </p>
      </header>

      <GalleryForm action={createGalleryItem} submitLabel="Yükle ve Kaydet" photoRequired />
    </div>
  );
}
