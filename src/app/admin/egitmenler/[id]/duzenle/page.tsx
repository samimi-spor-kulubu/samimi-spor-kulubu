import Link from 'next/link';
import {notFound} from 'next/navigation';

import {createAdminClient} from '@/lib/supabase/admin';
import type {Trainer} from '@/types/database';

import {updateTrainer} from '../../actions';
import type {TrainerActionState} from '../../constants';
import {TrainerForm, type TrainerFormValues} from '../../TrainerForm';

export const dynamic = 'force-dynamic';

async function loadTrainer(id: string): Promise<Trainer | null> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('trainers')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[admin.egitmenler.edit.load]', error);
    return null;
  }
  return (data as Trainer | null) ?? null;
}

export default async function EgitmenDuzenlePage({
  params
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const trainer = await loadTrainer(id);
  if (!trainer) notFound();

  const initial: TrainerFormValues = {
    slug: trainer.slug,
    name: trainer.name,
    title_tr: trainer.title_tr ?? '',
    title_en: trainer.title_en ?? '',
    short_bio_tr: trainer.short_bio_tr ?? '',
    short_bio_en: trainer.short_bio_en ?? '',
    about_tr: trainer.about_tr,
    about_en: trainer.about_en,
    specialties: trainer.specialties,
    certifications: trainer.certifications,
    order_index: trainer.order_index,
    active: trainer.active,
    existingPhoto: trainer.photo
  };

  const boundUpdate = async (state: TrainerActionState, fd: FormData) => {
    'use server';
    return updateTrainer(id, state, fd);
  };

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
          EĞİTMENİ DÜZENLE
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Slug: <code className="text-brand-black">{trainer.slug}</code>
        </p>
      </header>

      <TrainerForm
        action={boundUpdate}
        initial={initial}
        submitLabel="Değişiklikleri Kaydet"
      />
    </div>
  );
}
