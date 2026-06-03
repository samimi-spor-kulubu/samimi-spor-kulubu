import {ImageResponse} from 'next/og';
import {notFound} from 'next/navigation';

import {getBranchBySlug} from '@/lib/services/branches';
import {OG_SIZE, OG_CONTENT_TYPE, OgCard, loadGoogleFont, ogLabels} from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Samimi Spor Kulübü';

export default async function Image({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const branch = await getBranchBySlug(slug, locale);
  if (!branch) notFound();

  const labels = ogLabels(locale);
  const title = branch.name.toLocaleUpperCase(locale === 'en' ? 'en' : 'tr');
  const meta = branch.schedule ?? '';

  const bebas = await loadGoogleFont('Bebas Neue');

  return new ImageResponse(
    <OgCard
      kicker={labels.branch}
      title={title}
      meta={meta}
      emoji={branch.emoji ?? undefined}
    />,
    {
      ...size,
      fonts: [{name: 'BebasNeue', data: bebas, weight: 400, style: 'normal'}]
    }
  );
}
