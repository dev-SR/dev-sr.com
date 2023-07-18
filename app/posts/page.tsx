import { allPosts } from 'contentlayer/generated';
import Footer from '~/components/Footer';
import PageWrapper from '~/components/page-wrapper';
import PostCard from '~/components/PostCard';
import TagCard from '~/components/TagCard';
import { Separator } from '~/components/ui/separator';

export const dynamic = 'force-static';

export type Tags = {
	[key: string]: number;
};

const getData = async () => {
	const posts = allPosts;
	const tags: Tags = {};
	allPosts.forEach((post) => {
		post.tags.forEach((tag) => {
			if (!tags[tag]) tags[tag] = 1;
			else tags[tag]++;
		});
	});

	return { posts, tags };
};

export default async function BlogPostPage() {
	const { posts, tags } = await getData();

	return (
		<PageWrapper>
			<div className='grid grid-cols-12 w-full mt-32'>
				<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
				<div className='col-span-10 sm:col-span-10 md:col-span-8'>
					<div className='flex w-full items-end space-x-4'>
						<div className='flex items-end font-bold flex-shrink-0'>
							<div className='text-2xl font-black flex-shrink-0'>All Posts</div>
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
					<div className='flex flex-col space-y-4'>
						{posts.map((post, i) => (
							<PostCard post={post} key={i} />
						))}
					</div>
				</div>
				<div className='col-span-1 sm:col-span-1 md:col-span-3 px-4'>
					<TagCard tags={tags} />
				</div>
			</article>
			<Footer />
		</PageWrapper>
	);
}
