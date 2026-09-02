'use client';

import type React from 'react';
import { cn } from '@/lib/utils';

export function Step({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'step mt-8 scroll-m-28 text-base font-semibold tracking-tight text-foreground first:mt-0',
        className
      )}
      {...props}
    />
  );
}

export function Steps({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'steps mb-10 [counter-reset:step] md:ml-2 md:border-l md:border-border/70 md:pl-8 [&>h3]:step',
        className
      )}
      {...props}
    />
  );
}
