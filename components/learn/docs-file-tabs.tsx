'use client';

import { Children, isValidElement, useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { DocsFileTabsProvider } from './docs-code-block-context';

type DocsFileTabItem = {
  id: string;
  label: string;
  element: React.ReactElement;
};

function findPrettyFigure(node: React.ReactNode): React.ReactElement | null {
  if (!isValidElement(node)) return null;

  const props = node.props as Record<string, unknown>;
  if (props['data-rehype-pretty-code-figure'] !== undefined) {
    return node;
  }

  let found: React.ReactElement | null = null;
  Children.forEach((node.props as { children?: React.ReactNode }).children, (child) => {
    if (!found) {
      found = findPrettyFigure(child);
    }
  });

  return found;
}

function extractFigureLabel(figure: React.ReactElement, fallback: string): string {
  let label = fallback;

  Children.forEach((figure.props as { children?: React.ReactNode }).children, (child) => {
    if (!isValidElement(child)) return;
    const props = child.props as Record<string, unknown>;
    if (props['data-rehype-pretty-code-title'] && typeof props.children === 'string') {
      label = props.children;
    }
  });

  return label;
}

function collectFileTabItems(children: React.ReactNode): DocsFileTabItem[] {
  const items: DocsFileTabItem[] = [];

  Children.forEach(children, (child, index) => {
    if (!isValidElement(child)) return;

    const figure = findPrettyFigure(child);
    if (!figure) return;

    const label = extractFigureLabel(figure, `file-${index + 1}`);

    items.push({
      id: `${label}-${index}`,
      label,
      element: child,
    });
  });

  return items;
}

interface DocsFileTabsProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DocsFileTabs({ title, children, className }: DocsFileTabsProps) {
  const items = useMemo(() => collectFileTabItems(children), [children]);
  const [activeTab, setActiveTab] = useState(items[0]?.id ?? '');

  if (items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    return (
      <DocsFileTabsProvider>
        <div className={cn('not-prose my-6', className)}>{items[0].element}</div>
      </DocsFileTabsProvider>
    );
  }

  return (
    <DocsFileTabsProvider>
      <div className={cn('not-prose my-6', className)}>
        {(title || items.length > 1) && (
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            {title && <h4 className="text-sm font-semibold text-foreground">{title}</h4>}
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              {items.length} files
            </p>
          </div>
        )}

        <Tabs value={activeTab || items[0].id} onValueChange={setActiveTab}>
          <div className="mb-3 overflow-x-auto">
            <TabsList className="h-auto justify-start gap-1 bg-transparent p-0">
              {items.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="gap-2 rounded-md border border-transparent px-3 py-1.5 font-mono text-xs text-muted-foreground data-[state=active]:border-border/60 data-[state=active]:bg-muted/40 data-[state=active]:text-foreground">
                  <FileText className="size-3.5" />
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {items.map((item) => (
            <TabsContent key={item.id} value={item.id} className="m-0 p-0">
              {item.element}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DocsFileTabsProvider>
  );
}
