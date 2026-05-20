'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

type ShareButtonsProps = {
  url: string;
  title: string;
};

export function ShareButtons({url, title}: ShareButtonsProps) {
  const t = useTranslations('Blog.share');
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const whatsappHref = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — fall back to a transient prompt-style fallback
      window.prompt(t('copy'), url);
    }
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-brand-border pt-8">
      <span className="mr-2 font-heading text-sm tracking-wider text-brand-black dark:text-white uppercase sm:text-base">
        {t('title')}
      </span>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('whatsapp')}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border-2 border-brand-border bg-white dark:bg-zinc-900 px-4 text-sm font-semibold text-brand-black transition-colors hover:border-brand-yellow hover:bg-brand-yellow"
      >
        <WhatsAppGlyph className="h-4 w-4" />
        <span>WhatsApp</span>
      </a>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('twitter')}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border-2 border-brand-border bg-white dark:bg-zinc-900 px-4 text-sm font-semibold text-brand-black transition-colors hover:border-brand-yellow hover:bg-brand-yellow"
      >
        <XGlyph className="h-4 w-4" />
        <span>X</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={t('copy')}
        aria-live="polite"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border-2 border-brand-border bg-white dark:bg-zinc-900 px-4 text-sm font-semibold text-brand-black transition-colors hover:border-brand-yellow hover:bg-brand-yellow"
      >
        <LinkGlyph className="h-4 w-4" />
        <span>{copied ? t('copied') : t('copy')}</span>
      </button>
    </div>
  );
}

function WhatsAppGlyph({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.95L2 22l4.27-1.12a9.86 9.86 0 0 0 5.76 1.83h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm0 18.13a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.54.67.68-2.47-.2-.32a8.21 8.21 0 1 1 6.54 3.44zm4.5-6.16c-.25-.12-1.45-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.25-.63.79-.77.95-.14.16-.28.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.28.37-.42.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31s-.86.84-.86 2.05.88 2.38 1 2.55c.12.16 1.74 2.65 4.22 3.72.59.25 1.05.4 1.41.51.59.19 1.13.16 1.55.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28z"
      />
    </svg>
  );
}

function XGlyph({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.244 2H21.5l-7.51 8.586L23 22h-6.797l-5.32-6.948L4.8 22H1.54l8.034-9.18L1 2h6.93l4.808 6.36L18.244 2zm-2.385 18h1.88L7.224 4H5.228l10.631 16z"
      />
    </svg>
  );
}

function LinkGlyph({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
