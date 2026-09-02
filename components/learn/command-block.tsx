'use client';

import { useMemo, useState } from 'react';
import { Terminal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CodeCopyButton } from '@/components/code/code-copy-button';
import {
  CodeContainer,
  CodeContainerHeader,
  CodeContainerIcon,
} from '@/components/code/code-container';

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

interface CommandBlockProps {
  pnpm?: string;
  npm?: string;
  yarn?: string;
  bun?: string;
  className?: string;
}

export function CommandBlock({ pnpm, npm, yarn, bun, className }: CommandBlockProps) {
  const commands = useMemo(() => {
    const entries: Partial<Record<PackageManager, string>> = { pnpm, npm, yarn, bun };
    return Object.entries(entries).filter((entry): entry is [PackageManager, string] =>
      Boolean(entry[1])
    );
  }, [pnpm, npm, yarn, bun]);

  const [active, setActive] = useState<PackageManager>(commands[0]?.[0] ?? 'pnpm');
  const activeCommand = commands.find(([key]) => key === active)?.[1] ?? '';

  if (commands.length === 0) {
    return null;
  }

  return (
    <CodeContainer className={cn('my-6', className)}>
      <Tabs value={active} onValueChange={(value) => setActive(value as PackageManager)}>
        <CodeContainerHeader>
          <div className="flex items-center gap-2">
            <CodeContainerIcon>
              <Terminal className="size-3.5 text-muted-foreground" />
            </CodeContainerIcon>
            <TabsList className="h-8 bg-transparent p-0">
              {commands.map(([key]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="h-7 rounded px-2.5 text-xs uppercase data-[state=active]:bg-muted/60">
                  {key}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <CodeCopyButton text={activeCommand} />
        </CodeContainerHeader>
        {commands.map(([key, command]) => (
          <TabsContent key={key} value={key} className="m-0">
            <pre className="overflow-x-auto p-4 font-mono text-sm text-foreground">{command}</pre>
          </TabsContent>
        ))}
      </Tabs>
    </CodeContainer>
  );
}
