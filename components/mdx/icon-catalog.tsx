'use client';

import { contentIconEntries, type ContentIconSet } from '@/lib/content-icons';
import { cn } from '@/lib/utils';

interface IconCatalogProps {
  /** Which allow-list to show. */
  set: ContentIconSet;
  className?: string;
}

/**
 * Visual reference of Lucide names accepted by ItemList (`item-list`)
 * or Learn frontmatter / hub / sidebar (`learn`).
 */
export function IconCatalog({ set, className }: IconCatalogProps) {
  const entries = contentIconEntries(set);

  return (
    <div
      data-slot="icon-catalog"
      data-set={set}
      className={cn(
        'not-prose mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4',
        className
      )}>
      {entries.map(([name, Icon]) => (
        <div
          key={name}
          className="flex items-center gap-2.5 rounded-lg border border-border bg-card/50 px-3 py-2.5">
          <Icon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
            strokeWidth={1.8}
          />
          <code className="truncate text-xs text-foreground">{name}</code>
        </div>
      ))}
    </div>
  );
}
