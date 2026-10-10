'use client';

import type React from 'react';
import { cn } from '@/lib/utils';
import { Figure, MdxImage } from '@/components/mdx/figure';
import { MDX_SPACE } from '@/components/mdx/spacing';
import { createMdxHeadings, Paragraph } from '@/components/mdx/typography';
import { MdxLink } from '@/components/mdx/mdx-link';

const headings = createMdxHeadings('learn');

const LIST_NESTED = '[&_p]:mb-0 [&_ul]:mb-0 [&_ol]:mb-0';
/** Tight gap between items; last item keeps the list’s outer `mb-6` only. */
const LIST_ITEM_GAP = '[&>li:not(:last-child)]:mb-1';

export const learnMdxServerComponents = {
  ...headings,
  p: Paragraph,
  ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className={cn(
        MDX_SPACE.block,
        LIST_NESTED,
        LIST_ITEM_GAP,
        'flex list-disc flex-col pl-6 text-muted-foreground marker:text-accent/70 [&>li]:leading-8'
      )}
      {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className={cn(
        MDX_SPACE.block,
        LIST_NESTED,
        LIST_ITEM_GAP,
        'flex list-decimal flex-col pl-6 text-muted-foreground marker:font-mono marker:text-accent/80 [&>li]:leading-8'
      )}
      {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.ComponentPropsWithoutRef<'li'>) => (
    <li className="pl-1" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className={cn(
        MDX_SPACE.media,
        'rounded-r-lg border-l-4 border-accent bg-muted/30 px-5 py-4 text-muted-foreground [&_p]:mb-0 [&_p+p]:mt-3'
      )}
      {...props}>
      {children}
    </blockquote>
  ),
  hr: (props: React.ComponentPropsWithoutRef<'hr'>) => (
    <hr className={cn(MDX_SPACE.rule, 'border-0 border-t border-border/70')} {...props} />
  ),
  table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
    <div
      className={cn(
        MDX_SPACE.block,
        'overflow-x-auto rounded-xl border border-border bg-card/40'
      )}>
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
    <th
      className="border-b border-r border-border/60 bg-muted/40 px-4 py-3 text-left font-semibold text-foreground last:border-r-0"
      {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
    <td
      className="border-b border-r border-border/60 px-4 py-3 text-muted-foreground last:border-r-0"
      {...props}>
      {children}
    </td>
  ),
  a: ({ children, href, ...props }: React.ComponentPropsWithoutRef<'a'>) => (
    <MdxLink
      href={href}
      className="font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-foreground"
      showExternalIcon
      {...props}>
      {children}
    </MdxLink>
  ),
  img: MdxImage,
  Figure,
};
