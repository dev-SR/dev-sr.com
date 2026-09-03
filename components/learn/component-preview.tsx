'use client';

import { Children, isValidElement, useCallback, useMemo, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ComponentPreviewProps {
  children: React.ReactNode;
  className?: string;
  align?: 'center' | 'start' | 'end';
  replay?: boolean;
  flush?: boolean;
  previewClassName?: string;
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
    const isDocsFileTabs =
      typeof child.type === 'function' &&
      ((child.type as { displayName?: string; name?: string }).displayName === 'DocsFileTabs' ||
        (child.type as { name?: string }).name === 'DocsFileTabs');

    if (isPrettyFigure || isPre || isCodeBlock || isDocsFileTabs) {
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
  replay = false,
  flush = false,
  previewClassName,
}: ComponentPreviewProps) {
  const { previewNodes, codeNodes } = useMemo(() => splitPreviewChildren(children), [children]);
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = useCallback(() => {
    setReplayKey((key) => key + 1);
  }, []);

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
          {replay && tab === 'preview' && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
              onClick={handleReplay}>
              <RotateCw className="size-3.5" />
              Replay
            </Button>
          )}
        </div>

        <TabsContent value="preview" className="m-0">
          <div
            key={replay ? replayKey : undefined}
            className={cn(
              'flex w-full',
              flush ? 'min-h-0 items-stretch p-0' : cn('min-h-44 items-center p-8', alignClass),
              previewClassName
            )}>
            <div className={cn('w-full', flush && 'min-h-0 flex-1')}>{previewNodes}</div>
          </div>
        </TabsContent>
        <TabsContent value="code" className="m-0">
          <div className="[&_.code-block]:my-0">{codeNodes}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
