'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronsUpDown, FileText } from 'lucide-react';

import type { BlogNavNode } from '@/lib/mdx';
import { cn } from '@/lib/utils';
import { CollapseButton, Tree, type TreeViewElement } from '@/components/ui/file-tree';

interface BlogTreeProps {
  tree: BlogNavNode[];
  className?: string;
}

function formatFolderName(name: string) {
  return name.replace(/-/g, ' ');
}

function collectFolderIds(nodes: BlogNavNode[], depth = 0, maxDepth = 2): string[] {
  if (depth >= maxDepth) {
    return [];
  }

  return nodes.flatMap((node) => {
    if (node.type !== 'directory') {
      return [];
    }

    return [node.path, ...collectFolderIds(node.children ?? [], depth + 1, maxDepth)];
  });
}

function toTreeElements(nodes: BlogNavNode[]): TreeViewElement[] {
  return nodes.map((node) => {
    if (node.type === 'directory') {
      return {
        id: node.path,
        name: formatFolderName(node.name),
        type: 'folder',
        children: node.children ? toTreeElements(node.children) : [],
      };
    }

    return {
      id: node.slug ?? node.path,
      name: node.title ?? node.name,
      type: 'file',
      href: node.slug ? `/blog/${node.slug}` : undefined,
    };
  });
}

export function BlogTreeNavigation({ tree, className }: BlogTreeProps) {
  const pathname = usePathname();
  const elements = useMemo(() => toTreeElements(tree), [tree]);
  const initialExpandedItems = useMemo(() => collectFolderIds(tree), [tree]);
  const selectedId = pathname.startsWith('/blog/') ? pathname.replace(/^\/blog\//, '') : undefined;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <h3 className="text-lg font-semibold text-foreground">Browse Topics</h3>
      <Tree
        className="h-[min(70vh,36rem)]"
        elements={elements}
        initialExpandedItems={initialExpandedItems}
        initialSelectedId={selectedId}
        fileIcon={<FileText className="size-4 text-muted-foreground" />}>
        <CollapseButton elements={elements} aria-label="Expand or collapse all topics">
          <ChevronsUpDown />
        </CollapseButton>
      </Tree>
    </div>
  );
}
