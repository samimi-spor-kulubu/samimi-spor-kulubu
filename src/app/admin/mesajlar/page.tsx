import Link from 'next/link';

import {createAdminClient} from '@/lib/supabase/admin';
import type {ContactMessage} from '@/types/database';

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(iso));
}

async function loadMessages(): Promise<ContactMessage[]> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('contact_messages')
    .select('*')
    // 'new' first, then everything else; within each group, newest first.
    .order('status', {ascending: true}) // 'archived' < 'new' < 'read' < 'replied' alpha
    .order('created_at', {ascending: false});

  if (error) {
    console.error('[mesajlar.list]', error);
    return [];
  }

  // Move 'new' messages to the top explicitly (alpha sort above isn't right).
  const rows = (data ?? []) as ContactMessage[];
  return rows.sort((a, b) => {
    const aNew = a.status === 'new' ? 0 : 1;
    const bNew = b.status === 'new' ? 0 : 1;
    if (aNew !== bNew) return aNew - bNew;
    return a.created_at < b.created_at ? 1 : -1;
  });
}

export default async function MesajlarPage() {
  const messages = await loadMessages();
  const newCount = messages.filter((m) => m.status === 'new').length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
            MESAJLAR
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            İletişim formundan gelen tüm mesajlar.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl border-2 border-brand-border bg-white px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
              Toplam
            </p>
            <p className="mt-1 font-heading text-2xl tracking-wider text-brand-black">
              {messages.length}
            </p>
          </div>
          <div
            className={
              'rounded-2xl border-2 px-5 py-3 ' +
              (newCount > 0
                ? 'border-brand-yellow bg-brand-yellow/20'
                : 'border-brand-border bg-white')
            }
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
              Okunmamış
            </p>
            <p className="mt-1 font-heading text-2xl tracking-wider text-brand-black">
              {newCount}
            </p>
          </div>
        </div>
      </header>

      {messages.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-border bg-white p-12 text-center">
          <p className="text-base text-brand-gray">Henüz hiç mesaj yok.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/mesajlar/${m.id}`}
                className={
                  'block rounded-2xl border-2 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ' +
                  (m.status === 'new'
                    ? 'border-brand-yellow'
                    : 'border-brand-border hover:border-brand-black')
                }
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-heading text-lg tracking-wider text-brand-black">
                        {m.name}
                      </p>
                      {m.status === 'new' && (
                        <span className="inline-flex items-center rounded-full bg-brand-yellow px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-black">
                          Yeni
                        </span>
                      )}
                      {m.subject && (
                        <span className="rounded-full border border-brand-border bg-brand-surface px-2.5 py-0.5 text-xs font-medium text-brand-gray">
                          {m.subject}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-gray">
                      {m.phone && <span>📞 {m.phone}</span>}
                      {m.email && <span>✉ {m.email}</span>}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-brand-gray">
                      {m.message}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-brand-gray sm:text-right">
                    {formatDate(m.created_at)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
