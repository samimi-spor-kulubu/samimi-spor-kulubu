import Link from 'next/link';

import {createAdminClient} from '@/lib/supabase/admin';
import {createClient} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Stats = {
  branches: number;
  trainers: number;
  blogPosts: number;
  newMessages: number;
};

type RecentMessage = {
  id: string;
  name: string;
  subject: string | null;
  created_at: string;
};

async function loadDashboard(): Promise<{
  stats: Stats;
  recent: RecentMessage[];
  email: string | null;
}> {
  const supabase = await createClient();
  const {
    data: {user}
  } = await supabase.auth.getUser();

  const admin = createAdminClient();

  const [branchesRes, trainersRes, blogRes, newMsgRes, recentRes] =
    await Promise.all([
      admin.from('branches').select('*', {count: 'exact', head: true}),
      admin.from('trainers').select('*', {count: 'exact', head: true}),
      admin.from('blog_posts').select('*', {count: 'exact', head: true}),
      admin
        .from('contact_messages')
        .select('*', {count: 'exact', head: true})
        .eq('status', 'new'),
      admin
        .from('contact_messages')
        .select('id, name, subject, created_at')
        .order('created_at', {ascending: false})
        .limit(5)
    ]);

  return {
    stats: {
      branches: branchesRes.count ?? 0,
      trainers: trainersRes.count ?? 0,
      blogPosts: blogRes.count ?? 0,
      newMessages: newMsgRes.count ?? 0
    },
    recent: (recentRes.data ?? []) as RecentMessage[],
    email: user?.email ?? null
  };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(iso));
}

export default async function AdminHomePage() {
  const {stats, recent, email} = await loadDashboard();

  const cards = [
    {label: 'Branş', value: stats.branches},
    {label: 'Eğitmen', value: stats.trainers},
    {label: 'Blog Yazısı', value: stats.blogPosts},
    {label: 'Bekleyen Mesaj', value: stats.newMessages}
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
          HOŞ GELDİN
        </h1>
        {email && (
          <p className="mt-2 text-sm text-brand-gray">
            Giriş yapan: <strong className="text-brand-black">{email}</strong>
          </p>
        )}
      </header>

      <section>
        <h2 className="sr-only">Özet</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border-2 border-brand-border bg-white p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                {c.label}
              </p>
              <p className="mt-2 font-heading text-4xl tracking-wider text-brand-black">
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl tracking-wider text-brand-black">
            SON MESAJLAR
          </h2>
          <Link
            href="/admin/mesajlar"
            className="text-sm font-semibold text-brand-amber hover:text-brand-black"
          >
            Tümünü gör →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border-2 border-brand-border bg-white">
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-brand-gray">
              Henüz hiç mesaj yok.
            </p>
          ) : (
            <ul className="divide-y divide-brand-border">
              {recent.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/admin/mesajlar/${m.id}`}
                    className="flex flex-col gap-1 p-4 transition-colors hover:bg-brand-surface sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-brand-black">{m.name}</p>
                      {m.subject && (
                        <p className="text-sm text-brand-gray">{m.subject}</p>
                      )}
                    </div>
                    <p className="text-xs text-brand-gray">
                      {formatDate(m.created_at)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
