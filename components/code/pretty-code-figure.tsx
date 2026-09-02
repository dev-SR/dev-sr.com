'use client';

import type React from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { CodeBlock } from './code-block';
import { PrettyFigureProvider, useInFileTabs } from './code-block-context';
import { extractFigureTitleFromChildren, extractPreMeta } from './figure-utils';

const Mermaid = dynamic(() => import('@/components/learn/mermaid').then((mod) => mod.Mermaid), {
  loading: () => (
    <div className="my-6 flex h-40 items-center justify-center rounded-xl border border-border bg-card/50 text-sm text-muted-foreground">
      Loading diagram…
    </div>
  ),
});

export function PrettyCodeFigure({
  children,
  className,
  ...props
}: React.ComponentProps<'figure'> & Record<string, unknown>) {
  const inFileTabs = useInFileTabs();
  const isPrettyCode = props['data-rehype-pretty-code-figure'] !== undefined;

  if (!isPrettyCode) {
    return (
      <figure className={className} {...props}>
        {children}
      </figure>
    );
  }

  const filename = extractFigureTitleFromChildren(children);
  const { language, rawString } = extractPreMeta(children);

  if (language === 'mermaid') {
    return <Mermaid chart={rawString} />;
  }

  if (inFileTabs) {
    return (
      <PrettyFigureProvider>
        <CodeBlock language={language} filename={filename} rawString={rawString}>
          <figure
            className={cn('m-0', className)}
            {...props}
            data-code-tab-panel={filename ?? language}>
            {children}
          </figure>
        </CodeBlock>
      </PrettyFigureProvider>
    );
  }

  return (
    <PrettyFigureProvider>
      <CodeBlock language={language} filename={filename} rawString={rawString}>
        <figure className={cn('m-0', className)} {...props}>
          {children}
        </figure>
      </CodeBlock>
    </PrettyFigureProvider>
  );
}

/** @deprecated Use PrettyCodeFigure */
export const DocsPrettyFigure = PrettyCodeFigure;
