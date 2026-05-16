'use client';

import {useState, useTransition} from 'react';
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

import {deleteMessage, markAsNew, markAsRead} from '../actions';

export function MessageActions({
  id,
  isRead
}: {
  id: string;
  isRead: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onToggle = () => {
    startTransition(async () => {
      if (isRead) {
        await markAsNew(id);
      } else {
        await markAsRead(id);
      }
      router.refresh();
    });
  };

  const onConfirmDelete = () => {
    startTransition(async () => {
      // Server action redirects to /admin/mesajlar after delete.
      await deleteMessage(id);
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onToggle}
        disabled={pending}
      >
        {isRead ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            className="border-2 border-red-200 text-red-700 hover:bg-red-50"
          >
            Sil
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mesajı sil?</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Mesaj kalıcı olarak silinecek.
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
  );
}
