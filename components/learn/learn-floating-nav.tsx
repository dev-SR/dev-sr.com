'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import {
  ArrowUpDown,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Library,
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

gsap.registerPlugin(useGSAP, MorphSVGPlugin);

const MENU_PATH =
  'M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z';
const CLOSE_PATH =
  'M6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6-5.6 5.6L5 17.6 10.6 12 5 6.4 6.4 5z';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
  const top = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  window.scrollTo({ top, behavior: 'smooth' });
}

function DockIconButton({
  label,
  onClick,
  children,
  href,
  className,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  const classes = cn(
    'flex size-11 items-center justify-center rounded-full text-foreground transition-colors',
    'hover:bg-foreground/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    className
  );

  const control = href ? (
    <Link href={href} transitionTypes={['nav-back']} className={classes} aria-label={label}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={classes} aria-label={label}>
      {children}
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{control}</TooltipTrigger>
      <TooltipContent side="left" sideOffset={10}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export interface LearnFloatingNavProps {
  hasCourseNav: boolean;
  onOpenChapters: () => void;
  onOpenToc: () => void;
}

export function LearnFloatingNav({
  hasCourseNav,
  onOpenChapters,
  onOpenToc,
}: LearnFloatingNavProps) {
  const dockId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const morphPathRef = useRef<SVGPathElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);

  const closeDock = useCallback(() => {
    setOpen(false);
    setScrollOpen(false);
  }, []);

  const openChapters = useCallback(() => {
    closeDock();
    onOpenChapters();
  }, [closeDock, onOpenChapters]);

  const openToc = useCallback(() => {
    closeDock();
    onOpenToc();
  }, [closeDock, onOpenToc]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDock();
    };

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (event.target instanceof Node && !root.contains(event.target)) {
        closeDock();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [closeDock, open]);

  useGSAP(
    () => {
      const path = morphPathRef.current;
      if (!path) return;

      gsap.to(path, {
        morphSVG: open ? CLOSE_PATH : MENU_PATH,
        duration: prefersReducedMotion() ? 0 : 0.35,
        ease: 'power2.inOut',
      });
    },
    { dependencies: [open], scope: rootRef }
  );

  useGSAP(
    () => {
      const stack = stackRef.current;
      if (!stack) return;

      const items = stack.querySelectorAll<HTMLElement>('[data-dock-item]');
      const reduced = prefersReducedMotion();

      if (open) {
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 12, scale: 0.85 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: reduced ? 0 : 0.28,
            stagger: reduced ? 0 : 0.05,
            ease: 'power2.out',
          }
        );
      } else {
        gsap.set(items, { autoAlpha: 0, y: 8, scale: 0.9 });
      }
    },
    { dependencies: [open, scrollOpen], scope: rootRef }
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div
        ref={rootRef}
        className="pointer-events-none fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* 2xl+: scroll only */}
        <div
          className={cn(
            'pointer-events-auto hidden flex-col items-center gap-1 rounded-full border border-border/60',
            'bg-background/80 p-1.5 shadow-lg backdrop-blur-xl 2xl:flex'
          )}>
          <DockIconButton label="Scroll to top" onClick={scrollToTop}>
            <ChevronUp className="size-5" />
          </DockIconButton>
          <DockIconButton label="Scroll to bottom" onClick={scrollToBottom}>
            <ChevronDown className="size-5" />
          </DockIconButton>
        </div>

        {/* Below 2xl: expandable dock */}
        <div
          className={cn(
            'pointer-events-auto flex flex-col items-center rounded-full border border-border/60',
            'bg-background/80 p-1.5 shadow-lg backdrop-blur-xl 2xl:hidden'
          )}>
          <div
            ref={stackRef}
            id={dockId}
            className={cn('flex flex-col items-center gap-1', !open && 'hidden')}
            role="menu"
            aria-label="Learn page navigation">
            <div data-dock-item>
              <DockIconButton label="All courses" href="/learn">
                <Library className="size-5" />
              </DockIconButton>
            </div>
            {hasCourseNav && (
              <div data-dock-item>
                <DockIconButton label="Chapters" onClick={openChapters}>
                  <BookOpen className="size-5" />
                </DockIconButton>
              </div>
            )}
            <div data-dock-item>
              <DockIconButton label="On this page" onClick={openToc}>
                <List className="size-5" />
              </DockIconButton>
            </div>
            {scrollOpen ? (
              <>
                <div data-dock-item>
                  <DockIconButton
                    label="Scroll to top"
                    onClick={() => {
                      scrollToTop();
                      closeDock();
                    }}>
                    <ChevronUp className="size-5" />
                  </DockIconButton>
                </div>
                <div data-dock-item>
                  <DockIconButton
                    label="Scroll to bottom"
                    onClick={() => {
                      scrollToBottom();
                      closeDock();
                    }}>
                    <ChevronDown className="size-5" />
                  </DockIconButton>
                </div>
              </>
            ) : (
              <div data-dock-item>
                <DockIconButton label="Scroll" onClick={() => setScrollOpen(true)}>
                  <ArrowUpDown className="size-5" />
                </DockIconButton>
              </div>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex size-12 items-center justify-center rounded-full text-foreground transition-colors',
                  'hover:bg-foreground/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  open && 'bg-foreground/6'
                )}
                aria-label={open ? 'Close navigation dock' : 'Open navigation dock'}
                aria-expanded={open}
                aria-controls={dockId}
                onClick={() => {
                  if (open) closeDock();
                  else setOpen(true);
                }}>
                <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                  <path ref={morphPathRef} d={MENU_PATH} fill="currentColor" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={10}>
              {open ? 'Close' : 'Navigate'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
