'use client';
import { Children, isValidElement } from 'react';

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
import { MDX_SPACE } from './spacing';

export { MDX_SPACE } from './spacing';

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
  h2: { type: 'underline', color: SLATE, padding: 2, strokeWidth: 3 },
  h3: { type: 'highlight', color: "#64748b", padding: 4 },
  h4: {
    type: 'bracket',
    color: CORAL,
    brackets: ['left', 'right'],
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

/** Shared heading → body gap (tight). Section gap comes from `mt-*`. */
const HEADING_BOTTOM: Record<MdxHeadingLevel, string> = {
  h1: 'mb-6',
  h2: 'mb-4',
  h3: 'mb-3',
  h4: 'mb-3',
  h5: 'mb-2',
  h6: 'mb-2',
};

const BLOG_RHYTHM: Record<MdxHeadingLevel, string> = {
  h1: cn('mt-16 scroll-mt-24', HEADING_BOTTOM.h1),
  h2: cn('mt-12 scroll-mt-24', HEADING_BOTTOM.h2),
  h3: cn('mt-10 scroll-mt-24', HEADING_BOTTOM.h3),
  h4: cn('mt-8 scroll-mt-24', HEADING_BOTTOM.h4),
  h5: cn('mt-6 scroll-mt-24', HEADING_BOTTOM.h5),
  h6: cn('mt-6 scroll-mt-24', HEADING_BOTTOM.h6),
};

const LEARN_RHYTHM: Record<MdxHeadingLevel, string> = {
  h1: cn('mt-2 scroll-mt-28', HEADING_BOTTOM.h1),
  h2: cn('mt-12 scroll-mt-28', HEADING_BOTTOM.h2),
  h3: cn('mt-10 scroll-mt-28', HEADING_BOTTOM.h3),
  h4: cn('mt-8 scroll-mt-28', HEADING_BOTTOM.h4),
  h5: cn('mt-6 scroll-mt-28', HEADING_BOTTOM.h5),
  h6: cn('mt-6 scroll-mt-28', HEADING_BOTTOM.h6),
};

const PARAGRAPH_CLASS = cn(
  MDX_SPACE.block,
  'text-[1.03rem] leading-8 text-muted-foreground'
);

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
function getComponentName(type: unknown): string | undefined {
  if (typeof type !== 'function') {
    return undefined;
  }

  // React 19 types `JSXElementConstructor` as a call/construct signature,
  // which has no `displayName` or `name` on the type even though functions do at runtime.
  const component = type as { displayName?: string; name?: string };
  return component.displayName || component.name || undefined;
}


function isBlockElement(child: React.ReactElement): boolean {
  const type = child.type;

  if (typeof type === 'string') {
    return ['img', 'figure', 'pre', 'div', 'blockquote', 'table', 'ul', 'ol', 'hr'].includes(type);
  }

  if (typeof type === 'function') {
    const name = getComponentName(type);
    if (
      name === 'MdxImage' ||
      name === 'Figure' ||
      name === 'PreCustom' ||
      name === 'LearnPreCustom' ||
      name === 'PrettyCodeFigure' ||
      name === 'DocsPrettyFigure' ||
      name === 'CodeTabs' ||
      name === 'CodeFrame' ||
      name === 'CodeBlock' ||
      name === 'DocsCodeBlock'
    ) {
      return true;
    }
  }

  return typeof (child.props as { src?: unknown }).src === 'string';
}


function splitParagraphChildren(children: React.ReactNode) {
  const meaningfulChildren = Children.toArray(children).filter(
    (child) => typeof child !== 'string' || child.trim().length > 0
  );

  const blockChildren: React.ReactNode[] = [];
  const inlineChildren: React.ReactNode[] = [];

  meaningfulChildren.forEach((child) => {
    if (isValidElement(child) && isBlockElement(child)) {
      blockChildren.push(child);
      return;
    }
    inlineChildren.push(child);
  });

  return { blockChildren, inlineChildren };
}

export function Paragraph({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  const { blockChildren, inlineChildren } = splitParagraphChildren(children);

  if (blockChildren.length === 0) {
    return (
      <p className={PARAGRAPH_CLASS} {...props}>
        {children}
      </p>
    );
  }

  if (inlineChildren.length === 0) {
    return <>{children}</>;
  }

  return (
    <>
      <p className={PARAGRAPH_CLASS} {...props}>
        {inlineChildren}
      </p>
      {blockChildren}
    </>
  );
}
