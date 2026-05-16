import {getTranslations} from 'next-intl/server';
import {PILATES_PRICES} from '@/lib/branches';

export async function PilatesPrices({
  className,
  as: HeadingTag = 'h3'
}: {
  className?: string;
  /** Heading level for the section title. h3 (default) when nested inside another section's h2; h2 when used as a top-level section. */
  as?: 'h2' | 'h3';
}) {
  const t = await getTranslations('Branches.prices');

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
            {PILATES_PRICES.map((p) => (
              <tr key={p.key}>
                <td className="py-3 font-medium text-brand-black">
                  {t(`packages.${p.key}`)}
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
