'use client';

import type React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { CodeBlock } from './code-block';
import { useInPrettyFigure } from './code-block-context';

const Mermaid = dynamic(() => import('@/components/learn/mermaid').then((mod) => mod.Mermaid), {
  loading: () => (
    <div className="my-6 flex h-40 items-center justify-center rounded-xl border border-border bg-card/50 text-sm text-muted-foreground">
      Loading diagram…
    </div>
  ),
});

export interface PreProps extends React.HTMLProps<HTMLPreElement> {
  __rawstring__?: string;
  ['data-language']?: string;
}

export function Pre(props: PreProps) {
  const inPrettyFigure = useInPrettyFigure();
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
        className={cn('code-pre m-0 overflow-x-auto text-sm leading-6', className)}
        {...preProps}
        style={style}
        data-language={language}>
        {children}
      </pre>
    );
  }

  return (
    <CodeBlock language={language} rawString={__rawstring__}>
      <pre
        className={cn('code-pre m-0 overflow-x-auto text-sm leading-6', className)}
        {...preProps}
        style={style}
        data-language={language}>
        {children}
      </pre>
    </CodeBlock>
  );
}
