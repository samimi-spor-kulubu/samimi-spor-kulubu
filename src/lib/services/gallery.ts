import 'server-only';
import {createPublicClient} from '@/lib/supabase/public';

export type LocalizedGalleryItem = {
  id: string;
  key: string;
  src: string | null;
  category: string;
  title: string;
  order_index: number;
};

function pickTitle(
  tr: string | null,
  en: string | null,
  locale: string
): string {
  if (locale === 'en') return en ?? tr ?? '';
  return tr ?? en ?? '';
}

/**
 * Active gallery items ordered by `order_index`. Empty title falls back
 * to the other locale, then to '' so the caller can decide what to show
 * (we don't surface admin-side keys to the public site).
 */
export async function getAllGalleryItems(
  locale: string
): Promise<LocalizedGalleryItem[]> {
  const supabase = createPublicClient();
  const {data, error} = await supabase
    .from('gallery_items')
    .select('id, key, src, category, title_tr, title_en, order_index')
    .eq('active', true)
    .order('order_index', {ascending: true});

  if (error) {
    console.error('[gallery.getAllGalleryItems]', error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    key: row.key,
    src: row.src,
    category: row.category,
    title: pickTitle(row.title_tr, row.title_en, locale),
    order_index: row.order_index
  }));
}
