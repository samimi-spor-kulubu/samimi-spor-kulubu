import {ImageResponse} from 'next/og';
import {notFound} from 'next/navigation';
import {BLOG_BY_SLUG, localizePost} from '@/lib/blog';
import {OG_SIZE, OG_CONTENT_TYPE, OgCard, loadGoogleFont, ogLabels} from '@/lib/og';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Samimi Spor Kulübü — Blog';

export default async function Image({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const post = BLOG_BY_SLUG[slug];
  if (!post) notFound();

  const localized = localizePost(post, locale);
  const labels = ogLabels(locale);

  // Resolve category label from messages without next-intl runtime overhead.
  const messages = (await import(`../../../../../messages/${locale === 'en' ? 'en' : 'tr'}.json`)).default;
  const categoryLabel = (messages.Blog.categories as Record<string, string>)[post.category] ?? '';

  const bebas = await loadGoogleFont('Bebas Neue');

  return new ImageResponse(
    <OgCard
      kicker={`${labels.blog} · ${categoryLabel.toUpperCase()}`}
      title={localized.title}
      meta={post.author}
    />,
    {
      ...size,
      fonts: [{name: 'BebasNeue', data: bebas, weight: 400, style: 'normal'}]
    }
  );
}
