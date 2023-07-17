import { allPosts } from 'contentlayer/generated';
import { Metadata } from 'next';
import Footer from '~/components/Footer';
import PageWrapper from '~/components/page-wrapper';
import PostCard from '~/components/PostCard';
import { Separator } from '~/components/ui/separator';

interface BlogPostParam {
	params: {
		slug: string[];
	};
}

async function getBlogPostFromParams(params: BlogPostParam['params']) {
	const slug = params?.slug?.join('/');
	const post = allPosts.find((post) => post.slugAsParams === slug);

	if (!post) {
		null;
	}

	return post;
}

export async function generateMetadata({ params }: BlogPostParam): Promise<Metadata> {
	const post = await getBlogPostFromParams(params);

	if (!post) {
		return {};
	}

	return {
		title: post.title,
		description: post.description
	};
}

export async function generateStaticParams(): Promise<BlogPostParam['params'][]> {
	return allPosts.map((post) => ({
		slug: post.slugAsParams.split('/')
	}));
}

export default async function BlogPostPage() {
	return (
		<PageWrapper>
			<div className='grid grid-cols-12 w-full mt-32'>
				<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
				<div className='col-span-10 sm:col-span-10 md:col-span-8'>
					<div className='flex w-full items-end space-x-4'>
						<div className='flex items-end font-bold flex-shrink-0'>
							<div className='text-4xl font-black flex-shrink-0'>All Posts</div>
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
						{allPosts.map((post, i) => (
							<PostCard post={post} key={i} />
						))}
					</div>
				</div>
				<div className='col-span-1 sm:col-span-1 md:col-span-3 px-4'></div>
			</article>
			<Footer />
		</PageWrapper>
	);
}
