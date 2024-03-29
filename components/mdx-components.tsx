'use client';
import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { cn } from '~/lib/utils';
import { Fira_Code } from 'next/font/google';

import { useMDXComponent } from 'next-contentlayer/hooks';
import { CopyButton } from './copy-button';
import React from 'react';
import { Card } from './ui/card';
const fireCode = Fira_Code({ subsets: ['latin'] });
// Define your custom MDX components.
const mdxComponents: MDXComponents = {
	// Override the default <a> element to use the next/link component.
	a: ({ href, children }) => (
		<Link href={href as string} className='text-primary hover:underline text-base leading-7'>
			{children}
		</Link>
	),
	p: ({ children }) => <p className='py-1 text-foreground/70 text-base leading-7'>{children}</p>,
	strong: ({ children }) => (
		<strong className='font-medium text-foreground/90 text-base leading-7'>{children}</strong>
	),
	em: ({ children }) => (
		<em className='italic text-foreground/90 text-base leading-7'>{children}</em>
	),
	span: ({ children, ...props }) => (
		<span className='text-foreground/90 text-base leading-7' {...props}>
			{children}
		</span>
	),
	h1: ({ children }) => (
		<h1
			className='text-foreground/90 text-4xl  py-1 font-semibold'
			id={children?.toString().toLowerCase().replace(/\s/g, '-')}>
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2
			className='text-foreground/90 text-3xl  py-1 font-semibold'
			id={children?.toString().toLowerCase().replace(/\s/g, '-')}>
			{children}
		</h2>
	),
	h3: ({ children }) => (
		<h3
			className='text-foreground/90 text-2xl  py-1 font-semibold'
			id={children?.toString().toLowerCase().replace(/\s/g, '-')}>
			{children}
		</h3>
	),
	h4: ({ children }) => (
		<h4
			className='text-foreground/90 text-xl  py-1 font-semibold'
			id={children?.toString().toLowerCase().replace(/\s/g, '-')}>
			{children}
		</h4>
	),
	ol: ({ children }) => (
		<ol className='text-base leading-7 text-justify hyphens-auto text-foreground/70 list-decimal pl-8 pr-4'>
			{children}
		</ol>
	),
	ul: ({ children }) => (
		<ul className='text-base leading-7 text-justify hyphens-auto text-foreground/70 list-disc px-4'>
			{children}
		</ul>
	),
	li: ({ children }) => (
		<li className='text-base text-justify hyphens-auto leading-7 text-foreground/70'>{children}</li>
	),
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className='text-base text-foreground/70 my-6 w-full overflow-y-auto'>
			<table className={cn('w-full', className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr className={cn('m-0 border-t p-0 even:bg-background', className)} {...props} />
	),
	th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
		<th
			className={cn(
				'font-bold text-foreground bg-background border border-border border-opacity-20 px-4 py-2 text-left  [&[align=center]]:text-center [&[align=right]]:text-right',
				className
			)}
			{...props}
		/>
	),
	td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
		<td
			className={cn(
				'border border-border border-opacity-20 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
				className
			)}
			{...props}
		/>
	),
	pre: ({
		className,
		__rawString__,
		...props
	}: React.HTMLAttributes<HTMLPreElement> & {
		__rawString__?: string;
		__src__?: string;
	}) => {
		// console.log(__rawString__);

		return (
			<>
				<pre className={cn('overflow-x-auto py-2 ', className)} {...props} />
				{__rawString__ && (
					<div id='copy-button'>
						<CopyButton value={__rawString__} />
					</div>
				)}
			</>
		);
	},
	code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
		const hasOnlyTextNode = isOnlyTextNode(children);

		return (
			<code
				{...props}
				className={cn(
					`${fireCode.className}`,
					hasOnlyTextNode &&
						'border bg-card text-secondary-foreground inline-flex items-center text-sm px-1 rounded-md'
				)}>
				{children}
			</code>
		);
	},
	blockquote: ({ children, ...props }) => (
		<blockquote
			className='border-l-4 border-primary/50 pl-4 py-2 my-4 text-base bg-card italic ml-8'
			{...props}>
			{children}
		</blockquote>
	),
	// Add a custom component.

	MdxImage: ({ src, width, height, caption, fig_no }: MdxImageProps) => {
		return (
			<div className='flex flex-col w-full items-center justify-center py-8'>
				<Image src={src} loading='lazy' alt={src.replace('.', '')} width={width} height={height} />
				{caption && (
					<Card className='mt-2 text-center my-2 p-2 text-sm italic text-foreground/70 w-full md:w-3/4 bg-transparent'>
						<span className=''>Figure {fig_no} : </span>
						{caption}
					</Card>
				)}
			</div>
		);
	}
};
type MdxImageProps = {
	src: string;
	width: number;
	height: number;
	caption?: string; // New prop for caption
	fig_no?: number;
};
const isTextNode = (node: React.ReactNode): boolean => {
	return typeof node === 'string' || typeof node === 'number';
};

const isOnlyTextNode = (children: React.ReactNode): boolean => {
	return React.Children.count(children) === 1 && isTextNode(children);
};
export interface MdxProps {
	code: string;
}

export function Mdx({ code }: MdxProps) {
	const Component = useMDXComponent(code);

	return <Component re components={mdxComponents} />;
}

<code>
	<span>
		<span>nested code</span>
	</span>
</code>;
