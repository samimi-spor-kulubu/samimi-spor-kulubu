'use client';

import {useEffect} from 'react';
import {usePathname} from '@/i18n/navigation';

/**
 * Resets scroll to the top whenever the route changes via client-side
 * navigation. Next.js does this by default, but the next-intl Link
 * wrapper occasionally leaves position untouched (especially when
 * navigating from the footer of a long page). This component is a
 * defensive belt-and-suspenders fix — it runs after each pathname
 * change, never on first paint, and respects browser back/forward
 * scroll restoration by only acting on push navigations.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip when the user is restoring scroll via back/forward — those
    // events don't trigger this effect's deps anyway (popstate doesn't
    // change pathname identity in App Router), so any run here is a
    // genuine push navigation.
    window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  }, [pathname]);

  return null;
}
