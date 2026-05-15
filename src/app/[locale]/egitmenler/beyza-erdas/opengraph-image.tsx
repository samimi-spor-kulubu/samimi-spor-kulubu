import {ImageResponse} from 'next/og';
import {OG_SIZE, OG_CONTENT_TYPE, OgCard, loadGoogleFont, ogLabels} from '@/lib/og';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Beyza Erdaş';

export default async function Image({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const labels = ogLabels(locale);
  const messages = (await import(`../../../../../messages/${locale === 'en' ? 'en' : 'tr'}.json`)).default;
  const t = messages.Trainers.items.beyza as {name: string; title: string};

  const bebas = await loadGoogleFont('Bebas Neue');

  return new ImageResponse(
    <OgCard
      kicker={labels.trainer}
      title={t.name.toLocaleUpperCase(locale === 'en' ? 'en' : 'tr')}
      meta={t.title}
    />,
    {
      ...size,
      fonts: [{name: 'BebasNeue', data: bebas, weight: 400, style: 'normal'}]
    }
  );
}
