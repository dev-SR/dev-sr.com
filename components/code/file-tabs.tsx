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
import { LanguageBadge } from './language-badge';

interface FileTabsProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showGroupCopy?: boolean;
  filesLabel?: string | ((count: number) => string);
  emptyMessage?: string;
}

export function FileTabs({
  title: _title,
  children,
  className,
  showGroupCopy = true,
  emptyMessage,
}: FileTabsProps) {
  const items = useMemo(() => collectFileTabItems(children), [children]);
  const [activeTab, setActiveTab] = useState(items[0]?.id ?? '');

  const activeItem = items.find((item) => item.id === activeTab) ?? items[0];

  if (items.length === 0) {
    if (!emptyMessage) return null;
    return (
      <CodeContainer className="code-file-tabs not-prose my-6 p-5 text-sm text-muted-foreground">
        <p>{emptyMessage}</p>
      </CodeContainer>
    );
  }

  // Single file: let CodeBlock render its own header (copy + language).
  // Wrapping FileTabsProvider would hide that header.
  if (items.length === 1) {
    return (
      <div className={cn('code-file-tabs not-prose my-6', className)}>
        {items[0].element}
      </div>
    );
  }

  const selectedTab = activeTab || items[0].id;

  return (
    <FileTabsProvider>
      <CodeContainer className={cn('code-file-tabs code-block not-prose my-6', className)}>
        <Tabs value={selectedTab} onValueChange={setActiveTab} className="gap-0">
          <CodeContainerHeader className="gap-1 overflow-hidden px-0 py-0 pr-3">
            <div className="flex min-w-0 flex-1 items-center overflow-x-auto">
              <CodeContainerIcon className="ml-3 shrink-0">
                <FileCode className="size-3.5 text-muted-foreground" />
              </CodeContainerIcon>
              <TabsList className={cn(editorTabsListClass, 'min-w-0 flex-1')}>
                {items.map((item) => {
                  const isActive = item.id === selectedTab;
                  return (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      title={item.label}
                      style={{ maxWidth: isActive ? 'none' : '14rem' }}
                      className={cn(
                        editorTabTriggerClass,
                        // Kill base TabsTrigger flex-1 so width follows the label
                        '!flex-none',
                        isActive ? 'overflow-visible' : 'overflow-hidden'
                      )}>
                      <span
                        className={cn(
                          'whitespace-nowrap',
                          isActive ? 'overflow-visible' : 'block min-w-0 truncate'
                        )}>
                        {item.label}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {activeItem?.language && activeItem.language !== 'text' && (
                <LanguageBadge language={activeItem.language} />
              )}
              {showGroupCopy && (
                <CodeCopyButton
                  text={activeItem?.rawString ?? ''}
                  label={activeItem?.label ? `Copy ${activeItem.label}` : 'Copy code'}
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
