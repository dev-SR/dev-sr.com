'use client';

import { FileTabs } from '@/components/code/file-tabs';

interface CodeTabsProps {
  title?: string;
  children: React.ReactNode;
}

export function CodeTabs({ title, children }: CodeTabsProps) {
  return (
    <FileTabs
      title={title}
      showGroupCopy
      filesLabel={(n) => `${n} source file${n === 1 ? '' : 's'}`}
      emptyMessage="No code blocks were provided. Wrap fenced code blocks inside CodeTabs."
    >
      {children}
    </FileTabs>
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
