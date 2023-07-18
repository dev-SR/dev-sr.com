import { allPosts } from '~/.contentlayer/generated';
import AlertMessage from '~/components/AlertMessage';
import FeaturedPosts from '~/components/FeaturedPosts';
import Footer from '~/components/Footer';
import Hero from '~/components/Hero';
import RecentPosts from '~/components/RecentPosts';
import PageWrapper from '~/components/page-wrapper';

export const dynamic = 'force-static';

const getAllPost = async () => {
	const posts = allPosts;
	return posts;
};

export default async function Home() {
	const posts = await getAllPost();
	return (
		<PageWrapper>
			<AlertMessage />
			<div className='grid grid-cols-12 w-full mt-32'>
				<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
				<div className='col-span-10 sm:col-span-10 md:col-span-8'>
					<Hero />
					<FeaturedPosts posts={posts} />
					<RecentPosts posts={posts} />
				</div>
				<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
			</div>
			<Footer />
		</PageWrapper>
	);
}
