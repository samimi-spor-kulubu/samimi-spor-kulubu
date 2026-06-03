import Link from 'next/link';

import {createTrainer} from '../actions';
import {TrainerForm} from '../TrainerForm';

export default function EgitmenYeniPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/egitmenler"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-amber transition-colors hover:text-brand-black"
        >
          ← Geri
        </Link>
      </div>

      <header>
        <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
          YENİ EĞİTMEN
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Yeni bir eğitmen ekle. İsim zorunlu, diğer alanlar opsiyonel.
        </p>
      </header>

      <TrainerForm action={createTrainer} submitLabel="Kaydet" />
    </div>
  );
}
