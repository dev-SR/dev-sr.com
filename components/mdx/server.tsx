import Link from 'next/link';
import type React from 'react';
import { ExternalLink } from 'lucide-react';
import { Figure, MdxImage, Paragraph } from './figure';

export const mdxServerComponents = {
  h1: ({ children, ...props }: React.ComponentPropsWithoutRef<'h1'>) => (
    <h1
      className="mb-7 mt-16 scroll-mt-24 text-4xl font-bold leading-tight text-foreground sm:text-5xl"
      {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className="mb-5 mt-14 scroll-mt-24 border-b border-white/10 pb-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
      {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3
      className="mb-4 mt-10 scroll-mt-24 text-2xl font-semibold leading-snug text-foreground sm:text-3xl"
      {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.ComponentPropsWithoutRef<'h4'>) => (
    <h4
      className="mb-3 mt-8 scroll-mt-24 text-xl font-semibold leading-snug text-foreground"
      {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: React.ComponentPropsWithoutRef<'h5'>) => (
    <h5
      className="mb-3 mt-6 scroll-mt-24 text-lg font-semibold leading-snug text-foreground"
      {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: React.ComponentPropsWithoutRef<'h6'>) => (
    <h6
      className="mb-2 mt-5 scroll-mt-24 text-base font-semibold uppercase tracking-wide text-muted-foreground"
      {...props}>
      {children}
    </h6>
  ),
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
    <hr className="my-12 border-0 border-t border-white/10" {...props} />
  ),
  table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="my-8 overflow-x-auto rounded-lg border border-white/10 bg-card/35">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
    <th
      className="border-b border-r border-white/10 bg-muted/40 px-4 py-3 text-left font-semibold text-foreground last:border-r-0"
      {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
    <td
      className="border-b border-r border-white/10 px-4 py-3 text-muted-foreground last:border-r-0"
      {...props}>
      {children}
    </td>
  ),
  a: ({ children, href, ...props }: React.ComponentPropsWithoutRef<'a'>) => {
    const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);
    return (
      <Link
        href={href ?? '#'}
        className="inline-flex items-center gap-1 text-[#ACC5D3] underline decoration-[#ACC5D3]/35 underline-offset-4 transition-colors hover:text-[#F08F87] hover:decoration-[#F08F87]/60"
        {...(props as Omit<React.ComponentProps<typeof Link>, 'href'>)}>
        {children}
        {isExternal && <ExternalLink className="size-3" />}
      </Link>
    );
  },
  img: MdxImage,
  Figure,
};
