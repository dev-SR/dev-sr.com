'use client';

import type React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { DocsCodeBlock } from './docs-code-block';
import { useInDocsPrettyFigure } from './docs-code-block-context';
import { DocsPrettyFigure } from './docs-pretty-figure';

const Mermaid = dynamic(() => import('./mermaid').then((mod) => mod.Mermaid), {
  loading: () => (
    <div className="my-6 flex h-40 items-center justify-center rounded-xl border border-border bg-card/50 text-sm text-muted-foreground">
      Loading diagram…
    </div>
  ),
});

export function LearnCodeCustom(props: React.HTMLAttributes<HTMLElement>) {
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

interface LearnPreProps extends React.HTMLProps<HTMLPreElement> {
  __rawstring__?: string;
  ['data-language']?: string;
}

export function LearnPreCustom(props: LearnPreProps) {
  const inPrettyFigure = useInDocsPrettyFigure();
  const {
    children,
    className,
    style,
    __rawstring__ = '',
    ['data-language']: dataLanguage = 'text',
    ...preProps
  } = props;
  const language = String(dataLanguage || 'text').toLowerCase();

  if (language === 'mermaid') {
    return <Mermaid chart={__rawstring__} />;
  }

  if (inPrettyFigure) {
    return (
      <pre
        className={cn('docs-code-pre m-0 overflow-x-auto text-sm leading-6', className)}
        {...preProps}
        style={style}
        data-language={language}>
        {children}
      </pre>
    );
  }

  return (
    <DocsCodeBlock language={language} rawString={__rawstring__}>
      <pre
        className={cn('docs-code-pre m-0 overflow-x-auto text-sm leading-6', className)}
        {...preProps}
        style={style}
        data-language={language}>
        {children}
      </pre>
    </DocsCodeBlock>
  );
}

export { DocsPrettyFigure };
