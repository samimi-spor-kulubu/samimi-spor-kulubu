'use client';

import {useEffect, useState, type ReactNode} from 'react';
import {ChevronDownIcon} from '@/components/icons';

export type AccordionItem = {
  id: string;
  title: string;
  subtitle: string;
  content: ReactNode;
};

export function ValuesAccordion({
  items,
  expandLabel,
  collapseLabel
}: {
  items: AccordionItem[];
  expandLabel: string;
  collapseLabel: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const validIds = new Set(items.map((i) => i.id));
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (validIds.has(hash)) {
        setOpenId(hash);
        requestAnimationFrame(() => {
          const el = document.getElementById(hash);
          el?.scrollIntoView({behavior: 'smooth', block: 'start'});
        });
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [items]);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
    if (typeof window !== 'undefined' && history.replaceState) {
      const url = openId === id ? window.location.pathname : `#${id}`;
      history.replaceState(null, '', url);
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            id={item.id}
            className={
              'scroll-mt-24 overflow-hidden rounded-2xl border-2 bg-white transition-colors ' +
              (isOpen ? 'border-brand-yellow' : 'border-brand-border')
            }
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`${item.id}-panel`}
              className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-brand-surface"
            >
              <div className="flex-1">
                <h3 className="font-heading text-2xl tracking-wider text-brand-black sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-brand-gray sm:text-base">
                  {item.subtitle}
                </p>
              </div>
              <span
                aria-label={isOpen ? collapseLabel : expandLabel}
                className={
                  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-black transition-transform ' +
                  (isOpen ? 'rotate-180' : '')
                }
              >
                <ChevronDownIcon className="h-5 w-5" />
              </span>
            </button>
            {isOpen && (
              <div
                id={`${item.id}-panel`}
                className="border-t-2 border-brand-border px-6 pb-6 pt-5 sm:px-8"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
