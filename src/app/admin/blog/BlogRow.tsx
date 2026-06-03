'use client';

import {useState, useTransition} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {Switch} from '@/components/ui/switch';

import {deleteBlogPost, togglePublished} from './actions';
import {BLOG_CATEGORY_LABELS_TR} from './constants';

type Status = 'published' | 'draft' | 'scheduled';

function statusBadge(status: Status) {
  switch (status) {
    case 'published':
      return {label: 'Yayında', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200'};
    case 'draft':
      return {label: 'Taslak', cls: 'bg-zinc-100 text-zinc-700 border-zinc-200'};
    case 'scheduled':
      return {label: 'Zamanlanmış', cls: 'bg-amber-100 text-amber-700 border-amber-200'};
  }
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(iso));
}

export function BlogRow({
  id,
  slug,
  image,
  titleTr,
  category,
  date,
  status,
  published
}: {
  id: string;
  slug: string;
  image: string | null;
  titleTr: string;
  category: string;
  date: string;
  status: Status;
  published: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onToggle = (next: boolean) => {
    startTransition(async () => {
      await togglePublished(id, next);
      router.refresh();
    });
  };

  const onConfirmDelete = () => {
    startTransition(async () => {
      await deleteBlogPost(id);
      setOpen(false);
      router.refresh();
    });
  };

  const badge = statusBadge(status);
  const catLabel = BLOG_CATEGORY_LABELS_TR[category] ?? category;

  return (
    <li className="flex flex-col gap-4 rounded-2xl border-2 border-brand-border bg-white p-4 sm:flex-row sm:items-center">
      {/* Thumbnail */}
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
        {image ? (
          // Native img keeps the admin list lightweight.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={titleTr}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-brand-gray">
            (kapak yok)
          </div>
        )}
      </div>

      {/* Title + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-heading text-lg tracking-wider text-brand-black">
            {titleTr}
          </p>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.cls}`}
          >
            {badge.label}
          </span>
          <span className="rounded-full border border-brand-border bg-brand-surface px-2.5 py-0.5 text-xs font-medium text-brand-gray">
            {catLabel}
          </span>
        </div>
        <p className="mt-1 text-xs text-brand-gray">
          {formatDate(date)} ·{' '}
          <code className="text-brand-black">{slug}</code>
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={published}
            disabled={pending}
            onCheckedChange={onToggle}
            aria-label={published ? 'Taslağa al' : 'Yayına al'}
          />
          <span className="text-xs text-brand-gray">
            {published ? 'Yayında' : 'Taslak'}
          </span>
        </div>
        <Link
          href={`/admin/blog/${id}/duzenle`}
          className="inline-flex h-9 items-center rounded-full border-2 border-brand-border px-4 text-xs font-semibold text-brand-black transition-colors hover:border-brand-black"
        >
          Düzenle
        </Link>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              disabled={pending}
              className="inline-flex h-9 items-center rounded-full border-2 border-red-200 px-4 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              Sil
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yazıyı sil?</DialogTitle>
              <DialogDescription>
                Bu işlem geri alınamaz. &quot;{titleTr}&quot; yazısı ve
                kapak görseli kalıcı olarak silinecek.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" disabled={pending}>
                  İptal
                </Button>
              </DialogClose>
              <Button
                variant="dark"
                disabled={pending}
                onClick={onConfirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {pending ? 'Siliniyor…' : 'Evet, sil'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </li>
  );
}
