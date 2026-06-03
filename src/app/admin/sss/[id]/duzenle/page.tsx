import Link from 'next/link';
import {notFound} from 'next/navigation';

import {createAdminClient} from '@/lib/supabase/admin';
import type {Faq} from '@/types/database';

import {updateFaq} from '../../actions';
import type {FaqActionState} from '../../constants';
import {FaqForm, type FaqFormValues} from '../../FaqForm';

export const dynamic = 'force-dynamic';

async function loadFaq(id: string): Promise<Faq | null> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('faqs')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[admin.sss.edit.load]', error);
    return null;
  }
  return (data as Faq | null) ?? null;
}

export default async function SssDuzenlePage({
  params
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const faq = await loadFaq(id);
  if (!faq) notFound();

  const initial: FaqFormValues = {
    key: faq.key,
    category: faq.category,
    question_tr: faq.question_tr,
    question_en: faq.question_en ?? '',
    answer_tr: faq.answer_tr,
    answer_en: faq.answer_en ?? '',
    link_href: faq.link_href ?? '',
    link_label_tr: faq.link_label_tr ?? '',
    link_label_en: faq.link_label_en ?? '',
    order_index: faq.order_index,
    active: faq.active
  };

  // Bind id to the action so the client form doesn't need to pass it.
  const boundUpdate = async (state: FaqActionState, fd: FormData) => {
    'use server';
    return updateFaq(id, state, fd);
  };

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
          SSS DÜZENLE
        </h1>
        <p className="mt-2 text-sm text-brand-gray">
          Anahtar: <code className="text-brand-black">{faq.key}</code>
        </p>
      </header>

      <FaqForm
        action={boundUpdate}
        initial={initial}
        submitLabel="Değişiklikleri Kaydet"
      />
    </div>
  );
}
