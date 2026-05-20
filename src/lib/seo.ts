import type {Metadata} from 'next';
import {contact as FALLBACK_CONTACT} from '@/config/contact';
import type {ContactInfo} from '@/lib/services/contact';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samimisportsclub.com';

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

export function buildAlternates(path: string, locale: string = DEFAULT_LOCALE) {
  return {
    // Canonical points at the *current* locale's URL — each language
    // version is its own canonical, with hreflang declaring the
    // alternatives. Pointing every locale's canonical at TR caused
    // Google to drop the EN pages from the index.
    canonical: absoluteUrl(localePath(path, locale)),
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
    alternates: buildAlternates(path, locale),
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

export type OrganizationJsonLdInput = {
  description?: string;
  sports?: string[];
};

export function organizationJsonLd(
  locale: string,
  info?: Pick<ContactInfo, 'phone' | 'instagram' | 'address' | 'hours'>,
  extra?: OrganizationJsonLdInput
) {
  const phoneTel = info?.phone.tel ?? FALLBACK_CONTACT.phone.tel;
  const instagramUrl = info?.instagram.url ?? FALLBACK_CONTACT.instagram.url;
  const street = info?.address.street ?? FALLBACK_CONTACT.address.street;
  const district = info?.address.district ?? FALLBACK_CONTACT.address.district;
  const city = info?.address.city ?? FALLBACK_CONTACT.address.city;
  const open = info?.hours.open ?? FALLBACK_CONTACT.hours.open;
  const close = info?.hours.close ?? FALLBACK_CONTACT.hours.close;
  return {
    '@context': 'https://schema.org',
    '@type': ['SportsClub', 'LocalBusiness'],
    name: siteName(locale),
    description: extra?.description,
    url: absoluteUrl(localePath('/', locale)),
    telephone: phoneTel,
    image: absoluteUrl('/og.png'),
    priceRange: 'TL',
    sameAs: [instagramUrl],
    sport: extra?.sports,
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: district,
      addressRegion: city,
      addressCountry: 'TR'
    },
    openingHours: `Mo-Su ${open}-${close}`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: open,
        closes: close
      }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phoneTel,
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
