'use client';

import {
  useEffect,
  useId,
  useRef,
  type RefObject,
  type ReactNode,
} from 'react';
import { annotate } from 'rough-notation';
import type {
  BracketType,
  RoughAnnotationConfig,
  RoughAnnotationType,
} from 'rough-notation/lib/model';
import { cn } from '@/lib/utils';

const DEFAULT_MARK_COLOR = '#F08F87';

/** Named ink presets — also accept any CSS color string (`#abc`, `rgb()`, …). */
export const MARK_COLOR_PRESETS = {
  default: DEFAULT_MARK_COLOR,
  note: '#64748b',
  tip: '#16a34a',
  info: '#2563eb',
  warning: '#d97706',
  danger: '#dc2626',
  success: '#16a34a',
  accent: '#a855f7',
} as const;

export type MarkColorPreset = keyof typeof MARK_COLOR_PRESETS;

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type MarkType = RoughAnnotationType;
export type MarkNoteLayout = 'floating' | 'margin' | 'inline';
export type MarkNoteSide = 'left' | 'right' | 'top' | 'bottom';
export type MarkNoteVariant = 'plain' | 'sticky' | 'card';

export interface MarkProps {
  children: ReactNode;
  type?: MarkType;
  /**
   * Stroke / ink color. Use a preset (`warning`, `tip`, `info`, `danger`,
   * `note`, `success`, `accent`, `default`) or any CSS color (`#F08F87`).
   * Defaults to `#F08F87`.
   */
  color?: MarkColorPreset | (string & {});
  animate?: boolean;
  duration?: number;
  strokeWidth?: number;
  padding?: number;
  iterations?: number;
  brackets?: BracketType | BracketType[];
  /** Optional arrow sidenote attached to this mark. */
  note?: string;
  noteLayout?: MarkNoteLayout;
  noteSide?: MarkNoteSide;
  noteVariant?: MarkNoteVariant;
  /** Note/arrow ink — same presets or CSS color as `color`; defaults to stroke color. */
  noteColor?: MarkColorPreset | (string & {});
  /**
   * Optional max width for the note (e.g. `18rem`, `280px`, or `280` as px).
   * Default is content-width (single line, no wrap).
   */
  noteMaxWidth?: string | number;
  arrow?: boolean;
  className?: string;
}

export function resolveMarkColor(value?: string): string {
  if (!value) return DEFAULT_MARK_COLOR;
  if (value in MARK_COLOR_PRESETS) {
    return MARK_COLOR_PRESETS[value as MarkColorPreset];
  }
  return value;
}

/** Highlight fills look better slightly transparent when given a solid hex. */
export function strokeColorForType(type: MarkType, color: string): string {
  if (type !== 'highlight') return color;
  if (color.length === 7 && color.startsWith('#') && /^#[0-9a-fA-F]{6}$/.test(color)) {
    return `${color}66`;
  }
  return color;
}

function resolveNoteMaxWidth(value?: string | number): string | undefined {
  if (value === undefined || value === '') return undefined;
  if (typeof value === 'number') return `${value}px`;
  return value;
}

export interface UseRoughAnnotationOptions {
  type: RoughAnnotationType;
  color: string;
  animate?: boolean;
  duration?: number;
  strokeWidth?: number;
  padding?: number;
  iterations?: number;
  brackets?: BracketType | BracketType[];
  multiline?: boolean;
  /**
   * When true, wait until the element enters the viewport before showing.
   * Useful for headings so a long article does not animate every mark at once.
   */
  whenVisible?: boolean;
}

/**
 * Lifecycle for a rough-notation annotation: create, show (optionally on
 * intersect), redraw on resize / font load, and clean up.
 */
export function useRoughAnnotation(
  ref: RefObject<HTMLElement | null>,
  {
    type,
    color,
    animate = true,
    duration = 800,
    strokeWidth,
    padding,
    iterations,
    brackets,
    multiline = true,
    whenVisible = false,
  }: UseRoughAnnotationOptions
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const shouldAnimate = animate && !prefersReducedMotion();
    const config: RoughAnnotationConfig = {
      type,
      color,
      animate: shouldAnimate,
      animationDuration: duration,
      strokeWidth,
      padding,
      iterations,
      brackets,
      multiline,
    };
    const annotation = annotate(el, config);

    /** rough-notation measures once at show(); hide→show remasures. */
    const redraw = (withAnimation = false) => {
      const prevAnimate = annotation.animate;
      annotation.animate = withAnimation && shouldAnimate;
      if (annotation.isShowing()) annotation.hide();
      annotation.show();
      annotation.animate = prevAnimate;
    };

    // Ignore layout noise while the entrance animation runs (RO often fires on observe).
    let suppressUntil = 0;
    let rafId = 0;
    const scheduleRedraw = () => {
      if (performance.now() < suppressUntil) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => redraw(false));
    };

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      suppressUntil = performance.now() + (shouldAnimate ? duration + 50 : 0);
      redraw(true);
    };

    let intersectionObserver: IntersectionObserver | null = null;
    if (whenVisible) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            show();
            intersectionObserver?.disconnect();
            intersectionObserver = null;
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.2 }
      );
      intersectionObserver.observe(el);
    } else {
      show();
    }

    // Mark size changes (wrap, font metrics) and content-root size changes
    // (images/code above push the mark) both invalidate the SVG position.
    const resizeObserver = new ResizeObserver(() => {
      if (!shown) return;
      scheduleRedraw();
    });
    resizeObserver.observe(el);
    const layoutRoot =
      el.closest('.mdx-content, .learn-content, article, main') ?? el.parentElement;
    if (layoutRoot && layoutRoot !== el) {
      resizeObserver.observe(layoutRoot);
    }

    const onWindowResize = () => {
      if (!shown) return;
      scheduleRedraw();
    };
    window.addEventListener('resize', onWindowResize);

    let fontsCancelled = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!fontsCancelled && shown) {
          suppressUntil = 0;
          scheduleRedraw();
        }
      });
    }
    // Catch late layout after images / deferred client UI settle.
    const settleTimer = window.setTimeout(() => {
      if (!shown) return;
      suppressUntil = 0;
      scheduleRedraw();
    }, Math.max(400, shouldAnimate ? duration + 100 : 0));

    return () => {
      fontsCancelled = true;
      cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      window.removeEventListener('resize', onWindowResize);
      intersectionObserver?.disconnect();
      resizeObserver.disconnect();
      annotation.remove();
    };
  }, [
    ref,
    type,
    color,
    animate,
    duration,
    strokeWidth,
    padding,
    iterations,
    brackets,
    multiline,
    whenVisible,
  ]);
}

function NoteBody({
  note,
  variant,
  color,
  maxWidth,
  className,
}: {
  note: string;
  variant: MarkNoteVariant;
  color: string;
  maxWidth?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'block w-max whitespace-nowrap font-hand text-sm leading-none font-medium tracking-wide',
        maxWidth && 'max-w-full overflow-hidden text-ellipsis',
        variant === 'sticky' &&
          'rounded-sm bg-amber-100 px-2 py-1 shadow-sm -rotate-1 dark:bg-amber-950/60',
        variant === 'card' && 'rounded-md border border-dashed px-2 py-1',
        className
      )}
      style={{
        color,
        borderColor: variant === 'card' ? color : undefined,
        maxWidth,
      }}>
      {note}
    </span>
  );
}

/** Inline connector for left/right (in-flow). Top/bottom use BentCornerArrow. */
function FloatingArrow({
  side,
  color,
}: {
  side: Extract<MarkNoteSide, 'left' | 'right'>;
  color: string;
}) {
  if (side === 'left') {
    // Note is to the left of the arrow: tip toward note (←).
    return (
      <svg
        aria-hidden
        viewBox="0 0 24 16"
        className="size-5 shrink-0 overflow-visible"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M22 8 C 16 6, 10 6, 4 8" />
        <path d="M8 5 L3 8 L8 11" />
      </svg>
    );
  }

  // right: tip toward note (→).
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 16"
      className="size-5 shrink-0 overflow-visible"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M2 8 C 8 6, 14 6, 20 8" />
      <path d="M16 5 L21 8 L16 11" />
    </svg>
  );
}

/**
 * L-bend connector for top/bottom — like ⤵ / ⤴ (vertical then tip rightwards).
 * Absolute so notes sit in the corner without stretching line-height.
 */
function BentCornerArrow({
  side,
  color,
}: {
  side: Extract<MarkNoteSide, 'top' | 'bottom'>;
  color: string;
}) {
  if (side === 'top') {
    // Up, then tip rightwards (⤴).
    return (
      <svg
        aria-hidden
        viewBox="0 0 28 22"
        className="pointer-events-none absolute bottom-[88%] left-[88%] size-7 overflow-visible"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M2 20 L2 8 C2 6, 4 4, 10 4 L22 4" />
        <path d="M18 1 L23 4 L18 7" />
      </svg>
    );
  }

  // Down, then tip rightwards (⤵).
  return (
    <svg
      aria-hidden
      viewBox="0 0 28 22"
      className="pointer-events-none absolute top-[88%] left-[88%] size-7 overflow-visible"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M2 2 L2 14 C2 16, 4 18, 10 18 L22 18" />
      <path d="M18 14 L23 18 L18 22" />
    </svg>
  );
}

function marginNotePositionClass() {
  return 'absolute top-0 left-[calc(100%+1.75rem)] z-20 w-max';
}

export function Mark({
  children,
  type = 'underline',
  color,
  animate = true,
  duration = 800,
  strokeWidth,
  padding,
  iterations,
  brackets,
  note,
  noteLayout = 'floating',
  noteSide = 'right',
  noteVariant = 'plain',
  noteColor,
  noteMaxWidth,
  arrow = true,
  className,
}: MarkProps) {
  const markRef = useRef<HTMLSpanElement>(null);
  const noteId = useId();
  const resolvedColor = resolveMarkColor(color);
  const strokeColor = strokeColorForType(type, resolvedColor);
  const ink = noteColor ? resolveMarkColor(noteColor) : resolvedColor;
  const hasNote = Boolean(note);
  const resolvedMaxWidth = resolveNoteMaxWidth(noteMaxWidth);

  useRoughAnnotation(markRef, {
    type,
    color: strokeColor,
    animate,
    duration,
    strokeWidth,
    padding,
    iterations,
    brackets,
  });

  if (!hasNote) {
    return (
      <span ref={markRef} className={cn('relative inline', className)}>
        {children}
      </span>
    );
  }

  if (noteLayout === 'inline') {
    return (
      <span className={cn('inline', className)}>
        <span ref={markRef} className="relative inline" aria-describedby={noteId}>
          {children}
        </span>
        <span
          id={noteId}
          role="note"
          className="mt-2 flex w-max items-start gap-2 border-l-2 border-dashed pl-3"
          style={{ borderColor: ink, maxWidth: resolvedMaxWidth }}>
          {arrow && (
            <svg
              aria-hidden
              viewBox="0 0 16 24"
              className="mt-0.5 size-4 shrink-0"
              fill="none"
              stroke={ink}
              strokeWidth="1.6"
              strokeLinecap="round">
              <path d="M8 2 C 7 8, 7 14, 8 20 M5 17 L8 21 L11 17" />
            </svg>
          )}
          <NoteBody
            note={note!}
            variant={noteVariant}
            color={ink}
            maxWidth={resolvedMaxWidth}
          />
        </span>
      </span>
    );
  }

  const markEl = (
    <span ref={markRef} className="relative inline" aria-describedby={noteId}>
      {children}
    </span>
  );

  const floatingNoteEl = (
    <span
      id={noteId}
      role="note"
      className="pointer-events-none w-max shrink-0"
      style={{ maxWidth: resolvedMaxWidth }}>
      <NoteBody
        note={note!}
        variant={noteVariant}
        color={ink}
        maxWidth={resolvedMaxWidth}
      />
    </span>
  );

  // Floating: left/right stay in-flow; top/bottom use a corner bend so line-height stays calm.
  if (noteLayout === 'floating') {
    if (noteSide === 'left') {
      return (
        <span className={cn('inline-flex items-center gap-1.5 align-baseline', className)}>
          {floatingNoteEl}
          {arrow ? <FloatingArrow side="left" color={ink} /> : null}
          {markEl}
        </span>
      );
    }
    if (noteSide === 'right') {
      return (
        <span className={cn('inline-flex items-center gap-1.5 align-baseline', className)}>
          {markEl}
          {arrow ? <FloatingArrow side="right" color={ink} /> : null}
          {floatingNoteEl}
        </span>
      );
    }

    // top / bottom — absolute note + ⤵/⤴ bend; modest margin reserves room without flex-col.
    const isTop = noteSide === 'top';
    return (
      <span
        className={cn(
          'relative inline-block align-baseline',
          isTop ? 'mt-8' : 'mb-8',
          className
        )}>
        {markEl}
        {arrow ? <BentCornerArrow side={isTop ? 'top' : 'bottom'} color={ink} /> : null}
        <span
          id={noteId}
          role="note"
          className={cn(
            'pointer-events-none absolute z-20 w-max',
            isTop
              ? 'bottom-[calc(100%+0.2rem)] left-[calc(100%+0.2rem)]'
              : 'top-[calc(100%+0.2rem)] left-[calc(100%+0.2rem)]'
          )}
          style={{ maxWidth: resolvedMaxWidth }}>
          <NoteBody
            note={note!}
            variant={noteVariant}
            color={ink}
            maxWidth={resolvedMaxWidth}
          />
        </span>
      </span>
    );
  }

  // Margin: absolute note in the desktop gutter; stacked fallback on small screens.
  return (
    <span className={cn('relative inline-block align-baseline lg:mr-0', className)}>
      {markEl}

      <span
        id={noteId}
        role="note"
        className="mt-2 block w-max lg:hidden"
        style={{ maxWidth: resolvedMaxWidth }}>
        <NoteBody
          note={note!}
          variant={noteVariant}
          color={ink}
          maxWidth={resolvedMaxWidth}
        />
      </span>

      <span
        role="note"
        className={cn(
          'pointer-events-none',
          marginNotePositionClass(),
          'hidden lg:block'
        )}
        style={{ maxWidth: resolvedMaxWidth }}>
        {arrow && (
          <svg
            aria-hidden
            viewBox="0 0 24 16"
            className="absolute top-1 -left-6 size-5"
            fill="none"
            stroke={ink}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M2 8 C 8 6, 14 6, 20 8 M16 5 L21 8 L16 11" />
          </svg>
        )}
        <NoteBody
          note={note!}
          variant={noteVariant}
          color={ink}
          maxWidth={resolvedMaxWidth}
        />
      </span>
    </span>
  );
}

/** @deprecated Use `<Mark note="…">` instead. */
export function Sidenote({
  children,
  note,
  layout = 'floating',
  side = 'right',
  arrow = true,
  variant = 'plain',
  className,
}: {
  children: ReactNode;
  note: string;
  layout?: MarkNoteLayout;
  side?: MarkNoteSide;
  arrow?: boolean;
  variant?: MarkNoteVariant;
  className?: string;
}) {
  return (
    <Mark
      type="underline"
      note={note}
      noteLayout={layout}
      noteSide={side}
      noteVariant={variant}
      arrow={arrow}
      className={className}>
      {children}
    </Mark>
  );
}
