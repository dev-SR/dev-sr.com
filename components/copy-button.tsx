'use client';

import * as React from 'react';
import { RxCopy, RxCheck } from 'react-icons/rx';

import { cn } from '~/lib/utils';

import { Button } from './ui/button';

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	value: string;
	src?: string;
}

async function copyToClipboard(value: string) {
	navigator.clipboard.writeText(value);
}

export function CopyButton({ value, className, src, ...props }: CopyButtonProps) {
	const [hasCopied, setHasCopied] = React.useState(false);

	React.useEffect(() => {
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	}, [hasCopied]);

	return (
		<Button
			size='icon'
			variant='ghost'
			className={cn(
				'relative z-10 h-7 w-7 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50',
				className
			)}
			onClick={() => {
				copyToClipboard(value);
				setHasCopied(true);
			}}
			{...props}>
			<span className='sr-only'>Copy</span>
			{hasCopied ? <RxCheck className='h-4 w-4' /> : <RxCopy className='h-4 w-4' />}
		</Button>
	);
}
