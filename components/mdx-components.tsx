'use client';
import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import { cn } from '~/lib/utils';

import { useMDXComponent } from 'next-contentlayer/hooks';
import { CopyButton } from './copy-button';
// Define your custom MDX components.
const mdxComponents: MDXComponents = {
	// Override the default <a> element to use the next/link component.
	a: ({ href, children }) => (
		<Link href={href as string} className='text-primary hover:underline'>
			{children}
		</Link>
	),
	p: ({ children }) => <p className='py-1 text-foreground/70'>{children}</p>,
	strong: ({ children }) => <strong className='font-bold text-foreground/100'>{children}</strong>,
	em: ({ children }) => <em className='italic text-foreground/90'>{children}</em>,
	h1: ({ children }) => (
		<h1
			className='text-foreground text-4xl font-bold py-1'
			id={children?.toString().toLowerCase().replace(/\s/g, '-')}>
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2
			className='text-foreground text-3xl font-bold py-1'
			id={children?.toString().toLowerCase().replace(/\s/g, '-')}>
			{children}
		</h2>
	),
	h3: ({ children }) => (
		<h3
			className='text-foreground text-2xl font-bold py-1'
			id={children?.toString().toLowerCase().replace(/\s/g, '-')}>
			{children}
		</h3>
	),
	h4: ({ children }) => (
		<h4
			className='text-foreground text-xl font-bold py-1'
			id={children?.toString().toLowerCase().replace(/\s/g, '-')}>
			{children}
		</h4>
	),
	ol: ({ children }) => <ol className='text-foreground/70 list-decimal px-8 py-2'>{children}</ol>,
	ul: ({ children }) => <ul className='text-foreground/70 list-disc px-8 py-2'>{children}</ul>,
	li: ({ children }) => <li className='text-foreground/70 pb-2'>{children}</li>,
	table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
		<div className='text-foreground/70 my-6 w-full overflow-y-auto'>
			<table className={cn('w-full', className)} {...props} />
		</div>
	),
	tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
		<tr className={cn('m-0 border-t p-0 even:bg-background', className)} {...props} />
	),
	th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
		<th
			className={cn(
				'text-foreground bg-background border border-border border-opacity-20 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
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
				<pre className={cn('overflow-x-auto py-2', className)} {...props} />
				{__rawString__ && (
					<div id='copy-button'>
						<CopyButton value={__rawString__} />
					</div>
				)}
			</>
		);
	},
	code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => <code {...props} />,
	// Add a custom component.
	MyComponent: () => <div>Hello World!</div>,
	img: ({ alt, ...props }: any) => (
		// height and width are part of the props, so they get automatically passed here with {...props}
		<Image {...props} loading='lazy' alt={alt} />
	)
};

export interface MdxProps {
	code: string;
}

export function Mdx({ code }: MdxProps) {
	const Component = useMDXComponent(code);

	return <Component re components={mdxComponents} />;
}
