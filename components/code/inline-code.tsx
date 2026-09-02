'use client';

import type React from 'react';
import { cn } from '@/lib/utils';

export function InlineCode(props: React.HTMLAttributes<HTMLElement>) {
  const { className, children, ...rest } = props;
  const isBlockCode =
    typeof className === 'string' &&
    (className.includes('language-') || className.includes('hljs') || className.includes('shiki'));

  if (isBlockCode) {
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  }

  return (
    <code
      className={cn(
        'rounded-sm bg-muted/50 px-1.5 py-0.5 font-mono text-[0.88em] text-foreground',
        className
      )}
      {...rest}>
      {children}
    </code>
  );
}
