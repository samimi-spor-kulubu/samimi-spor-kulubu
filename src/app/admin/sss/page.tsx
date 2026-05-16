import Link from 'next/link';

import {createAdminClient} from '@/lib/supabase/admin';
import type {Faq} from '@/types/database';

import {CATEGORY_LABELS_TR, FAQ_CATEGORIES, type FaqCategory} from './constants';
import {FaqRow} from './FaqRow';

export const dynamic = 'force-dynamic';

async function loadFaqs(): Promise<Faq[]> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('faqs')
    .select('*')
    .order('category', {ascending: true})
    .order('order_index', {ascending: true});

  if (error) {
    console.error('[admin.sss.list]', error);
    return [];
  }
  return (data ?? []) as Faq[];
}

export default async function SssAdminPage() {
  const all = await loadFaqs();

  // Group by category, preserving FAQ_CATEGORIES order; unknown
  // categories fall into the "other" bucket at the bottom.
  const known = new Set<string>(FAQ_CATEGORIES);
  const grouped = new Map<string, Faq[]>();
  for (const cat of FAQ_CATEGORIES) grouped.set(cat, []);
  const other: Faq[] = [];
  for (const f of all) {
    if (known.has(f.category)) {
      grouped.get(f.category)!.push(f);
    } else {
      other.push(f);
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
            SIKÇA SORULAN SORULAR
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            Sitedeki SSS listesini buradan yönet.
          </p>
        </div>
        <Link
          href="/admin/sss/yeni"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
        >
          + Yeni SSS Ekle
        </Link>
      </header>

      {all.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-border bg-white p-12 text-center">
          <p className="text-base text-brand-gray">
            Henüz hiç SSS yok. &quot;Yeni SSS Ekle&quot; ile başla.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {FAQ_CATEGORIES.map((cat) => {
            const rows = grouped.get(cat) ?? [];
            if (rows.length === 0) return null;
            return (
              <CategorySection
                key={cat}
                label={CATEGORY_LABELS_TR[cat as FaqCategory]}
                rows={rows}
              />
            );
          })}
          {other.length > 0 && (
            <CategorySection label="Diğer" rows={other} />
          )}
        </div>
      )}
    </div>
  );
}

function CategorySection({label, rows}: {label: string; rows: Faq[]}) {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="font-heading text-xl tracking-wider text-brand-black">
          {label}
        </h2>
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
          {rows.length} soru
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <FaqRow
            key={r.id}
            id={r.id}
            question={r.question_tr}
            active={r.active}
            orderIndex={r.order_index}
          />
        ))}
      </ul>
    </section>
  );
}
