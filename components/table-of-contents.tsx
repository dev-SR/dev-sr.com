'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}

export function TableOfContents({
  contentSelector = '.mdx-content',
  className,
}: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isSticky, setIsSticky] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [showSticky, setShowSticky] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const collapsibleContentRef = useRef<HTMLDivElement>(null);

  // Extract headings from content
  useEffect(() => {
    const extractHeadings = () => {
      const contentElement = document.querySelector(contentSelector);
      if (!contentElement) return;

      const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const items: TocItem[] = [];

      headings.forEach((heading, index) => {
        const element = heading as HTMLElement;
        let id = element.id;

        // Generate ID if not present
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

    // Initial extraction
    extractHeadings();

    // Re-extract if content changes (for dynamic content)
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

  // Intersection Observer for active section tracking
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observerOptions = {
      rootMargin: '-20% 0% -35% 0%',
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        // Get the first visible heading
        const firstVisible = visibleEntries[0];
        setActiveId(firstVisible.target.id);
      }
    }, observerOptions);

    // Observe all heading elements
    tocItems.forEach((item) => {
      if (observerRef.current) {
        observerRef.current.observe(item.element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [tocItems]);

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Account for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });

      // Update active state immediately for better UX
      setActiveId(id);
    }
  };

  // Render TOC items recursively for nested structure
  const renderTocItems = (
    items: TocItem[],
    minLevel: number = Math.min(...items.map((item) => item.level))
  ) => {
    return items.map((item) => {
      const isActive = activeId === item.id;
      const depth = item.level - minLevel;

      return (
        <button
          key={item.id}
          onClick={() => scrollToHeading(item.id)}
          className={cn(
            'cursor-pointer relative w-full text-left py-1.5 px-2 text-sm rounded-md transition-all duration-200 group',
            'hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
            isActive
              ? 'bg-accent/10 text-accent font-medium'
              : 'text-muted-foreground hover:text-foreground'
          )}
          style={{ paddingLeft: `${depth * 1.25 + 1}rem` }}
        >
          {/* Vertical line (left border tree connector) */}
          <span
            className={cn(
              'absolute left-0 top-0 bottom-0 w-[2px] rounded-full transition-colors duration-300',
              depth === 0
                ? 'bg-border/70'
                : depth === 1
                  ? 'bg-border/60'
                  : depth === 2
                    ? 'bg-border/50'
                    : 'bg-border/30',
              isActive && 'bg-accent'
            )}
            style={{ marginLeft: `${depth * 1.25}rem` }}
          />

          {/* Horizontal connector */}
          {depth > 0 && (
            <span
              className={cn(
                'absolute top-1/2 left-0 w-3 h-[1px] bg-border/60 transition-colors duration-300',
                isActive && 'bg-accent'
              )}
              style={{ marginLeft: `${(depth - 1) * 1.25 + 0.25}rem` }}
            />
          )}

          {/* Heading text */}
          <span
            className="block pl-2 line-clamp-2 relative z-10"
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
    <>
      {/* Accordion TOC - shown at page load */}
      <div className={cn('mb-8', className)}>
        <Card>
          <Collapsible open={isAccordionOpen} onOpenChange={setIsAccordionOpen}>
            <CardHeader className="pb-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <List className="h-5 w-5" />
                    Table of Contents
                  </CardTitle>
                  {isAccordionOpen ? (
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  ) : (
                    <ChevronRight className="h-4 w-4 transition-transform" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              {/* Make the TOC itself scrollable with a sensible max height.
                  Keep the CardContent styling but wrap the nav in a scrollable div.
                  tabIndex and role improve keyboard/accessibility for the scroll region. */}
              <CardContent className="pt-0">
                <div
                  ref={collapsibleContentRef}
                  className="max-h-[60vh] overflow-auto pr-2 overscroll-contain"
                  role="navigation"
                  aria-label="Table of contents"
                  tabIndex={0}
                  data-lenis-prevent
                >
                  <nav className="space-y-1">{renderTocItems(tocItems)}</nav>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </>
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
