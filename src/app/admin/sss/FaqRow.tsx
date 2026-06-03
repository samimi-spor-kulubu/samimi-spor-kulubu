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

import {deleteFaq, toggleActive} from './actions';

export function FaqRow({
  id,
  question,
  active,
  orderIndex
}: {
  id: string;
  question: string;
  active: boolean;
  orderIndex: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onToggle = (next: boolean) => {
    startTransition(async () => {
      await toggleActive(id, next);
      router.refresh();
    });
  };

  const onConfirmDelete = () => {
    startTransition(async () => {
      await deleteFaq(id);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <li
      className={
        'flex flex-col gap-3 rounded-2xl border-2 bg-white p-4 sm:flex-row sm:items-center sm:justify-between ' +
        (active ? 'border-brand-border' : 'border-brand-border bg-zinc-50')
      }
    >
      <div className="min-w-0 flex-1">
        <p
          className={
            'font-heading text-base tracking-wide ' +
            (active ? 'text-brand-black' : 'text-brand-gray')
          }
        >
          <span className="mr-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-brand-surface px-2 text-xs font-semibold text-brand-gray">
            {orderIndex}
          </span>
          {question}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={active}
            disabled={pending}
            onCheckedChange={onToggle}
            aria-label={active ? 'Aktif — pasif yap' : 'Pasif — aktif yap'}
          />
          <span className="text-xs text-brand-gray">
            {active ? 'Aktif' : 'Pasif'}
          </span>
        </div>

        <Link
          href={`/admin/sss/${id}/duzenle`}
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
              <DialogTitle>SSS&apos;yi sil?</DialogTitle>
              <DialogDescription>
                Bu işlem geri alınamaz. &quot;{question}&quot; sorusu kalıcı
                olarak silinecek.
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
