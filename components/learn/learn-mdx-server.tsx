'use client';

import Link from 'next/link';
import type React from 'react';
import { ExternalLink } from 'lucide-react';
import { Figure, MdxImage, Paragraph } from '@/components/mdx/figure';

export const learnMdxServerComponents = {
  h1: ({ children, ...props }: React.ComponentPropsWithoutRef<'h1'>) => (
    <h1
      className="mb-6 mt-2 scroll-mt-28 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
      {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className="mb-4 mt-12 scroll-mt-28 border-b border-border/60 pb-2 text-2xl font-semibold tracking-tight text-foreground"
      {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3
      className="mb-3 mt-8 scroll-mt-28 text-lg font-semibold tracking-tight text-foreground"
      {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.ComponentPropsWithoutRef<'h4'>) => (
    <h4 className="mb-2 mt-6 scroll-mt-28 text-base font-semibold text-foreground" {...props}>
      {children}
    </h4>
  ),
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
  a: ({ children, href, ...props }: React.ComponentPropsWithoutRef<'a'>) => {
    const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);
    return (
      <Link
        href={href ?? '#'}
        className="font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-foreground"
        {...(props as Omit<React.ComponentProps<typeof Link>, 'href'>)}>
        {children}
        {isExternal && <ExternalLink className="ml-1 inline size-3" />}
      </Link>
    );
  },
  img: MdxImage,
  Figure,
};
