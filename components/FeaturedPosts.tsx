'use client';
import React from 'react';
import { Post } from '~/.contentlayer/generated';
import PostCard from './PostCard';
import SectionHeader from './SectionHeader';

interface FeaturedPostsProps {
	posts: Post[]; // Replace 'any' with the actual type of 'allPosts' if possible
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
	const recentPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	// Sort by date in descending
	return (
		<>
			<SectionHeader label='Featured' />
			<div className='flex flex-col space-y-4'>
				{recentPosts.map((post, i) => {
					if (post.featured) return <PostCard post={post} key={i} />;
				})}
			</div>
		</>
	);
}
