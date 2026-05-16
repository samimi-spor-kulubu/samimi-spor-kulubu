import Link from 'next/link';

import {createAdminClient} from '@/lib/supabase/admin';

import {createBranch} from '../actions';
import {BranchForm, type TrainerOption} from '../BranchForm';

export const dynamic = 'force-dynamic';

async function loadTrainers(): Promise<TrainerOption[]> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('trainers')
    .select('id, name')
    .eq('active', true)
    .order('order_index', {ascending: true});
  if (error) {
    console.error('[admin.branslar.yeni.trainers]', error);
    return [];
  }
  return data ?? [];
}

export default async function BransYeniPage() {
  const trainers = await loadTrainers();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/branslar"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-amber transition-colors hover:text-brand-black"
        >
          ← Geri
        </Link>
      </div>

      <header>
        <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
          YENİ BRANŞ
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Yeni bir branş ekle. Türkçe + İngilizce ad zorunlu.
        </p>
      </header>

      <BranchForm
        action={createBranch}
        trainers={trainers}
        submitLabel="Kaydet"
      />
    </div>
  );
}
