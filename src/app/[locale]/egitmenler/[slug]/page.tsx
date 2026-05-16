import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {TrainerDetail} from '@/components/trainers/TrainerDetail';
import {pageMetadata} from '@/lib/seo';
import {
  getAllTrainerSlugs,
  getBranchForTrainer,
  getTrainerBySlug
} from '@/lib/services/trainers';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllTrainerSlugs();
  return slugs.map((slug) => ({slug}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const trainer = await getTrainerBySlug(slug, locale);
  if (!trainer) return {};
  return pageMetadata({
    locale,
    path: `/egitmenler/${slug}`,
    title: trainer.name,
    description: trainer.shortBio ?? trainer.title ?? trainer.name
  });
}

export default async function TrainerDetailPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const trainer = await getTrainerBySlug(slug, locale);
  if (!trainer) notFound();

  const branch = await getBranchForTrainer(trainer.id, locale);

  return <TrainerDetail trainer={trainer} branch={branch} locale={locale} />;
}
