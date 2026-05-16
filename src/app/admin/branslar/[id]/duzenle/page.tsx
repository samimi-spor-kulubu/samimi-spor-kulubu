import Link from 'next/link';
import {notFound} from 'next/navigation';

import {createAdminClient} from '@/lib/supabase/admin';
import type {Branch} from '@/types/database';

import {updateBranch} from '../../actions';
import type {BranchActionState} from '../../constants';
import {
  BranchForm,
  type BranchFormValues,
  type TrainerOption
} from '../../BranchForm';

export const dynamic = 'force-dynamic';

async function loadBranch(id: string): Promise<Branch | null> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('branches')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[admin.branslar.edit.load]', error);
    return null;
  }
  return (data as Branch | null) ?? null;
}

async function loadTrainers(): Promise<TrainerOption[]> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('trainers')
    .select('id, name')
    .eq('active', true)
    .order('order_index', {ascending: true});
  if (error) {
    console.error('[admin.branslar.edit.trainers]', error);
    return [];
  }
  return data ?? [];
}

export default async function BransDuzenlePage({
  params
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const [branch, trainers] = await Promise.all([
    loadBranch(id),
    loadTrainers()
  ]);
  if (!branch) notFound();

  const initial: BranchFormValues = {
    slug: branch.slug,
    emoji: branch.emoji ?? '',
    name_tr: branch.name_tr,
    name_en: branch.name_en ?? '',
    schedule_tr: branch.schedule_tr ?? '',
    schedule_en: branch.schedule_en ?? '',
    schedule_long_tr: branch.schedule_long_tr ?? '',
    schedule_long_en: branch.schedule_long_en ?? '',
    description_tr: branch.description_tr ?? '',
    description_en: branch.description_en ?? '',
    short_description_tr: branch.short_description_tr ?? '',
    short_description_en: branch.short_description_en ?? '',
    features_tr: branch.features_tr,
    features_en: branch.features_en,
    instructor_id: branch.instructor_id,
    price_info: branch.price_info,
    women_only: branch.women_only,
    order_index: branch.order_index,
    active: branch.active
  };

  const boundUpdate = async (state: BranchActionState, fd: FormData) => {
    'use server';
    return updateBranch(id, state, fd);
  };

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
          BRANŞI DÜZENLE
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Slug: <code className="text-brand-black">{branch.slug}</code>
        </p>
      </header>

      <BranchForm
        action={boundUpdate}
        initial={initial}
        trainers={trainers}
        submitLabel="Değişiklikleri Kaydet"
      />
    </div>
  );
}
