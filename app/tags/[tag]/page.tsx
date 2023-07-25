import { allPosts } from 'contentlayer/generated';

import PageWrapper from '~/components/page-wrapper';
import Footer from '~/components/Footer';
import PostCard from '~/components/PostCard';
import { Separator } from '~/components/ui/separator';
import { Tags } from '~/app/posts/page';
import TagCard from '~/components/TagCard';

interface PostProps {
	params: {
		tag: string;
	};
}

async function getPostFromParams(params: PostProps['params']) {
	const tag = params?.tag.replace('%20', ' ');
	const posts = allPosts.filter((post) => post.tags.includes(tag));
	const tags: Tags = {};
	allPosts.forEach((post) => {
		post.tags.forEach((tag) => {
			if (!tags[tag]) tags[tag] = 1;
			else tags[tag]++;
		});
	});
	if (!posts) {
		null;
	}

	return { posts, tags };
}

export async function generateStaticParams(): Promise<PostProps['params'][]> {
	return allPosts.map((post) => ({
		tag: post.slugAsParams
	}));
}

export default async function TagsPage({ params }: PostProps) {
	const { posts, tags } = await getPostFromParams(params);

	return (
		<PageWrapper>
			<div className='grid grid-cols-12 w-full mt-32'>
				<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
				<div className='col-span-10 sm:col-span-10 md:col-span-8'>
					<div className='flex w-full items-end space-x-4'>
						<div className='flex items-end font-bold flex-shrink-0'>
							<div className='text-4xl font-black flex-shrink-0'>
								[{params?.tag.replace('%20', ' ')}]
							</div>
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
						{posts
							.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
							.map((post, i) => (
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
