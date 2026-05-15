'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ChevronDownIcon} from '@/components/icons';
import {FAQ_CATEGORIES, type FAQCategory, type LocalizedFAQItem} from '@/lib/faqs';

type Filter = 'all' | FAQCategory;

export function FaqClient({items}: {items: LocalizedFAQItem[]}) {
  const tFilter = useTranslations('Faq.filter');
  const tAccordion = useTranslations('Faq.accordion');
  const tCats = useTranslations('Faq.categories');
  const [filter, setFilter] = useState<Filter>('all');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [filter, items]
  );

  const counts = useMemo(() => {
    const map: Record<FAQCategory, number> = {
      membership: 0,
      classes: 0,
      facility: 0,
      pilates: 0,
      payment: 0
    };
    for (const item of items) map[item.category] += 1;
    return map;
  }, [items]);

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>
          {tFilter('all')} ({items.length})
        </FilterPill>
        {FAQ_CATEGORIES.map((c) => (
          <FilterPill
            key={c}
            active={filter === c}
            onClick={() => setFilter(c)}
          >
            {tCats(c)} ({counts[c]})
          </FilterPill>
        ))}
      </div>

      {/* Accordion */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-brand-gray">{tFilter('noResults')}</p>
      ) : (
        <div className="mt-10 space-y-3">
          {filtered.map((item) => {
            const isOpen = openIds.has(item.id);
            return (
              <div
                key={item.id}
                className={
                  'overflow-hidden rounded-2xl border-2 bg-white transition-colors ' +
                  (isOpen ? 'border-brand-yellow' : 'border-brand-border')
                }
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-panel`}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-brand-surface sm:p-6"
                  >
                    <span className="flex-1 font-heading text-lg tracking-wide text-brand-black sm:text-xl">
                      {item.question}
                    </span>
                    <span
                      aria-label={isOpen ? tAccordion('collapse') : tAccordion('expand')}
                      className={
                        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-black transition-transform ' +
                        (isOpen ? 'rotate-180' : '')
                      }
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={`${item.id}-panel`}
                    className="border-t-2 border-brand-border px-5 pb-5 pt-4 sm:px-6 sm:pb-6"
                  >
                    <p className="whitespace-pre-line text-base leading-relaxed text-brand-gray">
                      {item.answer}
                    </p>
                    {item.link && (
                      <Link
                        href={item.link.href}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-yellow-dark transition-colors hover:text-brand-black"
                      >
                        {item.link.label} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex h-10 items-center rounded-full border-2 px-5 text-sm font-semibold transition-colors ' +
        (active
          ? 'border-brand-black bg-brand-yellow text-brand-black'
          : 'border-brand-border bg-white text-brand-black hover:border-brand-black')
      }
    >
      {children}
    </button>
  );
}
