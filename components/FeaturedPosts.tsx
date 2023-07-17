'use client';
import React from 'react';
import { Separator } from '~/components/ui/separator';
import { Post } from '~/.contentlayer/generated';
import PostCard from './PostCard';

interface FeaturedPostsProps {
	posts: Post[]; // Replace 'any' with the actual type of 'allPosts' if possible
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
	return (
		<>
			<div className='mt-20 mb-6'>
				<div className='flex w-full items-end space-x-4'>
					<div className='flex items-end font-bold'>
						<div className='text-4xl font-black'>Featured</div>
						<div className='text-primary text-6xl flex-grow-0 font-black'>.</div>
					</div>
					<Separator className='shrink h-[3px] mb-4' />
				</div>
			</div>
			<div className='flex flex-col space-y-4'>
				{posts.map((post, i) => {
					if (post.featured) return <PostCard post={post} key={i} />;
				})}
			</div>
		</>
	);
}
