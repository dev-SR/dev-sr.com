'use client';

import React from 'react';
import { Separator } from '~/components/ui/separator';
import { Post } from '~/.contentlayer/generated';
import PostCard from './PostCard';
import SectionHeader from './SectionHeader';

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
			<SectionHeader label='Recent' />

			<div className='flex flex-col space-y-4'>
				{recentPosts.map((post, i) => (
					<PostCard post={post} key={i} />
				))}
			</div>
		</>
	);
}
