'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';
import { CodeCustom } from './code-elements';
import { MdxLink } from './mdx-link';
import { Mark, Sidenote } from './mark';
import { cn } from '@/lib/utils';

const excerptComponents = {
  /** Flatten so the outer excerpt wrapper owns typography — no nested `<p>` / block margins. */
  p: ({ children }: { children?: ReactNode }) => <>{children}</>,
  code: CodeCustom,
  a: ({ children, href, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <MdxLink href={href} className="text-[#ACC5D3] underline decoration-[#ACC5D3]/35 underline-offset-4" {...props}>
      {children}
    </MdxLink>
  ),
  Mark,
  Sidenote,
};

export function MdxExcerpt({
  mdxSource,
  className,
}: {
  mdxSource: MDXRemoteSerializeResult;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <MDXRemote {...mdxSource} components={excerptComponents} />
    </div>
  );
}
