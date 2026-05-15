import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {contact} from '@/config/contact';
import {InstagramIcon} from '@/components/icons';

const QUICK_LINKS = [
  {href: '/branslar', tKey: 'branches'},
  {href: '/egitmenler', tKey: 'trainers'},
  {href: '/galeri', tKey: 'gallery'},
  {href: '/blog', tKey: 'blog'},
  {href: '/hakkimizda', tKey: 'about'},
  {href: '/iletisim', tKey: 'contact'},
  {href: '/sss', tKey: 'faq'}
] as const;

export function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const tSite = useTranslations('Site');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-heading text-2xl tracking-wider">
              SAMİMİ <span className="text-brand-yellow">SPOR</span> KULÜBÜ
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
            <h3 className="font-heading text-lg tracking-wider text-brand-yellow">
              {t('quickLinks')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {QUICK_LINKS.map(({href, tKey}) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-zinc-300 hover:text-white transition-colors"
                  >
                    {tNav(tKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg tracking-wider text-brand-yellow">
              {t('contactTitle')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li>
                <a
                  href={`tel:${contact.phone.tel}`}
                  className="hover:text-white transition-colors"
                >
                  {contact.phone.display}
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
            <h3 className="font-heading text-lg tracking-wider text-brand-yellow">
              {t('hoursTitle')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li>{contact.hours.days}</li>
              <li className="text-white">{contact.hours.weekdays}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-zinc-400">
          {t('copyright', {year})} · {tSite('name')}
        </div>
      </div>
    </footer>
  );
}
