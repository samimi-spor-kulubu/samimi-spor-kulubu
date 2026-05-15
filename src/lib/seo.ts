import type {Metadata} from 'next';
import {contact} from '@/config/contact';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samimisporkulubu.com';

export const DEFAULT_LOCALE = 'tr';
export const LOCALES = ['tr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

const SITE_NAME_TR = 'Samimi Spor Kulübü';
const SITE_NAME_EN = 'Samimi Sports Club';

function siteName(locale: string): string {
  return locale === 'en' ? SITE_NAME_EN : SITE_NAME_TR;
}

function ensureLeading(path: string): string {
  if (path === '') return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

export function localePath(path: string, locale: string): string {
  const clean = ensureLeading(path);
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

export function absoluteUrl(path: string): string {
  const clean = ensureLeading(path);
  return `${SITE_URL}${clean === '/' ? '' : clean}`;
}

export function buildAlternates(path: string) {
  return {
    canonical: absoluteUrl(localePath(path, DEFAULT_LOCALE)),
    languages: {
      tr: absoluteUrl(localePath(path, 'tr')),
      en: absoluteUrl(localePath(path, 'en')),
      'x-default': absoluteUrl(localePath(path, DEFAULT_LOCALE))
    }
  };
}

export type PageMetadataInput = {
  locale: string;
  /** Route path inside the [locale] segment, e.g. "/branslar/reformer-pilates" */
  path: string;
  title: string;
  description: string;
  ogType?: 'website' | 'article';
};

export function pageMetadata({
  locale,
  path,
  title,
  description,
  ogType = 'website'
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(localePath(path, locale));
  const name = siteName(locale);
  const fullTitle = title === name ? title : `${title} — ${name}`;
  // og:image and twitter:image are handled by opengraph-image.tsx convention
  // files at each route segment; we intentionally do not duplicate them here.
  return {
    title: fullTitle,
    description,
    alternates: buildAlternates(path),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: name,
      locale: locale === 'en' ? 'en_US' : 'tr_TR',
      type: ogType
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description
    }
  };
}

export function organizationJsonLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    name: siteName(locale),
    url: absoluteUrl(localePath('/', locale)),
    telephone: contact.phone.tel,
    image: absoluteUrl('/og.png'),
    sameAs: [contact.instagram.url],
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.district,
      addressRegion: contact.address.city,
      addressCountry: 'TR'
    },
    openingHours: `Mo-Su ${contact.hours.open}-${contact.hours.close}`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contact.phone.tel,
      contactType: 'customer service',
      availableLanguage: ['Turkish', 'English']
    }
  };
}

export function serviceJsonLd({
  locale,
  name,
  description,
  slug
}: {
  locale: string;
  name: string;
  description: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(localePath(`/branslar/${slug}`, locale)),
    provider: {
      '@type': 'SportsClub',
      name: siteName(locale),
      url: absoluteUrl(localePath('/', locale))
    },
    areaServed: {
      '@type': 'City',
      name: 'Ankara'
    }
  };
}

export function personJsonLd({
  locale,
  name,
  jobTitle,
  image,
  slug
}: {
  locale: string;
  name: string;
  jobTitle: string;
  image?: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    image: image ? absoluteUrl(image) : undefined,
    url: absoluteUrl(localePath(`/egitmenler/${slug}`, locale)),
    worksFor: {
      '@type': 'SportsClub',
      name: siteName(locale),
      url: absoluteUrl(localePath('/', locale))
    }
  };
}

export function articleJsonLd({
  locale,
  title,
  description,
  author,
  datePublished,
  image,
  slug
}: {
  locale: string;
  title: string;
  description: string;
  author: string;
  datePublished: string;
  image?: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: [image ? absoluteUrl(image) : absoluteUrl('/og.png')],
    datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: siteName(locale),
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/og.png')
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(localePath(`/blog/${slug}`, locale))
    }
  };
}
