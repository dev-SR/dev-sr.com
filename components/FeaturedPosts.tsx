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

interface FeaturedPostsProps {
	posts: Post[]; // Replace 'any' with the actual type of 'allPosts' if possible
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<>
			<div className='mt-20 mb-6'>
				<div className='flex w-full items-end space-x-4'>
					<div className='flex items-end font-bold'>
						<div className='text-4xl font-black'>Featured</div>
						<div className='text-primary text-6xl flex-grow-0 font-black'>.</div>
					</div>
					<Separator className='shrink h-[3px] mb-2' />
				</div>
			</div>
			<div className='flex flex-col space-y-4'>
				{posts.map((post, i) => {
					if (post.featured)
						return (
							<Link href={post.slug} key={i}>
								<Card>
									<CardHeader>
										<CardTitle>{post.title}</CardTitle>

										<CardDescription>
											{isClient && (
												<div className='flex py-1 space-x-2 items-center flex-wrap'>
													{post.tags.split(',').map((tag, j) => (
														<Badge key={j} variant={'outline'} className='text-muted-foreground'>
															{tag}
														</Badge>
													))}
													<p className='text-xs flex space-x-2 items-center'>
														<span className='flex items-center space-x-2'>
															<LuCalendarDays className='h-4 w-4' />
															<span>{format(new Date(post.date), 'PPP')}</span>
														</span>
														<span> / </span>
														<span className='flex items-center space-x-2'>
															<LuTimer className='h-4 w-4' />
															<span>{readingTime(post.body.raw).text}</span>
														</span>
													</p>
												</div>
											)}
										</CardDescription>
									</CardHeader>
									<CardContent className='-mt-4'>{post.description}</CardContent>
								</Card>
							</Link>
						);
				})}
			</div>
		</>
	);
}
