import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {TrainerDetail} from '@/components/trainers/TrainerDetail';
import {pageMetadata} from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Trainers.items.esat'});
  return pageMetadata({
    locale,
    path: '/egitmenler/esat-mahmut-akin',
    title: t('name'),
    description: t('seoDescription')
  });
}

export default async function EsatMahmutAkinPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  return <TrainerDetail trainerKey="esat" locale={locale} />;
}
