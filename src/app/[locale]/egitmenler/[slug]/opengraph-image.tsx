import {ImageResponse} from 'next/og';
import {notFound} from 'next/navigation';
import {OG_SIZE, OG_CONTENT_TYPE, OgCard, loadGoogleFont, ogLabels} from '@/lib/og';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Samimi Spor Kulübü';

// Slug → translation key in messages files. Mirrors trainer rows whose
// slugs are stable. New trainers added via admin will fall back to the
// site-level OG image.
const SLUG_TO_KEY: Record<string, 'beyza' | 'esat'> = {
  'beyza-erdas': 'beyza',
  'esat-mahmut-akin': 'esat'
};

export default async function Image({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const key = SLUG_TO_KEY[slug];
  if (!key) notFound();

  const labels = ogLabels(locale);
  const messages = (
    await import(`../../../../../messages/${locale === 'en' ? 'en' : 'tr'}.json`)
  ).default;
  const t = messages.Trainers.items[key] as {name: string; title: string};

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
