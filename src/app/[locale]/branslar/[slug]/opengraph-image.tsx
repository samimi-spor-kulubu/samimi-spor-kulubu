import {ImageResponse} from 'next/og';
import {notFound} from 'next/navigation';
import {BRANCH_BY_SLUG, type BranchSlug} from '@/lib/branches';
import {OG_SIZE, OG_CONTENT_TYPE, OgCard, loadGoogleFont, ogLabels} from '@/lib/og';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Samimi Spor Kulübü';

export default async function Image({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const branch = BRANCH_BY_SLUG.get(slug as BranchSlug);
  if (!branch) notFound();

  const labels = ogLabels(locale);

  // Load just the branch data we need, locale-aware, statically via a tiny lookup.
  const messages = (await import(`../../../../../messages/${locale === 'en' ? 'en' : 'tr'}.json`)).default;
  const items = messages.Branches.items as Record<string, {name: string; schedule: string}>;
  const branchData = items[branch.key];
  const title = branchData.name.toLocaleUpperCase(locale === 'en' ? 'en' : 'tr');
  const meta = branchData.schedule;

  const bebas = await loadGoogleFont('Bebas Neue');

  return new ImageResponse(
    <OgCard kicker={labels.branch} title={title} meta={meta} emoji={branch.emoji} />,
    {
      ...size,
      fonts: [{name: 'BebasNeue', data: bebas, weight: 400, style: 'normal'}]
    }
  );
}
