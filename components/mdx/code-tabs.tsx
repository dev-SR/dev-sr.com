'use client';

import { Children, isValidElement, useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyButton } from './copy-button';
import { CodeTabsProvider } from './code-block-context';
import { collectCodeTabItems } from './code-utils';

interface CodeTabsProps {
  title?: string;
  children: React.ReactNode;
}

export function CodeTabs({ title, children }: CodeTabsProps) {
  const items = useMemo(() => collectCodeTabItems(children), [children]);
  const [activeTab, setActiveTab] = useState(items[0]?.id ?? '');

  const activeItem = items.find((item) => item.id === activeTab) ?? items[0];

  if (items.length === 0) {
    return title ? (
      <div className="my-8 rounded-lg border border-border bg-card/50 p-5 text-sm text-muted-foreground">
        <h4 className="mb-2 text-lg font-semibold text-foreground">{title}</h4>
        <p>No code blocks were provided. Wrap fenced code blocks inside CodeTabs.</p>
      </div>
    ) : null;
  }

  if (items.length === 1) {
    return (
      <CodeTabsProvider>
        <div className="mdx-code-tabs not-prose my-8 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          {title && (
            <div className="border-b border-border/60 bg-card px-3 py-2">
              <h4 className="truncate text-sm font-semibold text-foreground">{title}</h4>
            </div>
          )}
          {items[0].element}
        </div>
      </CodeTabsProvider>
    );
  }

  return (
    <CodeTabsProvider>
      <div className="mdx-code-tabs not-prose my-8 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/60 bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title && <h4 className="truncate text-sm font-semibold text-foreground">{title}</h4>}
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              {items.length} source file{items.length === 1 ? '' : 's'}
            </p>
          </div>
          <CopyButton
            text={activeItem?.rawString ?? ''}
            label="Copy file"
            copiedLabel="Copied"
          />
        </div>

        <Tabs
          value={activeTab || items[0].id}
          onValueChange={setActiveTab}
          className="w-full">
          <div className="overflow-x-auto border-b border-border/60 bg-card px-2 py-2">
            <TabsList className="h-auto justify-start gap-1 bg-transparent p-0">
              {items.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="gap-2 rounded px-3 py-1.5 font-mono text-xs text-muted-foreground data-[state=active]:bg-muted/50 data-[state=active]:text-foreground">
                  <FileText className="size-3.5" />
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {items.map((item) => (
            <TabsContent key={item.id} value={item.id} className="m-0">
              {item.element}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </CodeTabsProvider>
  );
}

/** @deprecated Use CodeTabs with fenced children instead. */
export function MultiFileCodeBlock({
  title,
  files,
}: {
  title?: string;
  files?: Array<{ filename: string; language?: string; content: string }>;
}) {
  if (!files?.length) {
    return (
      <div className="my-8 rounded-lg border border-border bg-card/50 p-5 text-sm text-muted-foreground">
        {title && <h4 className="mb-2 text-lg font-semibold text-foreground">{title}</h4>}
        <p>
          MultiFileCodeBlock with a <code>files</code> array is deprecated. Use{' '}
          <code>CodeTabs</code> with fenced code blocks instead.
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-lg border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-muted-foreground">
      {title && <h4 className="mb-2 text-lg font-semibold text-foreground">{title}</h4>}
      <p>
        This post still uses the deprecated <code>files=&#123;[...]&#125;</code> API. Migrate to{' '}
        <code>CodeTabs</code> with fenced children.
      </p>
    </div>
  );
}
