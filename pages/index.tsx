import { GetStaticProps } from 'next/types';

import Layout from '@components/Layout';
import HeroSection from '@components/Home/HeroSection';
import RecentPosts from '@components/Home/RecentPosts';
import { getAllPostsMetadata, PostListProps } from '@libs/mdxLibs';

export default function Home({ posts_metadata }: PostListProps) {
	return (
		<Layout posts_metadata={posts_metadata}>
			<div className='max-w-sm md:max-w-4xl mx-auto my-4'>
				<HeroSection />
				<RecentPosts posts_metadata={posts_metadata} />
			</div>
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const posts_metadata = getAllPostsMetadata()
		.sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		})
		.slice(0, 5);
	return {
		props: {
			posts_metadata: JSON.parse(JSON.stringify(posts_metadata))
		}
	};
};
