'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface TocItem {
  id: string;
  text: string;
  textHtml?: string;
  level: number;
  element: HTMLElement;
}

interface TableOfContentsProps {
  contentSelector?: string;
  className?: string;
  visibleRange?: number;
}

export function TableOfContents({
  contentSelector = '.mdx-content',
  className,
  visibleRange = 3,
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const minLevel = useMemo(
    () => (tocItems.length > 0 ? Math.min(...tocItems.map((item) => item.level)) : 1),
    [tocItems]
  );
  const activeIndex = Math.max(
    0,
    tocItems.findIndex((item) => item.id === activeId)
  );

  useEffect(() => {
    const extractHeadings = () => {
      const contentElement = document.querySelector(contentSelector);
      if (!contentElement) return;

      const headings = contentElement.querySelectorAll('h1, h2, h3, h4');
      const items: TocItem[] = [];

      headings.forEach((heading, index) => {
        const element = heading as HTMLElement;
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
          textHtml: element.innerHTML || element.textContent || '',
          level: Number.parseInt(element.tagName.charAt(1)),
          element,
        });
      });

      setTocItems((currentItems) => {
        const currentSignature = currentItems
          .map((item) => `${item.id}:${item.level}:${item.text}`)
          .join('|');
        const nextSignature = items.map((item) => `${item.id}:${item.level}:${item.text}`).join('|');
        return currentSignature === nextSignature ? currentItems : items;
      });
    };

    extractHeadings();

    const observer = new MutationObserver(extractHeadings);
    const contentElement = document.querySelector(contentSelector);
    if (contentElement) {
      observer.observe(contentElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, [contentSelector]);

  useEffect(() => {
    if (tocItems.length === 0) return;

    if (!activeId || !tocItems.some((item) => item.id === activeId)) {
      setActiveId(tocItems[0].id);
    }
  }, [activeId, tocItems]);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const observerOptions = {
      rootMargin: '-18% 0% -55% 0%',
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    }, observerOptions);

    tocItems.forEach((item) => observerRef.current?.observe(item.element));

    return () => observerRef.current?.disconnect();
  }, [tocItems]);

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (!viewport || !activeId) return;

    const activeButton = Array.from(
      viewport.querySelectorAll<HTMLElement>('[data-toc-id]')
    ).find((element) => element.dataset.tocId === activeId);

    if (!activeButton) return;

    const nextTop = activeButton.offsetTop - viewport.clientHeight / 2 + activeButton.clientHeight / 2;
    viewport.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
  }, [activeId, tocItems.length]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const yOffset = -92;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    });
    setActiveId(id);
  };

  const renderTocItems = () => {
    return tocItems.map((item, index) => {
      const isActive = activeId === item.id;
      const depth = item.level - minLevel;
      const distanceFromActive = Math.abs(index - activeIndex);
      const isNearActive = distanceFromActive <= visibleRange;

      return (
        <button
          key={item.id}
          data-toc-id={item.id}
          onClick={() => scrollToHeading(item.id)}
          className={cn(
            'group relative flex min-h-10 w-full cursor-pointer items-center rounded-md py-2 pr-2 text-left text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/35',
            isActive
              ? 'bg-white/[0.045] text-foreground shadow-[inset_2px_0_0_rgba(240,143,135,0.9)]'
              : 'text-muted-foreground/55 hover:bg-white/[0.025] hover:text-muted-foreground',
            !isNearActive && 'opacity-55'
          )}
          style={{ paddingLeft: `${depth * 0.9 + 0.65}rem` }}
        >
          <span
            className={cn(
              'mr-2 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300',
              isActive ? 'scale-125 bg-[#F08F87]' : 'bg-white/20 group-hover:bg-white/35'
            )}
          />
          <span
            className={cn(
              'relative z-10 block line-clamp-2 leading-5 transition-transform duration-300',
              isActive && 'translate-x-0.5 font-medium'
            )}
            dangerouslySetInnerHTML={{ __html: item.textHtml ?? item.text }}
          />
        </button>
      );
    });
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative mb-8', className)}>
      <Collapsible open={isAccordionOpen} onOpenChange={setIsAccordionOpen}>
        <div className="relative overflow-hidden rounded-lg bg-background/20 py-3 backdrop-blur-sm">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="mb-1 h-auto w-full justify-between rounded-md px-2 py-1.5 text-left hover:bg-white/[0.025]"
            >
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground/85">
                <List className="size-4 text-muted-foreground" />
                <span className="truncate">On this page</span>
              </span>
              <span className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/70">
                {activeIndex + 1}/{tocItems.length}
                <ChevronDown
                  className={cn(
                    'size-3.5 transition-transform duration-300',
                    !isAccordionOpen && '-rotate-90'
                  )}
                />
              </span>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="relative">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-linear-to-b from-background via-background/80 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-linear-to-t from-background via-background/80 to-transparent" />
              <div
                ref={scrollViewportRef}
                className="max-h-[17rem] overflow-y-auto overscroll-contain pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="navigation"
                aria-label="Table of contents"
                tabIndex={0}
                data-lenis-prevent
                data-lenis-prevent-wheel
                data-lenis-prevent-touch
              >
                <nav className="space-y-0.5 py-8">{renderTocItems()}</nav>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

// Compact version for sidebar use
export function CompactTableOfContents({
  contentSelector = '.mdx-content',
  className,
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Extract headings from content
  useEffect(() => {
    const extractHeadings = () => {
      const contentElement = document.querySelector(contentSelector);
      if (!contentElement) return;

      const headings = contentElement.querySelectorAll('h1, h2, h3, h4');
      const items: TocItem[] = [];

      headings.forEach((heading, index) => {
        const element = heading as HTMLElement;
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
          textHtml: element.innerHTML || element.textContent || '',
          level: Number.parseInt(element.tagName.charAt(1)),
          element,
        });
      });

      setTocItems(items);
    };

    extractHeadings();

    const observer = new MutationObserver(extractHeadings);
    const contentElement = document.querySelector(contentSelector);
    if (contentElement) {
      observer.observe(contentElement, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [contentSelector]);

  // Intersection Observer for active section
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    tocItems.forEach((item) => observer.observe(item.element));
    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h3 className="text-sm font-semibold text-foreground mb-3">On This Page</h3>

      {/* Compact TOC scrollable wrapper for long lists */}
      <div
        className="max-h-[50vh] overflow-auto pr-2 overscroll-contain"
        role="navigation"
        aria-label="On this page"
        tabIndex={0}
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
      >
        <nav className="space-y-1">
          {tocItems.map((item) => {
            const isActive = activeId === item.id;
            const indentLevel = item.level - Math.min(...tocItems.map((i) => i.level));

            return (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={cn(
                  'group block w-full text-left py-1.5 px-2 rounded text-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                  isActive
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )}
              >
                <span
                  className={cn(
                    'block border-l pl-3',
                    isActive ? 'border-accent' : 'border-border/60',
                    'group-hover:border-border'
                  )}
                  style={{ marginLeft: `${indentLevel * 0.75}rem` }}
                >
                  <span
                    className="line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: item.textHtml ?? item.text }}
                  />
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
