'use client';

import type React from 'react';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useInPrettyCodeFigure } from './code-block-context';
import { CodeFrame } from './code-frame';

export function CodeCustom(props: HTMLAttributes<HTMLElement>) {
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

interface PreProps extends React.HTMLProps<HTMLPreElement> {
  __rawstring__?: string;
  ['data-language']?: string;
}

export function PreCustom(props: PreProps) {
  const inPrettyFigure = useInPrettyCodeFigure();
  const {
    children,
    className,
    style,
    __rawstring__ = '',
    ['data-language']: dataLanguage = 'text',
    ...preProps
  } = props;
  const language = String(dataLanguage || 'text').toLowerCase();

  if (inPrettyFigure) {
    return (
      <pre
        className={cn('m-0 overflow-x-auto p-4 text-sm leading-6', className)}
        {...preProps}
        style={style}
        data-language={language}>
        {children}
      </pre>
    );
  }

  return (
    <CodeFrame className="my-8" language={language} rawString={__rawstring__}>
      <pre
        className={cn('m-0 overflow-x-auto p-4 text-sm leading-6', className)}
        {...preProps}
        style={style}
        data-language={language}>
        {children}
      </pre>
    </CodeFrame>
  );
}
