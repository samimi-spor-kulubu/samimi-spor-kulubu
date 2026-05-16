'use client';

import * as React from 'react';
import {Switch as RadixSwitch} from 'radix-ui';

import {cn} from '@/lib/utils';

export const Switch = React.forwardRef<
  React.ComponentRef<typeof RadixSwitch.Root>,
  React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>
>(({className, ...props}, ref) => (
  <RadixSwitch.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand-black data-[state=unchecked]:bg-zinc-300',
      className
    )}
    {...props}
  >
    <RadixSwitch.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </RadixSwitch.Root>
));
Switch.displayName = 'Switch';
