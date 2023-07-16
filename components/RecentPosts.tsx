'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import readingTime from 'reading-time';
import { LuCalendarDays, LuTimer } from 'react-icons/lu';
import Link from 'next/link';
import { Badge } from '~/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Post } from '~/.contentlayer/generated';

interface RecentPostsProps {
	posts: Post[];
}

export default function RecentsPosts({ posts }: RecentPostsProps) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const recentPosts = posts
		// .filter((post) => !post.featured) // Filter out featured posts
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date in descending order
		.slice(0, 3); // Get the top 3 recent posts

	return (
		<>
			<div className='mt-10 mb-6'>
				<div className='flex w-full items-end space-x-4'>
					<div className='flex items-end font-bold'>
						<div className='text-4xl font-black'>Recent</div>
						<div className='text-primary text-6xl flex-grow-0 font-black'>.</div>
					</div>
					<Separator className='shrink h-[3px] mb-4' />
				</div>
			</div>
			<div className='flex flex-col space-y-4'>
				{recentPosts.map((post) => (
					<Link href={post.slug} key={post.slug}>
						<Card>
							<CardHeader>
								<CardTitle>{post.title}</CardTitle>
								<CardDescription>
									{isClient && (
										<div className='w-full flex items-center py-1 flex-wrap gap-2'>
											{post.tags.split(',').map((tag, j) => (
												<Badge
													key={j}
													variant={'outline'}
													className='text-muted-foreground max-w-min'>
													{tag}
												</Badge>
											))}
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
							<CardContent className='-mt-4'>{post.description}</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</>
	);
}
