'use client';

import type React from 'react';
import { Children, isValidElement } from 'react';
import { cn } from '@/lib/utils';
import { CodeFrame } from './code-frame';
import {
  CodeTabsProvider,
  PrettyCodeFigureProvider,
  useInCodeTabs,
} from './code-block-context';

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
      const props = child.props as Record<string, unknown>;
      if (typeof props['data-language'] === 'string') {
        language = props['data-language'].toLowerCase();
      }
      if (typeof props.__rawstring__ === 'string') {
        rawString = props.__rawstring__;
      }
    }
  });

  return { language, rawString };
}

export function PrettyCodeFigure({
  children,
  className,
  ...props
}: React.ComponentProps<'figure'> & Record<string, unknown>) {
  const inCodeTabs = useInCodeTabs();
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

  if (inCodeTabs) {
    return (
      <PrettyCodeFigureProvider>
        <figure
          className={cn('m-0', className)}
          {...props}
          data-code-tab-panel={filename ?? language}>
          {children}
        </figure>
      </PrettyCodeFigureProvider>
    );
  }

  return (
    <PrettyCodeFigureProvider>
      <CodeFrame
        className="my-8"
        language={language}
        filename={filename}
        rawString={rawString}>
        <figure className={cn('m-0', className)} {...props}>
          {children}
        </figure>
      </CodeFrame>
    </PrettyCodeFigureProvider>
  );
}

export { CodeTabsProvider };
