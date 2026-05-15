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
  const t = await getTranslations({locale, namespace: 'Trainers.items.beyza'});
  return pageMetadata({
    locale,
    path: '/egitmenler/beyza-erdas',
    title: t('name'),
    description: t('shortBio')
  });
}

export default async function BeyzaErdasPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  return <TrainerDetail trainerKey="beyza" locale={locale} />;
}
