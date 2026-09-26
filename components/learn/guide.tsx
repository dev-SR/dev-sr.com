'use client';

import { createContext, useContext } from 'react';
import type React from 'react';
import { InlineCode } from '@/components/code/inline-code';
import {
  AnnotatedHeading,
  type MdxHeadingLevel,
} from '@/components/mdx/heading';
import { cn } from '@/lib/utils';

export type GuideHeadingLevel = 2 | 3 | 4;

type GuideContextValue = {
  numbered: boolean;
  headingLevel: GuideHeadingLevel;
  stepHeadingLevel: GuideHeadingLevel;
};

const GuideContext = createContext<GuideContextValue>({
  numbered: false,
  headingLevel: 3,
  stepHeadingLevel: 3,
});

/** Strip `` `code` `` markers so heading ids match MDX prose headings. */
function plainTitle(text: string): string {
  return text.replace(/`([^`]+)`/g, '$1');
}

function slugifyHeading(text: string): string {
  return (
    plainTitle(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'heading'
  );
}

/** Render inline `` `code` `` in Guide titles like MDX prose. */
function renderTitle(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <InlineCode key={i}>{part.slice(1, -1)}</InlineCode>;
    }
    return part;
  });
}

function toHeadingTag(level: GuideHeadingLevel): MdxHeadingLevel {
  return `h${level}` as MdxHeadingLevel;
}

function GuideHeading({
  level,
  id,
  className,
  children,
}: {
  level: GuideHeadingLevel;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AnnotatedHeading
      as={toHeadingTag(level)}
      id={id}
      mark={false}
      className={className}>
      {children}
    </AnnotatedHeading>
  );
}

export function Guide({
  title,
  numbered = false,
  headingLevel = 3,
  stepHeadingLevel,
  className,
  children,
}: {
  title?: string;
  numbered?: boolean;
  /** Heading level for the Guide `title` (default `3` → `h3`). */
  headingLevel?: GuideHeadingLevel;
  /** Heading level for GuideStep titles. Defaults to `headingLevel` (same level). */
  stepHeadingLevel?: GuideHeadingLevel;
  className?: string;
  children: React.ReactNode;
}) {
  const resolvedStepLevel = stepHeadingLevel ?? headingLevel;

  return (
    <GuideContext.Provider
      value={{
        numbered,
        headingLevel,
        stepHeadingLevel: resolvedStepLevel,
      }}>
      <div className={cn('not-prose my-10', className)}>
        {title && (
          <GuideHeading
            level={headingLevel}
            id={slugifyHeading(title)}
            className="mb-6 scroll-m-28 tracking-tight">
            {renderTitle(title)}
          </GuideHeading>
        )}
        <div
          className={cn(
            'ml-4 flex flex-col gap-10 border-l border-border/70 pl-10 [--guide-line-offset:2.5rem]',
            numbered && '[counter-reset:guide-step]'
          )}>
          {children}
        </div>
      </div>
    </GuideContext.Provider>
  );
}

export function GuideStep({
  title,
  headingLevel,
  className,
  children,
}: {
  title: string;
  /** Override the Guide's `stepHeadingLevel` for this step. */
  headingLevel?: GuideHeadingLevel;
  className?: string;
  children: React.ReactNode;
}) {
  const { numbered, stepHeadingLevel } = useContext(GuideContext);
  const level = headingLevel ?? stepHeadingLevel;

  return (
    <div className={cn(numbered && 'guide-step-numbered', className)}>
      <div className="relative">
        {!numbered && (
          <span
            aria-hidden
            className="absolute top-0 -left-[var(--guide-line-offset)] z-20 block h-full w-[6px] rounded-tr-full rounded-br-full bg-muted"
          />
        )}
        <GuideHeading
          level={level}
          id={slugifyHeading(title)}
          className="scroll-m-28 tracking-tight">
          {renderTitle(title)}
        </GuideHeading>
      </div>
      {children && (
        <div className="mt-4 flex flex-col gap-4 [&_.code-block]:my-0 [&>:first-child]:mt-0">
          {children}
        </div>
      )}
    </div>
  );
}
