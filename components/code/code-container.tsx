'use client';

import type React from 'react';
import { cn } from '@/lib/utils';

export function CodeContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card/80', className)}>
      {children}
    </div>
  );
}

export function CodeContainerHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2',
        className
      )}>
      {children}
    </div>
  );
}

export function CodeContainerIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded bg-muted',
        className
      )}>
      {children}
    </span>
  );
}

export function CodeContainerBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('relative', className)}>{children}</div>;
}

/** Editor-style tab triggers — attach inside TabsList */
export const editorTabTriggerClass =
  'group relative h-8 max-w-[14rem] shrink-0 rounded-none border-r border-border/50 px-3 font-mono text-xs text-muted-foreground shadow-none transition-colors last:border-r-0 data-[state=active]:border-b-2 data-[state=active]:border-b-foreground/70 data-[state=active]:bg-card/80 data-[state=active]:text-foreground data-[state=inactive]:bg-muted/25 data-[state=inactive]:hover:bg-muted/40';

export const editorTabsListClass =
  'h-auto w-auto max-w-full justify-start gap-0 overflow-x-auto rounded-none border-0 bg-transparent p-0';
