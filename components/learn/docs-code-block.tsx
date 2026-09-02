'use client';

import { useMemo, useState } from 'react';
import type React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { DocsCopyButton } from './docs-copy-button';
import { useInDocsFileTabs } from './docs-code-block-context';

const LANGUAGE_LABELS: Record<string, string> = {
  ts: 'TS',
  tsx: 'TS',
  typescript: 'TS',
  js: 'JS',
  jsx: 'JS',
  javascript: 'JS',
  cs: 'CS',
  csharp: 'CS',
  css: 'CSS',
  html: 'HTML',
  bash: 'SH',
  sh: 'SH',
  shell: 'SH',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'MD',
  mdx: 'MDX',
  python: 'PY',
  py: 'PY',
  sql: 'SQL',
};

function getLanguageLabel(language: string) {
  const normalized = language.toLowerCase();
  return LANGUAGE_LABELS[normalized] ?? normalized.toUpperCase().slice(0, 4);
}

function LanguageBadge({ language }: { language: string }) {
  const label = getLanguageLabel(language);

  return (
    <span
      aria-hidden
      className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#007ACC] px-0.5 text-[0.55rem] font-bold leading-none text-white">
      {label}
    </span>
  );
}

interface DocsCodeBlockProps {
  language?: string;
  filename?: string;
  rawString?: string;
  children: React.ReactNode;
  className?: string;
  /** Approximate line count threshold before showing expand UI */
  collapseAfterLines?: number;
}

const EXPANDED_MAX_HEIGHT = '650px';

export function DocsCodeBlock({
  language = 'text',
  filename,
  rawString = '',
  children,
  className,
  collapseAfterLines = 13,
}: DocsCodeBlockProps) {
  const inFileTabs = useInDocsFileTabs();
  const [expanded, setExpanded] = useState(false);
  const lineCount = useMemo(() => (rawString ? rawString.split('\n').length : 0), [rawString]);
  const shouldCollapse = lineCount > collapseAfterLines;
  const isCollapsed = shouldCollapse && !expanded;

  return (
    <div
      className={cn(
        'docs-code-block not-prose',
        inFileTabs ? 'my-0' : 'my-6',
        isCollapsed && 'docs-code-block--collapsed',
        className
      )}>
      {filename && (
        <div className="mb-2">
          <span className="inline-flex rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 font-mono text-xs text-muted-foreground">
            {filename}
          </span>
        </div>
      )}

      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <div className="relative overflow-hidden rounded-lg">
          <CollapsibleContent
            forceMount
            className={cn(
              'data-[state=closed]:animate-none data-[state=open]:animate-none',
              isCollapsed ? 'max-h-64 overflow-hidden' : 'overflow-visible'
            )}>
            <div
              className={cn(
                '[&_figure]:m-0 [&_pre]:my-0',
                isCollapsed ? '[&_pre]:overflow-hidden [&_pre]:pb-24' : '[&_pre]:overflow-auto'
              )}
              style={
                !isCollapsed
                  ? ({ '--docs-code-max-height': EXPANDED_MAX_HEIGHT } as React.CSSProperties)
                  : undefined
              }>
              <div className="relative">
                {children}

                <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
                  <DocsCopyButton
                    text={rawString}
                    className="h-6 w-8 rounded-md px-2 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-50"
                  />
                  <LanguageBadge language={language} />
                  {shouldCollapse && (
                    <CollapsibleTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-50"
                        aria-label={expanded ? 'Collapse code' : 'Expand code'}>
                        <ChevronDown
                          className={cn('size-3 transition-transform', expanded && 'rotate-180')}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>

          {isCollapsed && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-linear-to-b from-zinc-700/30 to-zinc-950/90 p-2">
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="pointer-events-auto h-8 px-4 text-xs">
                  Expand
                </Button>
              </CollapsibleTrigger>
            </div>
          )}
        </div>
      </Collapsible>
    </div>
  );
}
