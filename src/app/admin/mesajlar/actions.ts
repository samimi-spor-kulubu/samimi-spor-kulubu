'use server';

import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

import {createAdminClient} from '@/lib/supabase/admin';

export async function markAsRead(id: string) {
  const admin = createAdminClient();
  const {error} = await admin
    .from('contact_messages')
    .update({status: 'read'})
    .eq('id', id);

  if (error) {
    console.error('[messages.markAsRead]', error);
    throw new Error('Mesaj güncellenemedi.');
  }

  revalidatePath('/admin/mesajlar');
  revalidatePath(`/admin/mesajlar/${id}`);
  revalidatePath('/admin');
}

export async function markAsNew(id: string) {
  const admin = createAdminClient();
  const {error} = await admin
    .from('contact_messages')
    .update({status: 'new'})
    .eq('id', id);

  if (error) {
    console.error('[messages.markAsNew]', error);
    throw new Error('Mesaj güncellenemedi.');
  }

  revalidatePath('/admin/mesajlar');
  revalidatePath(`/admin/mesajlar/${id}`);
  revalidatePath('/admin');
}

export async function deleteMessage(id: string) {
  const admin = createAdminClient();
  const {error} = await admin.from('contact_messages').delete().eq('id', id);

  if (error) {
    console.error('[messages.deleteMessage]', error);
    throw new Error('Mesaj silinemedi.');
  }

  revalidatePath('/admin/mesajlar');
  revalidatePath('/admin');
  redirect('/admin/mesajlar');
}
