import type React from 'react';
import { Figure, MdxImage, Paragraph } from './figure';
import { createMdxHeadings } from './heading';
import { MdxLink } from './mdx-link';

const headings = createMdxHeadings('blog');

export const mdxServerComponents = {
  ...headings,
  p: Paragraph,
  ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className="mb-7 mt-4 flex list-disc flex-col gap-2.5 pl-7 text-muted-foreground marker:text-[#ACC5D3]/70 [&>li]:leading-8"
      {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className="mb-7 mt-4 flex list-decimal flex-col gap-2.5 pl-7 text-muted-foreground marker:font-mono marker:text-[#F08F87]/80 [&>li]:leading-8"
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
      className="my-8 rounded-r-lg border-l-4 border-[#F08F87] bg-card/45 px-6 py-5 text-muted-foreground shadow-sm [&_p:last-child]:mb-0"
      {...props}>
      {children}
    </blockquote>
  ),
  hr: (props: React.ComponentPropsWithoutRef<'hr'>) => (
    <hr className="my-12 border-0 border-t border-border" {...props} />
  ),
  table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="my-8 overflow-x-auto rounded-lg border border-border bg-card/35">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
    <th
      className="border-b border-r border-border bg-muted/40 px-4 py-3 text-left font-semibold text-foreground last:border-r-0"
      {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
    <td
      className="border-b border-r border-border px-4 py-3 text-muted-foreground last:border-r-0"
      {...props}>
      {children}
    </td>
  ),
  a: ({ children, href, ...props }: React.ComponentPropsWithoutRef<'a'>) => (
    <MdxLink
      href={href}
      className="inline-flex items-center gap-1 text-[#ACC5D3] underline decoration-[#ACC5D3]/35 underline-offset-4 transition-colors hover:text-[#F08F87] hover:decoration-[#F08F87]/60"
      showExternalIcon
      {...props}>
      {children}
    </MdxLink>
  ),
  img: MdxImage,
  Figure,
};
