'use client';

import { Post } from '~/.contentlayer/generated';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import readingTime from 'reading-time';
import { LuCalendarDays, LuTimer } from 'react-icons/lu';
import Link from 'next/link';
import { Badge } from '~/components/ui/badge';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter
} from '~/components/ui/card';
import InViewAnimate from './InViewAnimate';
type PostCardProps = {
	post: Post;
};
const PostCard = ({ post }: PostCardProps) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);
	return (
		<InViewAnimate>
			<Card>
				<Link href={post.slug}>
					<CardHeader>
						<CardTitle className='font-medium text-xl'>{post.title}</CardTitle>
						<CardDescription>
							{isClient && (
								<div className='w-full flex items-center py-1 flex-wrap gap-2'>
									<span className='text-xs flex items-center space-x-2'>
										<LuCalendarDays className='h-4 w-4' />
										<span>{format(new Date(post.date), 'PPP')}</span>
									</span>
									<span> / </span>
									<span className='text-xs flex items-center space-x-2'>
										<LuTimer className='h-4 w-4' />
										<span>{readingTime(post.body.raw).text}</span>
									</span>
								</div>
							)}
						</CardDescription>
					</CardHeader>
					<CardContent className='-mt-4 text-foreground/60 text-justify hyphens-auto'>
						{post.description}
					</CardContent>
				</Link>
				<CardFooter>
					<div className='w-full flex items-center gap-2 -my-4'>
						{post.tags.map((tag, j) => (
							<Link key={j} href={`/tags/${tag}`}>
								<Badge
									variant={'outline'}
									className='text-foreground/80 hover:text-foreground uppercase text-[10px]'>
									{tag}
								</Badge>
							</Link>
						))}
					</div>
				</CardFooter>
			</Card>
		</InViewAnimate>
	);
};

export default PostCard;
