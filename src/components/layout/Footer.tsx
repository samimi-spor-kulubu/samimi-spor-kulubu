import {useTranslations} from 'next-intl';
import {InstagramIcon} from '@/components/icons';
import {SmoothScrollLink} from '@/components/common/SmoothScrollLink';
import type {ContactInfo} from '@/lib/services/contact';
import {TourReplayLink} from '@/components/tour/SiteTour';

const QUICK_LINKS = [
  {href: '/branslar', tKey: 'branches'},
  {href: '/egitmenler', tKey: 'trainers'},
  {href: '/galeri', tKey: 'gallery'},
  {href: '/blog', tKey: 'blog'},
  {href: '/hakkimizda', tKey: 'about'},
  {href: '/iletisim', tKey: 'contact'},
  {href: '/sss', tKey: 'faq'}
] as const;

export function Footer({contact}: {contact: ContactInfo}) {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const tSite = useTranslations('Site');
  const tCommon = useTranslations('Common');
  const tTour = useTranslations('Tour.onboarding');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-heading text-2xl tracking-wider">
              SAMİMİ <span className="gold-shimmer">SPOR</span> KULÜBÜ
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              {t('tagline')}
            </p>
            <a
              href={contact.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-brand-yellow transition-colors"
              aria-label={`Instagram: ${contact.instagram.handle}`}
            >
              <InstagramIcon className="h-5 w-5" />
              <span>{contact.instagram.handle}</span>
            </a>
          </div>

          <div>
            <h3 className="font-heading text-lg tracking-wider gold-shimmer">
              {t('quickLinks')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {QUICK_LINKS.map(({href, tKey}) => (
                <li key={href}>
                  <SmoothScrollLink
                    href={href}
                    data-tour={href === '/sss' ? 'faq-link' : undefined}
                    className="text-zinc-300 hover:text-white transition-colors"
                  >
                    {tNav(tKey)}
                  </SmoothScrollLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg tracking-wider gold-shimmer">
              {t('contactTitle')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li>
                <a
                  href={`tel:${contact.phone.tel}`}
                  className="hover:text-white transition-colors"
                >
                  {tCommon('callNow')} — {contact.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={contact.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {contact.address.full}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg tracking-wider gold-shimmer">
              {t('hoursTitle')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li>{contact.hours.days}</li>
              <li className="text-white">{contact.hours.weekdays}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 text-center text-xs text-zinc-400">
          <div className="gold-line mb-6" />
          {t('copyright', {year})} · {tSite('name')}
          <span aria-hidden="true" className="mx-2">·</span>
          <TourReplayLink label={tTour('replay')} />
        </div>
      </div>
    </footer>
  );
}
