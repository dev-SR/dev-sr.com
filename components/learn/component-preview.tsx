'use client';

import { Children, isValidElement, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ComponentPreviewProps {
  children: React.ReactNode;
  className?: string;
  align?: 'center' | 'start' | 'end';
}

function splitPreviewChildren(children: React.ReactNode) {
  const previewNodes: React.ReactNode[] = [];
  const codeNodes: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      previewNodes.push(child);
      return;
    }

    const props = child.props as Record<string, unknown>;
    const isPrettyFigure = props['data-rehype-pretty-code-figure'] !== undefined;
    const isPre = child.type === 'pre';
    const isCodeBlock =
      typeof props.className === 'string' && props.className.includes('code-block');

    if (isPrettyFigure || isPre || isCodeBlock) {
      codeNodes.push(child);
      return;
    }

    previewNodes.push(child);
  });

  return { previewNodes, codeNodes };
}

export function ComponentPreview({
  children,
  className,
  align = 'center',
}: ComponentPreviewProps) {
  const { previewNodes, codeNodes } = useMemo(() => splitPreviewChildren(children), [children]);
  const [tab, setTab] = useState<'preview' | 'code'>('preview');

  const alignClass =
    align === 'start' ? 'justify-start' : align === 'end' ? 'justify-end' : 'justify-center';

  return (
    <div
      className={cn(
        'not-prose my-8 overflow-hidden rounded-xl border border-border bg-card/60 shadow-sm',
        className
      )}>
      <Tabs value={tab} onValueChange={(value) => setTab(value as 'preview' | 'code')}>
        <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
          <TabsList className="h-8 bg-transparent p-0">
            <TabsTrigger
              value="preview"
              className="h-7 rounded px-3 text-xs data-[state=active]:bg-muted/60">
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="h-7 rounded px-3 text-xs data-[state=active]:bg-muted/60">
              Code
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview" className="m-0">
          <div className={cn('flex min-h-44 items-center p-8', alignClass)}>{previewNodes}</div>
        </TabsContent>
        <TabsContent value="code" className="m-0">
          <div className="[&_.code-block]:my-0">
            {codeNodes}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
