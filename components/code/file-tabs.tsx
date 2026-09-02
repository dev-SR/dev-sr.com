'use client';

import { useMemo, useState } from 'react';
import { FileCode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CodeCopyButton } from './code-copy-button';
import { FileTabsProvider } from './code-block-context';
import {
  CodeContainer,
  CodeContainerHeader,
  CodeContainerIcon,
  editorTabTriggerClass,
  editorTabsListClass,
} from './code-container';
import { CopyableFilename } from './copyable-filename';
import { collectFileTabItems } from './figure-utils';

interface FileTabsProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showGroupCopy?: boolean;
  filesLabel?: string | ((count: number) => string);
  emptyMessage?: string;
}

export function FileTabs({
  title,
  children,
  className,
  showGroupCopy = false,
  emptyMessage,
}: FileTabsProps) {
  const items = useMemo(() => collectFileTabItems(children), [children]);
  const [activeTab, setActiveTab] = useState(items[0]?.id ?? '');

  const activeItem = items.find((item) => item.id === activeTab) ?? items[0];

  if (items.length === 0) {
    if (!title && !emptyMessage) return null;
    return (
      <CodeContainer className="code-file-tabs not-prose my-6 p-5 text-sm text-muted-foreground">
        {title && <h4 className="mb-2 text-lg font-semibold text-foreground">{title}</h4>}
        <p>{emptyMessage ?? 'No code blocks were provided.'}</p>
      </CodeContainer>
    );
  }

  if (items.length === 1) {
    return (
      <FileTabsProvider>
        <div className={cn('code-file-tabs not-prose my-6', className)}>
          {title && <h4 className="mb-3 text-sm font-semibold text-foreground">{title}</h4>}
          {items[0].element}
        </div>
      </FileTabsProvider>
    );
  }

  return (
    <FileTabsProvider>
      <CodeContainer className={cn('code-file-tabs code-block not-prose my-6', className)}>
        {title && (
          <div className="border-b border-border/60 px-3 py-2">
            <h4 className="truncate text-sm font-semibold text-foreground">{title}</h4>
          </div>
        )}

        <Tabs value={activeTab || items[0].id} onValueChange={setActiveTab}>
          <CodeContainerHeader className="gap-1 px-0 py-0 pr-3">
            <div className="flex min-w-0 flex-1 items-center overflow-hidden">
              <CodeContainerIcon className="ml-3">
                <FileCode className="size-3.5 text-muted-foreground" />
              </CodeContainerIcon>
              <TabsList className={cn(editorTabsListClass, 'min-w-0 flex-1')}>
                {items.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    title={item.label}
                    className={editorTabTriggerClass}>
                    <span className="truncate">{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {activeItem?.label && (
                <CopyableFilename filename={activeItem.label} className="hidden max-w-[10rem] lg:flex" />
              )}
              {showGroupCopy && (
                <CodeCopyButton
                  text={activeItem?.rawString ?? ''}
                  showCopyLabel
                  label="Copy file"
                  copiedLabel="Copied"
                />
              )}
            </div>
          </CodeContainerHeader>

          {items.map((item) => (
            <TabsContent key={item.id} value={item.id} className="m-0">
              {item.element}
            </TabsContent>
          ))}
        </Tabs>
      </CodeContainer>
    </FileTabsProvider>
  );
}
