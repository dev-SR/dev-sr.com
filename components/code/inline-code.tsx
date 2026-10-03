'use client';

import type React from 'react';
import { cn } from '@/lib/utils';

export function InlineCode(props: React.HTMLAttributes<HTMLElement>) {
  const { className, children, ...rest } = props;
  const classNames = typeof className === 'string' ? className : '';
  const dataLanguage =
    typeof (rest as { 'data-language'?: string })['data-language'] === 'string'
      ? (rest as { 'data-language'?: string })['data-language']
      : undefined;
  // Fenced blocks (incl. plain `text`/`txt` after language-* is stripped).
  const isBlockCode =
    classNames.includes('language-') ||
    classNames.includes('code-fence') ||
    classNames.includes('hljs') ||
    classNames.includes('shiki') ||
    Boolean(dataLanguage);

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
