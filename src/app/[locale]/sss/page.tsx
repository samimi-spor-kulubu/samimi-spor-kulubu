import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {FaqClient} from '@/components/faq/FaqClient';
import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';
import {pageMetadata} from '@/lib/seo';
import type {
  FAQCategory,
  LocalizedFAQItem
} from '@/lib/constants/faq-categories';
import {getAllFaqs} from '@/lib/services/faqs';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const tHero = await getTranslations({locale, namespace: 'Faq.hero'});
  const t = await getTranslations({locale, namespace: 'Faq'});
  return pageMetadata({
    locale,
    path: '/sss',
    title: tHero('title'),
    description: t('seoDescription')
  });
}

export default async function SssPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const tHero = await getTranslations('Faq.hero');
  const tCta = await getTranslations('Faq.cta');
  const tCommon = await getTranslations('Common');

  const faqs = await getAllFaqs(locale);
  const contact = await getContactInfo();

  // Adapt service shape (`link: {href, label} | null`) to FaqClient's
  // expected shape (`link?: {label, href}`).
  const items: LocalizedFAQItem[] = faqs.map((f) => ({
    id: f.id,
    category: f.category as FAQCategory,
    question: f.question,
    answer: f.answer,
    link: f.link
      ? {label: f.link.label, href: f.link.href}
      : undefined
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  };

  return (
    <>
      {/* HERO */}
      <section className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-heading text-4xl tracking-wider text-brand-black dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {tHero('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-gray">
            {tHero('subtitle')}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <FaqClient items={items} />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-yellow">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-heading text-3xl leading-tight tracking-wider text-brand-black sm:text-4xl">
            {tCta('title')}
          </h2>
          <p className="mt-4 text-base text-brand-black/80 sm:text-lg">
            {tCta('description')}
          </p>
          <a
            href={`tel:${contact.phone.tel}`}
            className="mt-6 inline-block font-heading text-2xl tracking-wider text-brand-black transition-opacity hover:opacity-80 sm:text-3xl"
          >
            {tCommon('callNow')} — {contact.phone.display}
          </a>
          <div className="mt-6">
            <a
              href={whatsAppUrl(contact, locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-black px-8 text-base font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              {tCta('button')}
            </a>
          </div>
        </div>
      </section>

      {/* JSON-LD schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
      />
    </>
  );
}
