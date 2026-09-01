'use client';

import type React from 'react';
import { cn } from '@/lib/utils';
import { CopyButton } from './copy-button';

interface CodeFrameProps {
  language?: string;
  filename?: string;
  rawString?: string;
  children: React.ReactNode;
  className?: string;
  copyLabel?: string;
}

export function CodeFrame({
  language = 'text',
  filename,
  rawString = '',
  children,
  className,
  copyLabel,
}: CodeFrameProps) {
  const headerLabel = filename || language.toLowerCase();

  return (
    <div
      className={cn(
        'mdx-code-frame not-prose group overflow-hidden rounded-lg border border-border bg-card shadow-sm',
        className
      )}>
      <div className="flex min-h-10 items-center justify-between gap-3 border-b border-border/60 bg-card px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-2 rounded-full bg-[#F08F87]/80" />
          <span className="flex size-2 rounded-full bg-[#ACC5D3]/80" />
          <span className="flex size-2 rounded-full bg-muted-foreground/40" />
          <span className="ml-1.5 truncate font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
            {headerLabel}
          </span>
        </div>
        <CopyButton text={rawString} label={copyLabel ?? 'Copy'} copiedLabel="Copied" />
      </div>
      <div className="bg-card">{children}</div>
    </div>
  );
}
