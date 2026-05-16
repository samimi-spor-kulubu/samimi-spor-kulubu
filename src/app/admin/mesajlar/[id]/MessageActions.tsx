'use client';

import {useTransition} from 'react';
import {useRouter} from 'next/navigation';

import {Button} from '@/components/ui/button';

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

  const onDelete = () => {
    if (!confirm('Bu mesajı kalıcı olarak silmek istediğinden emin misin?')) {
      return;
    }
    startTransition(async () => {
      // Server action will redirect after delete.
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
      <Button
        type="button"
        variant="ghost"
        onClick={onDelete}
        disabled={pending}
        className="border-2 border-red-200 text-red-700 hover:bg-red-50"
      >
        Sil
      </Button>
    </div>
  );
}
