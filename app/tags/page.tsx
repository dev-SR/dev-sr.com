import { allPosts } from 'contentlayer/generated';
import Footer from '~/components/Footer';
import TagCard from '~/components/TagCard';
import PageWrapper from '~/components/page-wrapper';
import { Separator } from '~/components/ui/separator';
import { Tags } from '../posts/page';
export const dynamic = 'force-static';

const getData = async () => {
	const tags: Tags = {};
	allPosts.forEach((post) => {
		post.tags.forEach((tag) => {
			if (!tags[tag]) tags[tag] = 1;
			else tags[tag]++;
		});
	});

	return { tags };
};

export default async function TagPage() {
	const { tags } = await getData();

	return (
		<PageWrapper>
			<div className='grid grid-cols-12 w-full mt-32'>
				<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
				<div className='col-span-10 sm:col-span-10 md:col-span-8'>
					<div className='flex w-full items-end space-x-4'>
						<div className='flex items-end font-bold flex-shrink-0'>
							<div className='text-4xl font-black flex-shrink-0'>All Tags</div>
							<div className='text-primary text-6xl flex-grow-0 font-black'>.</div>
						</div>
						<Separator className='shrink h-[3px] mb-4' />
					</div>
				</div>
				<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
			</div>
			<article className='grid grid-cols-12 w-full mt-10 '>
				<div className='col-span-1 sm:col-span-1 md:col-span-3  flex justify-end pr-10 '></div>
				<div className='col-span-10 sm:col-span-10 md:col-span-6 min-h-screen'>
					<TagCard tags={tags} />
				</div>
				<div className='col-span-1 sm:col-span-1 md:col-span-3 px-4'></div>
			</article>
			<Footer />
		</PageWrapper>
	);
}
