'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Boxes,
  ChevronRight,
  Code2,
  Database,
  Layers3,
  Network,
  Server,
  type LucideIcon,
} from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import type { LearnNavNode } from '@/lib/learn';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Boxes,
  Code2,
  Database,
  Layers3,
  Network,
  Server,
};

function getIcon(name?: string) {
  if (!name) return BookOpen;
  return ICON_MAP[name] ?? BookOpen;
}

function NavLink({ node, depth = 0 }: { node: LearnNavNode; depth?: number }) {
  const pathname = usePathname();
  const isActive = pathname === node.href;

  return (
    <Link
      href={node.href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
        depth > 0 && 'ml-2',
        isActive
          ? 'bg-muted font-medium text-foreground'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      )}>
      <span className="truncate">{node.title}</span>
      {node.badge && (
        <Badge variant="secondary" className="ml-auto shrink-0 text-[0.6rem] uppercase">
          {node.badge}
        </Badge>
      )}
    </Link>
  );
}

function ChapterHeader({ node, showIcon = false }: { node: LearnNavNode; showIcon?: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === node.href;
  const Icon = getIcon(node.icon);

  return (
    <Link
      href={node.href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-muted text-foreground'
          : 'text-foreground hover:bg-muted/50'
      )}>
      {showIcon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
      <span className="truncate">{node.title}</span>
    </Link>
  );
}

function getVisibleChildren(node: LearnNavNode): LearnNavNode[] {
  return (node.children ?? []).filter((child) => child.href !== node.href);
}

function isFlatPageChapter(node: LearnNavNode): boolean {
  const leaves = getVisibleChildren(node);
  if (leaves.length === 0) return false;

  const hasNestedChapters = leaves.some((child) => child.type === 'chapter' && child.children?.length);
  return !hasNestedChapters && leaves.every((child) => child.type === 'page');
}

function collectAccordionSlugs(nodes: LearnNavNode[]): string[] {
  return nodes.flatMap((node) => {
    const slugs = isFlatPageChapter(node) ? [node.slug] : [];
    return [...slugs, ...collectAccordionSlugs(getVisibleChildren(node))];
  });
}

function ChapterSection({ node, showIcon = false }: { node: LearnNavNode; showIcon?: boolean }) {
  const pathname = usePathname();
  const leaves = getVisibleChildren(node);

  if (leaves.length === 0) {
    return <ChapterHeader node={node} showIcon={showIcon} />;
  }

  if (isFlatPageChapter(node)) {
    const isActive = pathname === node.href;
    const Icon = getIcon(node.icon);

    return (
      <AccordionPrimitive.Item value={node.slug} className="border-none">
        <AccordionPrimitive.Header className="flex items-center gap-0.5">
          <Link
            href={node.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-muted text-foreground'
                : 'text-foreground hover:bg-muted/50'
            )}>
            {showIcon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
            <span className="truncate">{node.title}</span>
          </Link>
          <AccordionPrimitive.Trigger
            aria-label={`Toggle ${node.title} section`}
            className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground [&[data-state=open]>svg]:rotate-90">
            <ChevronRight className="size-4 shrink-0 transition-transform duration-200" />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="ml-3 py-1">
            <div className="flex flex-col gap-0.5 border-l border-border/70">
              {leaves.map((child) => (
                <NavLink key={child.slug} node={child} depth={1} />
              ))}
            </div>
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <ChapterHeader node={node} showIcon={showIcon} />
      <div className="ml-3 flex flex-col gap-1 border-l border-border/70">
        {leaves.map((child) =>
          child.type === 'chapter' ? (
            <ChapterSection key={child.slug} node={child} />
          ) : (
            <NavLink key={child.slug} node={child} depth={1} />
          )
        )}
      </div>
    </div>
  );
}

interface DocsSidebarProps {
  course: LearnNavNode;
  className?: string;
  rootLabel?: string;
}

export function DocsSidebar({ course, className, rootLabel = 'Course' }: DocsSidebarProps) {
  const sections = course.children ?? [];
  const allAccordionSlugs = useMemo(() => collectAccordionSlugs(sections), [sections]);
  const [expandedSlugs, setExpandedSlugs] = useState<string[]>(allAccordionSlugs);

  useEffect(() => {
    setExpandedSlugs(allAccordionSlugs);
  }, [allAccordionSlugs]);

  return (
    <aside className={cn('flex h-full min-h-0 flex-col', className)}>
      <div className="mb-4 px-2">
        <Link href={course.href} className="block rounded-md px-2 py-1.5 hover:bg-muted/50">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{rootLabel}</p>
          <p className="text-sm font-semibold text-foreground">{course.title}</p>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-1">
        <AccordionPrimitive.Root
          type="multiple"
          value={expandedSlugs}
          onValueChange={setExpandedSlugs}>
          <nav className="flex flex-col gap-1 pb-6">
            {sections.map((section) =>
              section.type === 'chapter' || (section.children?.length ?? 0) > 0 ? (
                <ChapterSection key={section.slug} node={section} showIcon />
              ) : (
                <NavLink key={section.slug} node={section} />
              )
            )}
          </nav>
        </AccordionPrimitive.Root>
      </ScrollArea>
    </aside>
  );
}
