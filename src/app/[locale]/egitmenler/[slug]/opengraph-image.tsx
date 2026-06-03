import {ImageResponse} from 'next/og';
import {notFound} from 'next/navigation';

import {getTrainerBySlug} from '@/lib/services/trainers';
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
  const trainer = await getTrainerBySlug(slug, locale);
  if (!trainer) notFound();

  const labels = ogLabels(locale);
  const bebas = await loadGoogleFont('Bebas Neue');

  return new ImageResponse(
    <OgCard
      kicker={labels.trainer}
      title={trainer.name.toLocaleUpperCase(locale === 'en' ? 'en' : 'tr')}
      meta={trainer.title ?? ''}
    />,
    {
      ...size,
      fonts: [{name: 'BebasNeue', data: bebas, weight: 400, style: 'normal'}]
    }
  );
}
