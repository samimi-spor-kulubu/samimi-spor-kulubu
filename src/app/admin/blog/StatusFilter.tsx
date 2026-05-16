'use client';

import {usePathname, useRouter, useSearchParams} from 'next/navigation';

const FILTERS: ReadonlyArray<{value: string; label: string}> = [
  {value: 'all', label: 'Tümü'},
  {value: 'published', label: 'Yayında'},
  {value: 'draft', label: 'Taslak'},
  {value: 'scheduled', label: 'Zamanlanmış'}
];

export function StatusFilter({current}: {current: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const onPick = (value: string) => {
    const next = new URLSearchParams(params?.toString() ?? '');
    if (value === 'all') {
      next.delete('status');
    } else {
      next.set('status', value);
    }
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const active = f.value === current;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => onPick(f.value)}
            className={
              'inline-flex h-9 items-center rounded-full border-2 px-4 text-xs font-semibold transition-colors ' +
              (active
                ? 'border-brand-black bg-brand-yellow text-brand-black'
                : 'border-brand-border bg-white text-brand-black hover:border-brand-black')
            }
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
