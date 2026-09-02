'use client';

import { FileTabs } from '@/components/code/file-tabs';

interface DocsFileTabsProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DocsFileTabs({ title, children, className }: DocsFileTabsProps) {
  return (
    <FileTabs title={title} className={className}>
      {children}
    </FileTabs>
  );
}
