import { GetStaticProps } from 'next/types';

import Layout from '@components/Layout';
import HeroSection from '@components/Home/HeroSection';
import RecentPosts from '@components/Home/RecentPosts';
import { getAllPostFiles, getAllPostsMetadata } from '@libs/mdxLibs';
import { PostListProps } from '@libs/type-defs';

export default function Home({ posts_metadata }: PostListProps) {
	return (
		<Layout posts_metadata={posts_metadata}>
			<div className='px-6 md:px-80'>
				<HeroSection />
				<RecentPosts posts_metadata={posts_metadata} />
			</div>
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const files = getAllPostFiles();
	console.log('files', files);

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
