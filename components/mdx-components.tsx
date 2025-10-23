'use client';

import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { HTMLAttributes, useState } from 'react';
import { MultiFileCodeBlock } from './code-block';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
export const mdxComponents = {
  // Override default elements
  h1: ({ children, ...props }: React.ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="text-4xl font-bold mb-6 text-foreground scroll-mt-20" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="text-3xl font-semibold mb-4 text-foreground scroll-mt-20" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="text-2xl font-medium mb-3 text-foreground scroll-mt-20" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.ComponentPropsWithoutRef<'h4'>) => (
    <h4 className="text-xl font-medium mb-2 text-foreground scroll-mt-20" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) => (
    <p className="text-base leading-relaxed mb-4 text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mb-4 pl-6 text-muted-foreground list-disc" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mb-4 pl-6 text-muted-foreground list-decimal" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.ComponentPropsWithoutRef<'li'>) => (
    <li className="mb-2" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="border-l-4 border-accent pl-4 italic text-muted-foreground mb-4 bg-muted/30 py-2 rounded-r-md"
      {...props}>
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="overflow-x-auto mb-4">
      <table
        className="w-full border-collapse border border-border rounded-lg overflow-hidden"
        {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
    <th
      className="border border-border px-4 py-2 text-left bg-muted font-semibold text-foreground"
      {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
    <td className="border border-border px-4 py-2 text-muted-foreground" {...props}>
      {children}
    </td>
  ),
  a: ({ children, href, ...props }: React.ComponentPropsWithoutRef<'a'>) => (
    <Link
      href={href ?? '#'}
      className="text-accent hover:text-accent/80 underline underline-offset-2 transition-colors"
      {...(props as Omit<React.ComponentProps<typeof Link>, 'href'>)}>
      {children}
    </Link>
  ),
  img: ({ src, alt, ...props }: React.ComponentPropsWithoutRef<'img'>) => {
    const safeSrc = typeof src === 'string' ? src : '/placeholder.svg';
    const altText = alt ?? 'Image';
    return (
      <Image
        alt={altText}
        src={safeSrc}
        {...props}
        width={800}
        height={500}
        style={{ height: 'auto' }}
      />
    );
  },
  // Custom components
  MultiFileCodeBlock,
  Figure,
  code: CodeCustom,
  pre: PreCustom,
};

export function CodeCustom(props: HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;
  return <code {...rest} />;
}

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 700);
  };

  return (
    <Button
      size="icon"
      className={cn('size-7 !bg-slate-700 !text-white absolute right-1 top-1 shadow-smooth')}
      disabled={isCopied}
      onClick={copy}
      aria-label="Copy">
      <span className="sr-only">Copy</span>
      {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
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
    __rawstring__ = '', // because of "unist-util-visit" this prop is passed
    ['data-language']: dataLanguage = 'Js',
  } = props;

  return (
    <pre className="relative overflow-hidden" {...props}>
      <p className="absolute bottom-0 right-0 capitalize text-xs font-medium bg-slate-700 text-white p-1 rounded-tl-lg">
        {dataLanguage}
      </p>
      <CopyButton text={__rawstring__} />
      {children}
    </pre>
  );
}

type FigureProps = {
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
};

export function Figure({ src, alt, caption, width = 800, height = 500 }: FigureProps) {
  return (
    <figure style={{ textAlign: "center", margin: "2em 0" }}>
      <Image src={src} alt={alt} width={width} height={height} style={{ height: "auto" }} />
      <figcaption style={{ fontSize: "0.9em", color: "#555", marginTop: "0.5em" }}>
        <strong>Figure:</strong> {caption}
      </figcaption>
    </figure>
  );
}
