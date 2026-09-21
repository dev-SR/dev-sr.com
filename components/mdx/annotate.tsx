'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { annotate } from 'rough-notation';
import type {
  BracketType,
  RoughAnnotation,
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

function resolveMarkColor(value?: string): string {
  if (!value) return DEFAULT_MARK_COLOR;
  if (value in MARK_COLOR_PRESETS) {
    return MARK_COLOR_PRESETS[value as MarkColorPreset];
  }
  return value;
}

/** Highlight fills look better slightly transparent when given a solid hex. */
function strokeColorForType(type: MarkType, color: string): string {
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

/** L-shaped hand-drawn connector from mark → note (matches note-taking screenshots). */
function FloatingArrow({
  side,
  color,
}: {
  side: MarkNoteSide;
  color: string;
}) {
  if (side === 'right' || side === 'bottom') {
    return (
      <svg
        aria-hidden
        viewBox="0 0 28 22"
        className="pointer-events-none absolute top-[85%] left-[92%] size-7 overflow-visible"
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
  if (side === 'left') {
    return (
      <svg
        aria-hidden
        viewBox="0 0 28 22"
        className="pointer-events-none absolute top-[85%] right-[92%] size-7 overflow-visible"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M26 2 L26 14 C26 16, 24 18, 18 18 L6 18" />
        <path d="M10 14 L5 18 L10 22" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden
      viewBox="0 0 22 28"
      className="pointer-events-none absolute bottom-[85%] left-1/2 size-7 -translate-x-1/2 overflow-visible"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M11 26 L11 10 C11 6, 13 4, 18 4 L20 4" />
      <path d="M16 1 L21 4 L16 7" />
    </svg>
  );
}

function notePositionClass(layout: MarkNoteLayout, side: MarkNoteSide) {
  if (layout === 'margin') {
    return 'absolute top-0 left-[calc(100%+1.75rem)] z-20 w-max';
  }
  switch (side) {
    case 'left':
      return 'absolute top-[calc(100%+0.15rem)] right-[calc(100%+0.25rem)] z-20 w-max';
    case 'top':
      return 'absolute bottom-[calc(100%+1.25rem)] left-1/2 z-20 w-max -translate-x-1/2';
    case 'bottom':
    case 'right':
    default:
      return 'absolute top-[calc(100%+0.35rem)] left-[calc(100%+1.45rem)] z-20 w-max';
  }
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
  const annotationRef = useRef<RoughAnnotation | null>(null);
  const noteId = useId();
  const resolvedColor = resolveMarkColor(color);
  const strokeColor = strokeColorForType(type, resolvedColor);
  const ink = noteColor ? resolveMarkColor(noteColor) : resolvedColor;
  const hasNote = Boolean(note);
  const resolvedMaxWidth = resolveNoteMaxWidth(noteMaxWidth);

  useEffect(() => {
    const el = markRef.current;
    if (!el) return;

    annotationRef.current?.remove();
    annotationRef.current = null;

    const annotation = annotate(el, {
      type,
      color: strokeColor,
      animate: animate && !prefersReducedMotion(),
      animationDuration: duration,
      strokeWidth,
      padding,
      iterations,
      brackets,
      multiline: true,
    });
    annotationRef.current = annotation;
    annotation.show();

    return () => {
      annotation.remove();
      annotationRef.current = null;
    };
  }, [
    type,
    strokeColor,
    animate,
    duration,
    strokeWidth,
    padding,
    iterations,
    brackets,
  ]);

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

  return (
    <span
      className={cn(
        'relative inline-block align-baseline',
        noteLayout === 'floating' && 'mb-6',
        noteLayout === 'margin' && 'lg:mr-0',
        className
      )}>
      <span ref={markRef} className="relative inline" aria-describedby={noteId}>
        {children}
      </span>

      {noteLayout === 'margin' && (
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
      )}

      {arrow && noteLayout === 'floating' && <FloatingArrow side={noteSide} color={ink} />}

      <span
        id={noteLayout === 'margin' ? undefined : noteId}
        role="note"
        className={cn(
          'pointer-events-none',
          notePositionClass(noteLayout, noteSide),
          noteLayout === 'margin' && 'hidden lg:block'
        )}
        style={{ maxWidth: resolvedMaxWidth }}>
        {arrow && noteLayout === 'margin' && (
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
