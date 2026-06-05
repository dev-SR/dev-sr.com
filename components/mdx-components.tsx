'use client';

import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { Children, HTMLAttributes, isValidElement, useState } from 'react';
import { MultiFileCodeBlock } from './code-block';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, Copy, ExternalLink } from 'lucide-react';
import PathVisualizer from '@/components/PathVisualizer';

function hasOnlyBlockImageChild(children: React.ReactNode) {
  const meaningfulChildren = Children.toArray(children).filter(
    (child) => typeof child !== 'string' || child.trim().length > 0
  );

  if (meaningfulChildren.length !== 1 || !isValidElement(meaningfulChildren[0])) {
    return false;
  }

  const childType = meaningfulChildren[0].type;
  return childType === 'img' || childType === MdxImage || childType === Figure;
}

function Paragraph({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) {
  if (hasOnlyBlockImageChild(children)) {
    return <>{children}</>;
  }

  return (
    <p className="mb-6 text-[1.03rem] leading-8 text-muted-foreground" {...props}>
      {children}
    </p>
  );
}

function MdxImage({ src, alt, ...props }: React.ComponentPropsWithoutRef<'img'>) {
  const safeSrc = typeof src === 'string' ? src : '/placeholder.svg';
  const altText = alt ?? 'Image';

  return (
    <Figure
      src={safeSrc}
      alt={altText}
      caption={altText}
      width={800}
      height={500}
      {...(props as Partial<FigureProps>)}
    />
  );
}

export const mdxComponents = {
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
  p: Paragraph,
  ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className="mb-7 mt-4 list-disc space-y-2.5 pl-7 text-muted-foreground marker:text-[#ACC5D3]/70 [&>li]:leading-8"
      {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className="mb-7 mt-4 list-decimal space-y-2.5 pl-7 text-muted-foreground marker:font-mono marker:text-[#F08F87]/80 [&>li]:leading-8"
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
  MultiFileCodeBlock,
  PathVisualizer,
  Figure,
  code: CodeCustom,
  pre: PreCustom,
};

export function CodeCustom(props: HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;
  return (
    <code
      className={cn(
        'rounded-md border border-white/10 bg-card px-1.5 py-0.5 font-mono text-[0.9em] text-[#E8EEF2]',
        className
      )}
      {...rest}
    />
  );
}

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1200);
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      className={cn(
        'h-8 gap-1.5 rounded-md border border-white/10 bg-background/55 px-2 text-xs text-muted-foreground backdrop-blur transition-colors hover:bg-background/80 hover:text-foreground',
        className
      )}
      disabled={!text || isCopied}
      onClick={copy}
      aria-label={isCopied ? 'Copied code' : 'Copy code'}>
      {isCopied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
      <span>{isCopied ? 'Copied' : 'Copy'}</span>
    </Button>
  );
}

interface PreProps extends React.HTMLProps<HTMLPreElement> {
  __rawstring__?: string;
  ['data-language']?: string;
}

export function PreCustom(props: PreProps) {
  const {
    children,
    className,
    style,
    __rawstring__ = '',
    ['data-language']: dataLanguage = 'text',
    ...preProps
  } = props;
  const language = String(dataLanguage || 'text').toLowerCase();
  const preStyle: React.CSSProperties = {
    ...style,
    backgroundColor: '#101720',
  };

  return (
    <div className="mdx-code-frame not-prose group my-8 overflow-hidden rounded-lg border border-white/10 bg-[#101720] shadow-xl shadow-black/20">
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-white/10 bg-[#101720] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-2.5 rounded-full bg-[#F08F87]" />
          <span className="flex size-2.5 rounded-full bg-[#ACC5D3]" />
          <span className="flex size-2.5 rounded-full bg-muted-foreground/45" />
          <span className="ml-2 truncate font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {language}
          </span>
        </div>
        <CopyButton text={__rawstring__} />
      </div>
      <pre
        className={cn(
          'm-0 overflow-x-auto border-t border-white/[0.03] bg-[#101720] p-4 text-sm leading-6',
          className
        )}
        {...preProps}
        style={preStyle}>
        {children}
      </pre>
    </div>
  );
}

type FigureSize = 'sm' | 'md' | 'lg' | 'full';
type FigureAlign = 'left' | 'center' | 'right';

export type FigureProps = {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  width?: number;
  height?: number;
  size?: FigureSize;
  align?: FigureAlign;
  maxWidth?: number | string;
  priority?: boolean;
  className?: string;
};

const figureSizeClass: Record<FigureSize, string> = {
  sm: 'max-w-xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  full: 'max-w-none',
};

const figureAlignClass: Record<FigureAlign, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
};

export function Figure({
  src,
  alt,
  caption,
  width = 960,
  height = 600,
  size = 'md',
  align = 'center',
  maxWidth,
  priority = false,
  className,
}: FigureProps) {
  const style = maxWidth
    ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }
    : undefined;

  return (
    <figure
      className={cn('my-10 w-full', figureSizeClass[size], figureAlignClass[align], className)}
      style={style}>
      <div className="overflow-hidden rounded-lg border border-white/10 bg-card/40 shadow-xl shadow-black/20">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(min-width: 1024px) 768px, 100vw"
          className="h-auto w-full object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground/80">Figure.</span> {caption}
        </figcaption>
      )}
    </figure>
  );
}
