'use client';

import React from 'react';
import { Separator } from '~/components/ui/separator';
import { Post } from '~/.contentlayer/generated';
import PostCard from './PostCard';

interface RecentPostsProps {
	posts: Post[];
}

export default function RecentsPosts({ posts }: RecentPostsProps) {
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
				{recentPosts.map((post, i) => (
					<PostCard post={post} key={i} />
				))}
			</div>
		</>
	);
}
