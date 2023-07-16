import { allPosts } from '~/.contentlayer/generated';
import FeaturedPosts from '~/components/FeaturedPosts';
import Footer from '~/components/Footer';
import Hero from '~/components/Hero';
import PageWrapper from '~/components/page-wrapper';

export default function Home() {
	return (
		<PageWrapper>
			<div className='grid grid-cols-12 w-full mt-32'>
				<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
				<div className='col-span-10 sm:col-span-10 md:col-span-8'>
					<Hero />
					<FeaturedPosts posts={allPosts} />
				</div>
				<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
			</div>
			<Footer />
		</PageWrapper>
	);
}
