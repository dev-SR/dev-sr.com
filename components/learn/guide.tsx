'use client';

import { createContext, useContext } from 'react';
import type React from 'react';
import { cn } from '@/lib/utils';

type GuideContextValue = {
  numbered: boolean;
};

const GuideContext = createContext<GuideContextValue>({ numbered: false });

export function Guide({
  title,
  numbered = false,
  className,
  children,
}: {
  title?: string;
  numbered?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <GuideContext.Provider value={{ numbered }}>
      <div className={cn('not-prose my-10', className)} data-toc-exclude>
        {title && (
          <h3 className="mb-6 scroll-m-28 text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
        )}
        <div
          className={cn(
            'ml-4 flex flex-col gap-10 border-l border-border/70 pl-10 [--guide-line-offset:2.5rem]',
            numbered && '[counter-reset:guide-step]'
          )}>
          {children}
        </div>
      </div>
    </GuideContext.Provider>
  );
}

export function GuideStep({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { numbered } = useContext(GuideContext);

  return (
    <div className={cn(numbered && 'guide-step-numbered', className)}>
      <div className="relative">
        {!numbered && (
          <span
            aria-hidden
            className="absolute top-0 -left-[var(--guide-line-offset)] z-20 block h-full w-[6px] rounded-tr-full rounded-br-full bg-muted"
          />
        )}
        <h3 className="scroll-m-28 text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h3>
      </div>
      {children && (
        <div className="mt-4 flex flex-col gap-4 [&_.code-block]:my-0 [&>:first-child]:mt-0">
          {children}
        </div>
      )}
    </div>
  );
}
