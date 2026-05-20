'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {ChevronDownIcon} from '@/components/icons';

export type HomeFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function HomeFaqAccordion({items}: {items: HomeFaqItem[]}) {
  const t = useTranslations('Faq.accordion');
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="mt-10 space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={
              'overflow-hidden rounded-2xl border-2 bg-white dark:bg-zinc-900 transition-colors ' +
              (isOpen
                ? 'border-brand-yellow'
                : 'border-brand-border hover:border-brand-yellow')
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
                <span className="flex-1 font-heading text-lg tracking-wide text-brand-black dark:text-white sm:text-xl">
                  {item.question}
                </span>
                <span
                  aria-label={isOpen ? t('collapse') : t('expand')}
                  className={
                    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-black transition-transform duration-200 ' +
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
                <p className="text-base leading-relaxed text-brand-gray">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
