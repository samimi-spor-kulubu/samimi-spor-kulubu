import Link from 'next/link';

import {createFaq} from '../actions';
import {FaqForm} from '../FaqForm';

export default function SssYeniPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/sss"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-amber transition-colors hover:text-brand-black"
        >
          ← Geri
        </Link>
      </div>

      <header>
        <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
          YENİ SSS
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Yeni bir soru-cevap ekle. Türkçe alanlar zorunlu, İngilizce alanlar
          opsiyonel.
        </p>
      </header>

      <FaqForm action={createFaq} submitLabel="Kaydet" />
    </div>
  );
}
