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
        // Panel bg is owned by CSS (light/dark); drop Shiki inline backgrounds.
        style={stripShikiBackground(style)}
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
        style={stripShikiBackground(style)}
        data-language={language}>
        {children}
      </pre>
    </CodeBlock>
  );
}

function stripShikiBackground(
  style: React.CSSProperties | undefined
): React.CSSProperties | undefined {
  if (!style) return style;
  const next = { ...style };
  delete next.background;
  delete next.backgroundColor;
  // Dual-theme CSS vars for bg — clear so our panel colors win
  const cssVars = next as Record<string, string | undefined>;
  delete cssVars['--shiki-light-bg'];
  delete cssVars['--shiki-dark-bg'];
  return next;
}
