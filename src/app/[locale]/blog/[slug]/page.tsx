import type {Metadata} from 'next';
import Image from 'next/image';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/navigation';
import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';
import {
  BLOG_BY_SLUG,
  BLOG_POSTS,
  getRelatedPosts,
  localizePost
} from '@/lib/blog';
import {MarkdownContent} from '@/components/blog/MarkdownContent';
import {articleJsonLd, pageMetadata} from '@/lib/seo';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({slug: p.slug}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const post = BLOG_BY_SLUG[slug];
  if (!post) return {};
  const localized = localizePost(post, locale);
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: localized.title,
    description: localized.excerpt,
    ogType: 'article'
  });
}

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(iso));
}

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const post = BLOG_BY_SLUG[slug];
  if (!post) notFound();

  const tNav = await getTranslations('Nav');
  const tCard = await getTranslations('Blog.card');
  const tRelated = await getTranslations('Blog.related');
  const tCta = await getTranslations('Blog.cta');
  const tCats = await getTranslations('Blog.categories');
  const contact = await getContactInfo();

  const localized = localizePost(post, locale);
  const related = getRelatedPosts(post, 3).map((p) => localizePost(p, locale));
  const dateText = formatDate(post.date, locale);

  const schema = articleJsonLd({
    locale,
    title: localized.title,
    description: localized.excerpt,
    author: post.author,
    datePublished: post.date,
    image: localized.image || undefined,
    slug: post.slug
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
      />
      {/* BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-brand-border bg-brand-surface"
      >
        <ol className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3 text-sm text-brand-gray sm:px-6 lg:px-8">
          <li>
            <Link href="/" className="transition-colors hover:text-brand-black">
              {tNav('home')}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link
              href="/blog"
              className="transition-colors hover:text-brand-black"
            >
              {tNav('blog')}
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="line-clamp-1 font-medium text-brand-black">
            {localized.title}
          </li>
        </ol>
      </nav>

      {/* COVER */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-200">
            {localized.image ? (
              <Image
                src={localized.image}
                alt={localized.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300">
                <span className="px-6 text-center font-heading text-2xl tracking-wider text-brand-gray sm:text-3xl">
                  {localized.title}
                </span>
              </div>
            )}
            <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-brand-yellow px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-black">
              {tCats(post.category)}
            </span>
          </div>
        </div>
      </section>

      {/* TITLE + META + CONTENT */}
      <article className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl leading-tight tracking-wider text-brand-black sm:text-5xl">
            {localized.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-gray">
            <span className="font-medium text-brand-black">
              {localized.author}
            </span>
            <span aria-hidden="true">·</span>
            <span>{dateText}</span>
            <span aria-hidden="true">·</span>
            <span>{tCard('readTime', {minutes: localized.readTime})}</span>
          </div>

          <p className="mt-6 border-l-4 border-brand-yellow pl-5 text-lg leading-relaxed text-brand-gray">
            {localized.excerpt}
          </p>

          <div className="mt-8">
            <MarkdownContent content={localized.content} />
          </div>
        </div>
      </article>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-brand-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl tracking-wider text-brand-black sm:text-4xl">
              {tRelated('title')}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border-2 border-brand-border bg-white transition-all hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 transition-transform duration-300 group-hover:scale-105">
                        <span className="px-4 text-center text-xs font-medium text-brand-gray">
                          {p.title}
                        </span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-brand-yellow px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-black">
                      {tCats(p.category)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-lg tracking-wider text-brand-black">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-brand-gray">
                      {p.excerpt}
                    </p>
                    <div className="mt-auto pt-3 text-xs text-brand-gray">
                      {formatDate(p.date, locale)} ·{' '}
                      {tCard('readTime', {minutes: p.readTime})}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM CTA */}
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
            {contact.phone.display}
          </a>
          <div className="mt-6">
            <a
              href={whatsAppUrl(contact, contact.whatsapp.messages.bilgi)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-black px-8 text-base font-semibold text-white transition-colors hover:bg-zinc-800"
            >
              {tCta('button')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
