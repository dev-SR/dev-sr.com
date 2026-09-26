'use client';

import {
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';
import type { BracketType, RoughAnnotationType } from 'rough-notation/lib/model';
import { cn } from '@/lib/utils';
import {
  strokeColorForType,
  useRoughAnnotation,
  type MarkType,
} from './mark';

const CORAL = '#F08F87';
const SLATE = '#ACC5D3';

export type MdxHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type MdxHeadingVariant = 'blog' | 'learn';

type HeadingMarkConfig = {
  type: RoughAnnotationType;
  color: string;
  brackets?: BracketType | BracketType[];
  padding?: number;
  strokeWidth?: number;
};

const HEADING_MARKS: Partial<Record<MdxHeadingLevel, HeadingMarkConfig>> = {
  h2: { type: 'underline', color: CORAL, padding: 2, strokeWidth: 1.5 },
  h3: { type: 'highlight', color: CORAL, padding: 4 },
  h4: {
    type: 'bracket',
    color: SLATE,
    brackets: 'left',
    padding: 4,
    strokeWidth: 1.5,
  },
};

/** Standard scale tokens so Tailwind always emits CSS (arbitrary rem sizes in new files can miss the scan). */
const SIZE_CLASSES: Record<MdxHeadingLevel, string> = {
  h1: 'text-4xl font-bold leading-tight sm:text-5xl',
  h2: 'text-3xl font-semibold leading-tight sm:text-4xl',
  h3: 'text-2xl font-semibold leading-snug sm:text-3xl',
  h4: 'text-xl font-semibold leading-snug sm:text-2xl',
  h5: 'text-xl font-semibold leading-snug',
  h6: 'text-lg font-semibold leading-snug',
};

const BLOG_RHYTHM: Record<MdxHeadingLevel, string> = {
  h1: 'mb-7 mt-16 scroll-mt-24',
  h2: 'mb-5 mt-14 scroll-mt-24',
  h3: 'mb-4 mt-10 scroll-mt-24',
  h4: 'mb-3 mt-8 scroll-mt-24',
  h5: 'mb-3 mt-6 scroll-mt-24',
  h6: 'mb-2 mt-5 scroll-mt-24',
};

const LEARN_RHYTHM: Record<MdxHeadingLevel, string> = {
  h1: 'mb-6 mt-2 scroll-mt-28',
  h2: 'mb-4 mt-12 scroll-mt-28',
  h3: 'mb-3 mt-8 scroll-mt-28',
  h4: 'mb-2 mt-6 scroll-mt-28',
  h5: 'mb-2 mt-5 scroll-mt-28',
  h6: 'mb-2 mt-4 scroll-mt-28',
};

export type MdxHeadingProps = {
  as: MdxHeadingLevel;
  variant?: MdxHeadingVariant;
} & ComponentPropsWithoutRef<'h1'>;

function HeadingMark({
  as: Tag,
  children,
  mark,
  className,
  ...props
}: {
  as: ElementType;
  children: ReactNode;
  mark: HeadingMarkConfig;
  className?: string;
} & ComponentPropsWithoutRef<'h1'>) {
  const markRef = useRef<HTMLSpanElement>(null);
  const strokeColor = strokeColorForType(mark.type as MarkType, mark.color);

  useRoughAnnotation(markRef, {
    type: mark.type,
    color: strokeColor,
    duration: 900,
    strokeWidth: mark.strokeWidth,
    padding: mark.padding,
    brackets: mark.brackets,
    multiline: true,
    whenVisible: true,
  });

  return (
    <Tag className={className} {...props}>
      <span ref={markRef} className="relative inline">
        {children}
      </span>
    </Tag>
  );
}

/**
 * Heading with shared type scale + rough marks (h2 underline, h3 highlight, h4 bracket).
 * No vertical rhythm — callers supply margins / scroll-margin.
 * Pass `mark` to override the default (e.g. `"box"` for Guide titles).
 */
export function AnnotatedHeading({
  as,
  mark: markOverride,
  children,
  className,
  ...props
}: {
  as: MdxHeadingLevel;
  mark?: RoughAnnotationType | HeadingMarkConfig | false;
} & ComponentPropsWithoutRef<'h1'>) {
  const classes = cn(SIZE_CLASSES[as], 'text-foreground', className);
  const mark: HeadingMarkConfig | undefined =
    markOverride === false
      ? undefined
      : typeof markOverride === 'string'
        ? { type: markOverride, color: CORAL, padding: 4, strokeWidth: 1.5 }
        : markOverride ?? HEADING_MARKS[as];

  if (!mark) {
    const Tag = as;
    return (
      <Tag className={classes} {...props}>
        {children}
      </Tag>
    );
  }

  return (
    <HeadingMark as={as} mark={mark} className={classes} {...props}>
      {children}
    </HeadingMark>
  );
}

export function MdxHeading({
  as,
  variant = 'blog',
  children,
  className,
  ...props
}: MdxHeadingProps) {
  const rhythm = variant === 'learn' ? LEARN_RHYTHM[as] : BLOG_RHYTHM[as];
  return (
    <AnnotatedHeading as={as} className={cn(rhythm, className)} {...props}>
      {children}
    </AnnotatedHeading>
  );
}

export function createMdxHeadings(variant: MdxHeadingVariant = 'blog') {
  const make =
    (as: MdxHeadingLevel) =>
    (props: ComponentPropsWithoutRef<'h1'>) => (
      <MdxHeading as={as} variant={variant} {...props} />
    );

  return {
    h1: make('h1'),
    h2: make('h2'),
    h3: make('h3'),
    h4: make('h4'),
    h5: make('h5'),
    h6: make('h6'),
  };
}
