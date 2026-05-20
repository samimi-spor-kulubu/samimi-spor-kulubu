'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';

/**
 * Resets scroll to the top whenever the route changes via client-side
 * navigation. Next.js usually does this on its own, but the next-intl
 * Link wrapper occasionally leaves position untouched when navigating
 * from the bottom of a long page (e.g. the footer's SSS link). This
 * component is a defensive belt-and-suspenders fix.
 *
 * Uses native `next/navigation` `usePathname` (returns the *full* path
 * including any locale prefix) so we react to every real route change,
 * not just locale-stripped path changes.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Logged unconditionally so we can verify the effect fires on the
    // deployed site. Remove once the scroll behaviour is confirmed.
    console.log('[ScrollToTop] pathname changed to:', pathname);
    // Scroll immediately…
    window.scrollTo({top: 0, left: 0, behavior: 'auto'});
    // …and again on the next frame, in case the new route's content
    // hadn't mounted yet when the effect first ran (anchor targets,
    // hash restoration, etc. can otherwise nudge the page back down).
    const raf = window.requestAnimationFrame(() => {
      window.scrollTo({top: 0, left: 0, behavior: 'auto'});
    });
    return () => window.cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
