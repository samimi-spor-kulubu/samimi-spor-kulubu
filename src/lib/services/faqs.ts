import 'server-only';
import {createClient} from '@/lib/supabase/server';
import type {Faq} from '@/types/database';

export type LocalizedFaq = {
  id: string;
  key: string;
  category: string;
  question: string;
  answer: string;
  link: {href: string; label: string} | null;
  order_index: number;
};

function pick<T>(en: T | null | undefined, tr: T | null | undefined, locale: string): T | null {
  return (locale === 'en' ? en : tr) ?? null;
}

function localizeFaq(row: Faq, locale: string): LocalizedFaq {
  const linkLabel = pick(row.link_label_en, row.link_label_tr, locale);
  return {
    id: row.id,
    key: row.key,
    category: row.category,
    question: pick(row.question_en, row.question_tr, locale) ?? row.question_tr,
    answer: pick(row.answer_en, row.answer_tr, locale) ?? row.answer_tr,
    link:
      row.link_href && linkLabel
        ? {href: row.link_href, label: linkLabel}
        : null,
    order_index: row.order_index
  };
}

/** All active FAQs, ordered by category then order_index. */
export async function getAllFaqs(locale: string): Promise<LocalizedFaq[]> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from('faqs')
    .select('*')
    .eq('active', true)
    .order('category', {ascending: true})
    .order('order_index', {ascending: true});

  if (error) {
    console.error('[faqs.getAllFaqs]', error);
    return [];
  }
  return data?.map((row) => localizeFaq(row, locale)) ?? [];
}
