import * as React from 'react';

import {cn} from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, ...props}, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full rounded-xl border-2 border-brand-border bg-white dark:bg-zinc-900 px-4 py-2.5 text-base text-brand-black dark:text-white placeholder:text-zinc-400 transition-colors focus:border-brand-yellow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
