import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ContactForm} from '@/components/contact/ContactForm';
import {
  InstagramIcon,
  PhoneIcon,
  WhatsAppIcon
} from '@/components/icons';
import {pageMetadata} from '@/lib/seo';
import {getContactInfo, whatsAppUrl} from '@/lib/services/contact';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const tHero = await getTranslations({locale, namespace: 'Contact.hero'});
  const t = await getTranslations({locale, namespace: 'Contact'});
  return pageMetadata({
    locale,
    path: '/iletisim',
    title: tHero('title'),
    description: t('seoDescription')
  });
}

export default async function IletisimPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const tHero = await getTranslations('Contact.hero');
  const tMethods = await getTranslations('Contact.methods');
  const tLoc = await getTranslations('Contact.location');
  const tForm = await getTranslations('Contact.form');

  const contact = await getContactInfo();
  const waBilgiUrl = whatsAppUrl(contact, locale);

  const methods = [
    {
      key: 'whatsapp' as const,
      icon: <WhatsAppIcon className="h-7 w-7" />,
      info: contact.phone.display,
      href: waBilgiUrl,
      external: true,
      ctaStyle: 'primary' as const
    },
    {
      key: 'phone' as const,
      icon: <PhoneIcon className="h-7 w-7" />,
      info: contact.phone.display,
      href: `tel:${contact.phone.tel}`,
      external: false,
      ctaStyle: 'outline' as const
    },
    {
      key: 'instagram' as const,
      icon: <InstagramIcon className="h-7 w-7" />,
      info: contact.instagram.handle,
      href: contact.instagram.url,
      external: true,
      ctaStyle: 'outline' as const
    }
  ];

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

      {/* METHOD CARDS */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {methods.map((m) => (
              <div
                key={m.key}
                className="flex flex-col rounded-2xl border-2 border-brand-border bg-white dark:bg-zinc-900 p-6 transition-colors hover:border-brand-yellow sm:p-8"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-brand-black">
                  {m.icon}
                </span>
                <h2 className="mt-5 font-heading text-2xl tracking-wider text-brand-black dark:text-white">
                  {tMethods(`${m.key}.title`)}
                </h2>
                <p className="mt-2 font-heading text-xl tracking-wider text-brand-amber">
                  {m.info}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-gray">
                  {tMethods(`${m.key}.description`)}
                </p>
                <a
                  href={m.href}
                  {...(m.external
                    ? {target: '_blank', rel: 'noopener noreferrer'}
                    : {})}
                  className={
                    'mt-6 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors ' +
                    (m.ctaStyle === 'primary'
                      ? 'bg-brand-yellow text-brand-black hover:bg-brand-yellow-dark'
                      : 'border-2 border-brand-black text-brand-black dark:text-white hover:bg-brand-black hover:text-white')
                  }
                >
                  {tMethods(`${m.key}.cta`)}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-heading text-3xl tracking-wider text-brand-black dark:text-white sm:text-4xl">
            {tLoc('title')}
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Info */}
            <div className="space-y-5 rounded-2xl border-2 border-brand-border bg-brand-surface p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                  {tLoc('addressLabel')}
                </p>
                <p className="mt-1 text-base font-medium text-brand-black dark:text-white">
                  {contact.address.full}
                </p>
                <a
                  href={contact.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex h-10 items-center rounded-full bg-brand-yellow px-5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-yellow-dark"
                >
                  {tLoc('mapsCta')} →
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                  {tLoc('hoursLabel')}
                </p>
                <p className="mt-1 text-base text-brand-black dark:text-white">
                  {contact.hours.days}
                </p>
                <p className="text-base font-medium text-brand-black dark:text-white">
                  {contact.hours.weekdays}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray">
                  {tLoc('transportLabel')}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-brand-gray">
                  {tLoc('transportText')}
                </p>
              </div>
            </div>

            {/* Map embed */}
            <div className="overflow-hidden rounded-2xl border-2 border-brand-border bg-brand-surface">
              <iframe
                src={contact.address.embedUrl}
                title={tLoc('mapTitle')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full min-h-[340px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="bg-brand-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-heading text-3xl tracking-wider text-brand-black dark:text-white sm:text-4xl">
            {tForm('title')}
          </h2>
          <p className="mt-3 text-brand-gray">{tForm('subtitle')}</p>
          <div className="relative mt-8">
            <ContactForm whatsappFallbackUrl={waBilgiUrl} />
          </div>
        </div>
      </section>
    </>
  );
}
