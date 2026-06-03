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

import {deleteTrainer, toggleActive} from './actions';

export function TrainerCard({
  id,
  name,
  titleTr,
  photo,
  orderIndex,
  active
}: {
  id: string;
  name: string;
  titleTr: string | null;
  photo: string | null;
  orderIndex: number;
  active: boolean;
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
      await deleteTrainer(id);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <article
      className={
        'overflow-hidden rounded-2xl border-2 bg-white transition-colors ' +
        (active ? 'border-brand-border' : 'border-brand-border bg-zinc-50')
      }
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-200">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={name}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-brand-gray">
            (fotoğraf yok)
          </div>
        )}
        {!active && (
          <span className="absolute right-2 top-2 inline-flex items-center rounded-full bg-zinc-900/85 px-2.5 py-0.5 text-xs font-semibold text-white">
            Pasif
          </span>
        )}
        <span className="absolute left-2 top-2 inline-flex items-center rounded-full bg-brand-yellow px-2.5 py-0.5 text-xs font-semibold text-brand-black">
          #{orderIndex}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p
            className={
              'font-heading text-lg tracking-wider ' +
              (active ? 'text-brand-black' : 'text-brand-gray')
            }
          >
            {name}
          </p>
          {titleTr && (
            <p className="mt-0.5 truncate text-xs text-brand-gray" title={titleTr}>
              {titleTr}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={active}
            disabled={pending}
            onCheckedChange={onToggle}
            aria-label={active ? 'Pasif yap' : 'Aktif yap'}
          />
          <span className="text-xs text-brand-gray">
            {active ? 'Aktif' : 'Pasif'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/egitmenler/${id}/duzenle`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full border-2 border-brand-border px-3 text-xs font-semibold text-brand-black transition-colors hover:border-brand-black"
          >
            Düzenle
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                disabled={pending}
                className="inline-flex h-9 flex-1 items-center justify-center rounded-full border-2 border-red-200 px-3 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                Sil
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Eğitmeni sil?</DialogTitle>
                <DialogDescription>
                  Bu işlem geri alınamaz. &quot;{name}&quot; eğitmeni kalıcı
                  olarak silinecek. Atandığı branş varsa eğitmensiz kalır.
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
      </div>
    </article>
  );
}
