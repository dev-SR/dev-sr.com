'use client';

import type React from 'react';
import { Children, isValidElement } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { DocsCodeBlock } from './docs-code-block';
import { DocsPrettyFigureProvider } from './docs-code-block-context';

const Mermaid = dynamic(() => import('./mermaid').then((mod) => mod.Mermaid), {
  loading: () => (
    <div className="my-6 flex h-40 items-center justify-center rounded-xl border border-border bg-card/50 text-sm text-muted-foreground">
      Loading diagram…
    </div>
  ),
});

function extractFigureTitle(children: React.ReactNode): string | undefined {
  let title: string | undefined;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const tag = child.type;
    const isFigcaption =
      tag === 'figcaption' ||
      (child.props as Record<string, unknown>)['data-rehype-pretty-code-title'] !== undefined;

    if (isFigcaption) {
      const figChildren = (child.props as { children?: React.ReactNode }).children;
      if (typeof figChildren === 'string' && figChildren.trim()) {
        title = figChildren.trim();
      }
    }
  });

  return title;
}

function extractPreMeta(children: React.ReactNode): { language: string; rawString: string } {
  let language = 'text';
  let rawString = '';

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === 'pre' || (child.props as Record<string, unknown>)['data-language']) {
      const childProps = child.props as Record<string, unknown>;
      if (typeof childProps['data-language'] === 'string') {
        language = childProps['data-language'].toLowerCase();
      }
      if (typeof childProps.__rawstring__ === 'string') {
        rawString = childProps.__rawstring__;
      }
    }
  });

  return { language, rawString };
}

export function DocsPrettyFigure({
  children,
  className,
  ...props
}: React.ComponentProps<'figure'> & Record<string, unknown>) {
  const isPrettyCode = props['data-rehype-pretty-code-figure'] !== undefined;

  if (!isPrettyCode) {
    return (
      <figure className={className} {...props}>
        {children}
      </figure>
    );
  }

  const filename = extractFigureTitle(children);
  const { language, rawString } = extractPreMeta(children);

  if (language === 'mermaid') {
    return <Mermaid chart={rawString} />;
  }

  return (
    <DocsPrettyFigureProvider>
      <DocsCodeBlock language={language} filename={filename} rawString={rawString}>
        <figure className={cn('m-0', className)} {...props}>
          {children}
        </figure>
      </DocsCodeBlock>
    </DocsPrettyFigureProvider>
  );
}
