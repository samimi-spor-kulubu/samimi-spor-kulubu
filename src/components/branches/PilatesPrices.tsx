import {getTranslations} from 'next-intl/server';

import type {BranchPricePackage} from '@/types/database';

/** Single source of truth for Pilates prices (shown on /fiyatlar and the
 *  Reformer Pilates page). Update here only. */
const PACKAGES: BranchPricePackage[] = [
  {key: 'group4', campaign: '3.150 TL', normal: '4.200 TL'},
  {key: 'group3', campaign: '3.900 TL', normal: '5.200 TL'},
  {key: 'group2', campaign: '4.875 TL', normal: '6.500 TL'},
  {key: 'individual', campaign: '6.750 TL', normal: '9.000 TL'}
];

export async function PilatesPrices({
  className,
  as: HeadingTag = 'h3'
}: {
  className?: string;
  /** Heading level for the section title. h3 (default) when nested
   *  inside another section's h2; h2 when used as a top-level section. */
  as?: 'h2' | 'h3';
}) {
  const t = await getTranslations('Branches.prices');
  const rows = PACKAGES;

  return (
    <div className={className}>
      <HeadingTag className="font-heading text-lg tracking-wider text-brand-black dark:text-white">
        {t('title')}
      </HeadingTag>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-border text-xs uppercase tracking-widest text-brand-gray">
              <th className="py-2 font-semibold">{t('package')}</th>
              <th className="py-2 text-right font-semibold">
                {t('campaign')}
              </th>
              <th className="py-2 text-right font-semibold">
                {t('normal')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {rows.map((p) => (
              <tr key={p.key}>
                <td className="py-3 font-medium text-brand-black dark:text-white">
                  {/* Try messages first (group4/group3/group2/individual),
                      fall back to the raw key for admin-added entries. */}
                  {t.has(`packages.${p.key}`)
                    ? t(`packages.${p.key}`)
                    : p.key}
                </td>
                <td className="py-3 text-right font-semibold text-brand-amber">
                  {p.campaign}
                </td>
                <td className="py-3 text-right text-brand-gray line-through">
                  {p.normal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 rounded-lg bg-brand-yellow/20 px-4 py-2 text-sm font-medium text-brand-black dark:text-white">
        {t('discountNote')}
      </p>
    </div>
  );
}
