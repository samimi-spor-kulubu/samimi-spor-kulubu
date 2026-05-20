import * as React from 'react';

import {cn} from '@/lib/utils';

/**
 * Lightweight styled native <select>. Native is good enough for admin
 * forms — works on mobile out of the box, plays nicely with FormData,
 * no extra hydration cost.
 */
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({className, children, ...props}, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full appearance-none rounded-xl border-2 border-brand-border bg-white dark:bg-zinc-900 px-4 py-2.5 pr-10 text-base text-brand-black dark:text-white transition-colors focus:border-brand-yellow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-brand-gray"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    );
  }
);
Select.displayName = 'Select';
