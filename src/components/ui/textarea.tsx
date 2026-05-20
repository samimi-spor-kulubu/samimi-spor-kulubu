import * as React from 'react';

import {cn} from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full resize-y rounded-xl border-2 border-brand-border bg-white dark:bg-zinc-900 px-4 py-2.5 text-base text-brand-black dark:text-white placeholder:text-zinc-400 transition-colors focus:border-brand-yellow focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
