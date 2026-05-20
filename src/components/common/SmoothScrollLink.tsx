'use client';

import {type ComponentProps, type MouseEvent} from 'react';
import {Link} from '@/i18n/navigation';

/**
 * Drop-in replacement for the locale-aware `Link` that also scrolls
 * the window to the top on click. Used by chrome (Footer, Navbar)
 * where the user is typically at the bottom of a long page and the
 * default scroll-restoration occasionally leaves them stranded.
 *
 * Forwards every prop straight through to `next-intl`'s Link, and
 * runs any caller-provided `onClick` after the scroll call so
 * existing behaviours (mobile menu close, body overflow reset)
 * continue to fire.
 */
type Props = ComponentProps<typeof Link>;

export function SmoothScrollLink({onClick, ...props}: Props) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }
    onClick?.(e);
  };

  return <Link {...props} onClick={handleClick} />;
}
