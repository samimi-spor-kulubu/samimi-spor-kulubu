import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
  localePrefix: 'as-needed',
  // Stop auto-redirecting based on Accept-Language. Google was indexing
  // the site only in English because the bot's locale tripped this.
  // Visitors pick the language explicitly via the LanguageSwitcher.
  localeDetection: false
});
