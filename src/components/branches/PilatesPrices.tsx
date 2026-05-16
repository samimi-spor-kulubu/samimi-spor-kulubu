import {getTranslations} from 'next-intl/server';

import type {BranchPricePackage} from '@/types/database';

/** Fallback package list — used when a branch doesn't carry price_info. */
const FALLBACK_PACKAGES: BranchPricePackage[] = [
  {key: 'group4', campaign: '4.200 TL', normal: '5.000 TL'},
  {key: 'group3', campaign: '5.200 TL', normal: '5.750 TL'},
  {key: 'group2', campaign: '6.500 TL', normal: '6.750 TL'},
  {key: 'individual', campaign: '9.000 TL', normal: '10.500 TL'}
];

export async function PilatesPrices({
  className,
  as: HeadingTag = 'h3',
  packages
}: {
  className?: string;
  /** Heading level for the section title. h3 (default) when nested
   *  inside another section's h2; h2 when used as a top-level section. */
  as?: 'h2' | 'h3';
  /** Packages from the branch row's price_info.packages, or fallback. */
  packages?: BranchPricePackage[] | null;
}) {
  const t = await getTranslations('Branches.prices');
  const rows =
    packages && packages.length > 0 ? packages : FALLBACK_PACKAGES;

  return (
    <div className={className}>
      <HeadingTag className="font-heading text-lg tracking-wider text-brand-black">
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
                <td className="py-3 font-medium text-brand-black">
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
    </div>
  );
}
