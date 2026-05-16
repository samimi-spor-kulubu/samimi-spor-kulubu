import type {Metadata} from 'next';
import {Bebas_Neue, Barlow} from 'next/font/google';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {Navbar} from '@/components/layout/Navbar';
import {Footer} from '@/components/layout/Footer';
import {organizationJsonLd, pageMetadata, SITE_URL} from '@/lib/seo';
import '../globals.css';

const barlow = Barlow({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700']
});

const bebasNeue = Bebas_Neue({
  variable: '--font-heading',
  subsets: ['latin', 'latin-ext'],
  weight: '400'
});

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Site'});
  return {
    ...pageMetadata({
      locale,
      path: '/',
      title: t('name'),
      description: t('seoDescription')
    }),
    metadataBase: new URL(SITE_URL)
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const tNav = await getTranslations({locale, namespace: 'Nav'});

  return (
    <html
      lang={locale}
      className={`${barlow.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <a href="#main" className="skip-link">
            {tNav('skipToContent')}
          </a>
          <Navbar />
          <main id="main" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(locale))
          }}
        />
      </body>
    </html>
  );
}
