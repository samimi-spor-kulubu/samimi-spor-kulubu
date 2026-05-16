import Link from 'next/link';
import {notFound} from 'next/navigation';

import {createAdminClient} from '@/lib/supabase/admin';
import type {ContactMessage} from '@/types/database';

import {MessageActions} from './MessageActions';

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(iso));
}

/** Strip non-digits and normalise a TR phone for wa.me. */
function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('90')) return digits;
  if (digits.startsWith('0')) return '90' + digits.slice(1);
  if (digits.length === 10) return '90' + digits;
  return digits;
}

function whatsappReplyUrl(phone: string, name: string): string | null {
  const normalised = normalisePhone(phone);
  if (!normalised) return null;
  const text = `Merhaba ${name}, Samimi Spor Kulübü'nden ulaşıyoruz. Mesajınız için teşekkür ederiz.`;
  return `https://wa.me/${normalised}?text=${encodeURIComponent(text)}`;
}

async function loadMessage(id: string): Promise<ContactMessage | null> {
  const admin = createAdminClient();
  const {data, error} = await admin
    .from('contact_messages')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[mesajlar.detail]', error);
    return null;
  }
  return (data as ContactMessage | null) ?? null;
}

export default async function MesajDetayPage({
  params
}: {
  params: Promise<{id: string}>;
}) {
  const {id} = await params;
  const message = await loadMessage(id);
  if (!message) notFound();

  const waUrl = message.phone
    ? whatsappReplyUrl(message.phone, message.name)
    : null;
  const isRead = message.status !== 'new';

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/mesajlar"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-amber transition-colors hover:text-brand-black"
        >
          ← Geri
        </Link>
      </div>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
              {message.name}
            </h1>
            {message.status === 'new' && (
              <span className="inline-flex items-center rounded-full bg-brand-yellow px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-black">
                Yeni
              </span>
            )}
            {message.status === 'read' && (
              <span className="inline-flex items-center rounded-full bg-brand-surface px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gray">
                Okundu
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-brand-gray">
            {formatDate(message.created_at)}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {message.phone && (
          <InfoCard label="Telefon">
            <a
              href={`tel:${message.phone}`}
              className="font-heading text-xl tracking-wider text-brand-black transition-opacity hover:opacity-80"
            >
              {message.phone}
            </a>
          </InfoCard>
        )}
        {message.email && (
          <InfoCard label="E-posta">
            <a
              href={`mailto:${message.email}`}
              className="break-all text-base font-medium text-brand-black transition-colors hover:text-brand-amber"
            >
              {message.email}
            </a>
          </InfoCard>
        )}
        {message.subject && (
          <InfoCard label="Konu">
            <p className="text-base font-medium text-brand-black">
              {message.subject}
            </p>
          </InfoCard>
        )}
        <InfoCard label="Durum">
          <p className="text-base font-medium text-brand-black">
            {message.status === 'new'
              ? 'Yeni'
              : message.status === 'read'
                ? 'Okundu'
                : message.status === 'replied'
                  ? 'Yanıtlandı'
                  : message.status === 'archived'
                    ? 'Arşivlenmiş'
                    : message.status}
          </p>
        </InfoCard>
      </section>

      <section>
        <h2 className="font-heading text-xl tracking-wider text-brand-black">
          MESAJ
        </h2>
        <div className="mt-3 rounded-2xl border-2 border-brand-border bg-white p-6">
          <p className="whitespace-pre-line text-base leading-relaxed text-brand-black">
            {message.message}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-brand-border bg-white p-6">
        <h2 className="font-heading text-xl tracking-wider text-brand-black">
          İŞLEMLER
        </h2>

        <div className="mt-4 space-y-4">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-yellow px-6 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
            >
              WhatsApp&apos;tan Yanıtla →
            </a>
          )}

          <MessageActions id={message.id} isRead={isRead} />
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-brand-border bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
        {label}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
