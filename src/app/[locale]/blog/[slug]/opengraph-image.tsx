import {ImageResponse} from 'next/og';
import {notFound} from 'next/navigation';

import {getBlogPostBySlug} from '@/lib/services/blog';
import {blogCategoryLabel} from '@/lib/constants/blog-categories';
import {OG_SIZE, OG_CONTENT_TYPE, OgCard, loadGoogleFont, ogLabels} from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Samimi Spor Kulübü — Blog';

export default async function Image({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const post = await getBlogPostBySlug(slug, locale);
  if (!post) notFound();

  const labels = ogLabels(locale);
  const catLabel = blogCategoryLabel(post.category, locale).toLocaleUpperCase(
    locale === 'en' ? 'en' : 'tr'
  );

  const bebas = await loadGoogleFont('Bebas Neue');

  return new ImageResponse(
    <OgCard
      kicker={`${labels.blog} · ${catLabel}`}
      title={post.title}
      meta={post.author ?? ''}
    />,
    {
      ...size,
      fonts: [{name: 'BebasNeue', data: bebas, weight: 400, style: 'normal'}]
    }
  );
}
