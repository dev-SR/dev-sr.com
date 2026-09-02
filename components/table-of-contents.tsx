'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

export interface TocTreeNode {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
  children: TocTreeNode[];
}

interface TableOfContentsProps {
  contentSelector?: string;
  className?: string;
  variant?: 'default' | 'compact';
}

const SCROLL_OFFSET = -92;

function extractHeadings(contentSelector: string): TocItem[] {
  const contentElement = document.querySelector(contentSelector);
  if (!contentElement) return [];

  const headings = contentElement.querySelectorAll('h1, h2, h3, h4');
  const items: TocItem[] = [];

  headings.forEach((heading, index) => {
    const element = heading as HTMLElement;
    if (element.closest('[data-toc-exclude]')) return;

    let id = element.id;

    if (!id) {
      id =
        element.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `heading-${index}`;
      element.id = id;
    }

    items.push({
      id,
      text: element.textContent || '',
      level: Number.parseInt(element.tagName.charAt(1), 10),
      element,
    });
  });

  return items;
}

export function buildTocTree(items: TocItem[]): TocTreeNode[] {
  if (items.length === 0) return [];

  const roots: TocTreeNode[] = [];
  const stack: TocTreeNode[] = [];

  for (const item of items) {
    const node: TocTreeNode = { ...item, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return roots;
}

function collectAncestorIds(tree: TocTreeNode[], activeId: string): Set<string> {
  const ancestors = new Set<string>();

  function walk(nodes: TocTreeNode[], path: string[]): boolean {
    for (const node of nodes) {
      const nextPath = [...path, node.id];

      if (node.id === activeId) {
        path.forEach((id) => ancestors.add(id));
        ancestors.add(activeId);
        return true;
      }

      if (walk(node.children, nextPath)) {
        return true;
      }
    }

    return false;
  }

  walk(tree, []);
  return ancestors;
}

function findActiveIndex(items: TocItem[], activeId: string): number {
  const index = items.findIndex((item) => item.id === activeId);
  return Math.max(0, index);
}

function useTocHeadings(contentSelector: string) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const syncHeadings = () => {
      const items = extractHeadings(contentSelector);
      setTocItems((currentItems) => {
        const currentSignature = currentItems
          .map((item) => `${item.id}:${item.level}:${item.text}`)
          .join('|');
        const nextSignature = items.map((item) => `${item.id}:${item.level}:${item.text}`).join('|');
        return currentSignature === nextSignature ? currentItems : items;
      });
    };

    syncHeadings();

    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) return;

    const observer = new MutationObserver(syncHeadings);
    observer.observe(contentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [contentSelector]);

  const tree = useMemo(() => buildTocTree(tocItems), [tocItems]);

  return { tocItems, tree };
}

function useTocSpy(tocItems: TocItem[]) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (tocItems.length === 0) return;

    if (!activeId || !tocItems.some((item) => item.id === activeId)) {
      setActiveId(tocItems[0].id);
    }
  }, [activeId, tocItems]);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-18% 0% -55% 0%', threshold: 0 }
    );

    tocItems.forEach((item) => observer.observe(item.element));

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const y = element.getBoundingClientRect().top + window.pageYOffset + SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
    setActiveId(id);
  }, []);

  return { activeId, scrollToHeading };
}

function TocItemButton({
  node,
  isActive,
  isAncestor,
  onNavigate,
  variant,
}: {
  node: TocTreeNode;
  isActive: boolean;
  isAncestor: boolean;
  onNavigate: (id: string) => void;
  variant: 'default' | 'compact';
}) {
  return (
    <button
      type="button"
      data-toc-id={node.id}
      onClick={() => onNavigate(node.id)}
      className={cn(
        'w-full rounded-md text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35',
        variant === 'compact' ? 'px-2 py-1 text-xs' : 'px-2 py-1.5 text-sm',
        isActive
          ? 'border-l-2 border-accent bg-muted pl-[calc(0.5rem-2px)] font-medium text-foreground'
          : isAncestor
            ? 'font-medium text-foreground/80 hover:bg-muted/40 hover:text-foreground'
            : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
      )}>
      <span className="line-clamp-2 leading-snug">{node.text}</span>
    </button>
  );
}

function TocTreeNav({
  nodes,
  activeId,
  ancestorIds,
  onNavigate,
  variant,
}: {
  nodes: TocTreeNode[];
  activeId: string;
  ancestorIds: Set<string>;
  onNavigate: (id: string) => void;
  variant: 'default' | 'compact';
}) {
  return (
    <div className={cn('flex flex-col', variant === 'compact' ? 'gap-0.5' : 'gap-1')}>
      {nodes.map((node) => {
        const isActive = activeId === node.id;
        const isAncestor = !isActive && ancestorIds.has(node.id);

        return (
          <div key={node.id} className="flex flex-col gap-0.5">
            <TocItemButton
              node={node}
              isActive={isActive}
              isAncestor={isAncestor}
              onNavigate={onNavigate}
              variant={variant}
            />
            {node.children.length > 0 && (
              <div className="ml-2 flex flex-col gap-0.5 border-l border-border/70 pl-2">
                <TocTreeNav
                  nodes={node.children}
                  activeId={activeId}
                  ancestorIds={ancestorIds}
                  onNavigate={onNavigate}
                  variant={variant}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TocPanel({
  tree,
  tocItems,
  activeId,
  scrollToHeading,
  variant = 'default',
  className,
  collapsible = true,
}: {
  tree: TocTreeNode[];
  tocItems: TocItem[];
  activeId: string;
  scrollToHeading: (id: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
  collapsible?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const ancestorIds = useMemo(() => collectAncestorIds(tree, activeId), [tree, activeId]);
  const activeIndex = findActiveIndex(tocItems, activeId);

  useEffect(() => {
    if (!panelRef.current || !activeId) return;

    const viewport = panelRef.current.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]'
    );
    const activeButton = panelRef.current.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`);
    if (!viewport || !activeButton) return;

    const nextTop =
      activeButton.offsetTop - viewport.clientHeight / 2 + activeButton.clientHeight / 2;
    viewport.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
  }, [activeId, tocItems.length]);

  if (tocItems.length === 0) return null;

  const nav = (
    <div ref={panelRef}>
      <ScrollArea
        className={cn(variant === 'compact' ? 'max-h-[50vh]' : 'max-h-[17rem]')}
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch>
        <nav
          className={cn('py-1', variant === 'compact' ? 'pr-1' : 'py-2')}
          role="navigation"
          aria-label="Table of contents"
          tabIndex={0}>
          <TocTreeNav
            nodes={tree}
            activeId={activeId}
            ancestorIds={ancestorIds}
            onNavigate={scrollToHeading}
            variant={variant}
          />
        </nav>
      </ScrollArea>
    </div>
  );

  if (!collapsible) {
    return (
      <div className={className}>
        <h3 className="mb-3 text-sm font-semibold text-foreground">On This Page</h3>
        {nav}
      </div>
    );
  }

  return (
    <div className={cn('relative mb-8', className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative overflow-hidden rounded-lg bg-background/20 py-3 backdrop-blur-sm">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="mb-1 h-auto w-full justify-between rounded-md px-2 py-1.5 text-left hover:bg-white/[0.025]">
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground/85">
                <List className="size-4 text-muted-foreground" />
                <span className="truncate">On this page</span>
              </span>
              <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground/70">
                {activeIndex + 1}/{tocItems.length}
                <ChevronDown
                  className={cn(
                    'size-3.5 transition-transform duration-300',
                    !isOpen && '-rotate-90'
                  )}
                />
              </span>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>{nav}</CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

export function TableOfContents({
  contentSelector = '.mdx-content',
  className,
  variant = 'default',
}: TableOfContentsProps) {
  const { tocItems, tree } = useTocHeadings(contentSelector);
  const { activeId, scrollToHeading } = useTocSpy(tocItems);

  return (
    <TocPanel
      tree={tree}
      tocItems={tocItems}
      activeId={activeId}
      scrollToHeading={scrollToHeading}
      variant={variant}
      className={className}
      collapsible
    />
  );
}

export function CompactTableOfContents({
  contentSelector = '.mdx-content',
  className,
}: TableOfContentsProps) {
  const { tocItems, tree } = useTocHeadings(contentSelector);
  const { activeId, scrollToHeading } = useTocSpy(tocItems);

  return (
    <TocPanel
      tree={tree}
      tocItems={tocItems}
      activeId={activeId}
      scrollToHeading={scrollToHeading}
      variant="compact"
      className={className}
      collapsible={false}
    />
  );
}
