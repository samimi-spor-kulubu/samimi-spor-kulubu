import Link from 'next/link';

import {createAdminClient} from '@/lib/supabase/admin';
import type {Branch} from '@/types/database';

import {BranchRow} from './BranchRow';

export const dynamic = 'force-dynamic';

async function loadBranches(): Promise<Branch[]> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('branches')
    .select('*')
    .order('order_index', {ascending: true});
  if (error) {
    console.error('[admin.branslar.list]', error);
    return [];
  }
  return (data ?? []) as Branch[];
}

export default async function BranslarAdminPage() {
  const branches = await loadBranches();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
            BRANŞLAR
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            Sitedeki branş listesini buradan yönet.
          </p>
        </div>
        <Link
          href="/admin/branslar/yeni"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
        >
          + Yeni Branş Ekle
        </Link>
      </header>

      {branches.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-border bg-white p-12 text-center">
          <p className="text-base text-brand-gray">
            Henüz hiç branş yok. &quot;Yeni Branş Ekle&quot; ile başla.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {branches.map((b) => (
            <BranchRow
              key={b.id}
              id={b.id}
              emoji={b.emoji}
              nameTr={b.name_tr}
              scheduleTr={b.schedule_tr}
              active={b.active}
              orderIndex={b.order_index}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
