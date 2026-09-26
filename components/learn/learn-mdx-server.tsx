'use client';

import type React from 'react';
import { Figure, MdxImage, Paragraph } from '@/components/mdx/figure';
import { createMdxHeadings } from '@/components/mdx/heading';
import { MdxLink } from '@/components/mdx/mdx-link';

const headings = createMdxHeadings('learn');

export const learnMdxServerComponents = {
  ...headings,
  p: Paragraph,
  ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mb-6 flex list-disc flex-col gap-2 pl-6 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mb-6 flex list-decimal flex-col gap-2 pl-6 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.ComponentPropsWithoutRef<'li'>) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="my-6 rounded-r-lg border-l-4 border-accent bg-muted/30 px-5 py-4 text-muted-foreground"
      {...props}>
      {children}
    </blockquote>
  ),
  hr: (props: React.ComponentPropsWithoutRef<'hr'>) => (
    <hr className="my-10 border-0 border-t border-border/70" {...props} />
  ),
  table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-border bg-card/40">
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
