'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';

import {Select} from '@/components/ui/select';

import {CATEGORY_LABELS_TR, GALLERY_CATEGORIES} from './constants';

export function GalleryFilter({current}: {current: string | null}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const onChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const next = new URLSearchParams(params?.toString() ?? '');
    if (e.target.value === 'all') {
      next.delete('cat');
    } else {
      next.set('cat', e.target.value);
    }
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="w-full sm:w-56">
      <Select value={current ?? 'all'} onChange={onChange}>
        <option value="all">Tüm kategoriler</option>
        {GALLERY_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {CATEGORY_LABELS_TR[c]}
          </option>
        ))}
      </Select>
    </div>
  );
}
