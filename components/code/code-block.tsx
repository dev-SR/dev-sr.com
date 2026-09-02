'use client';

import { useMemo, useState } from 'react';
import type React from 'react';
import { ChevronDown, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { CodeCopyButton } from './code-copy-button';
import { LanguageBadge } from './language-badge';
import { useInFileTabs } from './code-block-context';
import {
  CodeContainer,
  CodeContainerBody,
  CodeContainerHeader,
  CodeContainerIcon,
} from './code-container';
import { CopyableFilename } from './copyable-filename';

interface CodeBlockProps {
  language?: string;
  filename?: string;
  rawString?: string;
  children: React.ReactNode;
  className?: string;
  collapseAfterLines?: number;
  copyLabel?: string;
  showCopyLabel?: boolean;
}

const EXPANDED_MAX_HEIGHT = '650px';

function CodeBlockContent({
  children,
  isCollapsed,
}: {
  children: React.ReactNode;
  isCollapsed: boolean;
}) {
  return (
    <div
      className={cn(
        '[&_figure]:m-0 [&_pre]:my-0',
        isCollapsed ? '[&_pre]:overflow-hidden [&_pre]:pb-16' : '[&_pre]:overflow-auto'
      )}
      style={
        !isCollapsed
          ? ({ '--code-block-max-height': EXPANDED_MAX_HEIGHT } as React.CSSProperties)
          : undefined
      }>
      {children}
    </div>
  );
}

export function CodeBlock({
  language = 'text',
  filename,
  rawString = '',
  children,
  className,
  collapseAfterLines = 13,
  copyLabel = 'Copy code',
  showCopyLabel = false,
}: CodeBlockProps) {
  const inFileTabs = useInFileTabs();
  const [expanded, setExpanded] = useState(false);
  const lineCount = useMemo(() => (rawString ? rawString.split('\n').length : 0), [rawString]);
  const shouldCollapse = lineCount > collapseAfterLines;
  const isCollapsed = shouldCollapse && !expanded;

  const headerLabel =
    filename ?? (language.toLowerCase() === 'text' ? 'code' : language.toLowerCase());

  const header = !inFileTabs && (
    <CodeContainerHeader>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <CodeContainerIcon>
          <FileCode className="size-3.5 text-muted-foreground" />
        </CodeContainerIcon>
        {filename ? (
          <CopyableFilename filename={filename} />
        ) : (
          <>
            <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {headerLabel}
            </span>
            <LanguageBadge language={language} />
          </>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {shouldCollapse && (
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-1 text-muted-foreground hover:bg-muted/60"
              aria-label={expanded ? 'Collapse code' : 'Expand code'}>
              <ChevronDown
                className={cn('size-3 transition-transform', expanded && 'rotate-180')}
              />
            </Button>
          </CollapsibleTrigger>
        )}
        <CodeCopyButton text={rawString} label={copyLabel} showCopyLabel={showCopyLabel} />
      </div>
    </CodeContainerHeader>
  );

  const body = (
    <CodeContainerBody>
      {shouldCollapse ? (
        <CollapsibleContent
          forceMount
          className={cn(
            'data-[state=closed]:animate-none data-[state=open]:animate-none',
            isCollapsed ? 'max-h-64 overflow-hidden' : 'overflow-visible'
          )}>
          <CodeBlockContent isCollapsed={isCollapsed}>{children}</CodeBlockContent>
        </CollapsibleContent>
      ) : (
        <CodeBlockContent isCollapsed={false}>{children}</CodeBlockContent>
      )}

      {isCollapsed && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-linear-to-b from-background/20 to-background/80 p-2">
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
    </CodeContainerBody>
  );

  const shell = shouldCollapse ? (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      {header}
      {body}
    </Collapsible>
  ) : (
    <>
      {header}
      {body}
    </>
  );

  if (inFileTabs) {
    return (
      <div
        className={cn('code-block not-prose', isCollapsed && 'code-block--collapsed', className)}>
        {shell}
      </div>
    );
  }

  return (
    <CodeContainer
      className={cn(
        'code-block not-prose my-6',
        isCollapsed && 'code-block--collapsed',
        className
      )}>
      {shell}
    </CodeContainer>
  );
}

/** @deprecated Use CodeBlock */
export const DocsCodeBlock = CodeBlock;
