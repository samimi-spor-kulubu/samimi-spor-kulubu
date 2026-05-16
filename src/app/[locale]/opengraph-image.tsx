import {ImageResponse} from 'next/og';
import {OG_SIZE, OG_CONTENT_TYPE, OgCard, loadGoogleFont, ogLabels} from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Samimi Spor Kulübü';

export default async function Image({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const labels = ogLabels(locale);
  const title =
    locale === 'en' ? 'MOVE, GROW, WIN' : 'HAREKET ET, GÜÇLEN, KAZAN';
  const meta =
    locale === 'en' ? 'Ankara Yenimahalle Demet' : 'Ankara Yenimahalle Demet';

  const bebas = await loadGoogleFont('Bebas Neue');

  return new ImageResponse(
    <OgCard kicker={labels.siteName} title={title} meta={meta} />,
    {
      ...size,
      fonts: [{name: 'BebasNeue', data: bebas, weight: 400, style: 'normal'}]
    }
  );
}
