import Link from 'next/link';

import {createAdminClient} from '@/lib/supabase/admin';
import type {Trainer} from '@/types/database';

import {TrainerCard} from './TrainerCard';

export const dynamic = 'force-dynamic';

async function loadTrainers(): Promise<Trainer[]> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('trainers')
    .select('*')
    .order('order_index', {ascending: true});
  if (error) {
    console.error('[admin.egitmenler.list]', error);
    return [];
  }
  return (data ?? []) as Trainer[];
}

export default async function EgitmenlerAdminPage() {
  const trainers = await loadTrainers();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
            EĞİTMENLER
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            Eğitmen kadrosunu buradan yönet.
          </p>
        </div>
        <Link
          href="/admin/egitmenler/yeni"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
        >
          + Yeni Eğitmen Ekle
        </Link>
      </header>

      {trainers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-border bg-white p-12 text-center">
          <p className="text-base text-brand-gray">
            Henüz hiç eğitmen yok. &quot;Yeni Eğitmen Ekle&quot; ile başla.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {trainers.map((t) => (
            <TrainerCard
              key={t.id}
              id={t.id}
              name={t.name}
              titleTr={t.title_tr}
              photo={t.photo}
              orderIndex={t.order_index}
              active={t.active}
            />
          ))}
        </div>
      )}
    </div>
  );
}
