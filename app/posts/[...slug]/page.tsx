import { notFound } from 'next/navigation';
import { allPosts } from 'contentlayer/generated';
import { format } from 'date-fns';
import readingTime from 'reading-time';
import { Metadata } from 'next';
import { Mdx } from '~/components/mdx-components';
import TableOfContents from '~/components/TableOfContents';
import VerticalIndicator from '~/components/VerticalIndicatorProps';
import { IoIosArrowRoundBack } from 'react-icons/io';
import Link from 'next/link';
import { Separator } from '~/components/ui/separator';
import LikeButton from '~/components/ui/like-button';
import BackToTopButton from '~/components/ui/back-to-top-button';
import { LuTimer, LuCalendarDays } from 'react-icons/lu';
import Footer from '~/components/Footer';
import PageWrapper from '~/components/page-wrapper';

interface PostProps {
	params: {
		slug: string[];
	};
}

async function getPostFromParams(params: PostProps['params']) {
	const slug = params?.slug?.join('/');
	const post = allPosts.find((post) => post.slugAsParams === slug);

	if (!post) {
		null;
	}

	return post;
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
	const post = await getPostFromParams(params);

	if (!post) {
		return {
			title: 'Not Found',
			description: "The page you're looking for doesn't exist"
		};
	}

	return {
		title: post.title,
		description: post.description,
		alternates: {
			canonical: `/posts/${post.slugAsParams}`
		}
	};
}

export async function generateStaticParams(): Promise<PostProps['params'][]> {
	return allPosts.map((post) => ({
		slug: post.slugAsParams.split('/')
	}));
}

export default async function PostPage({ params }: PostProps) {
	const post = await getPostFromParams(params);

	if (!post) {
		notFound();
	}

	return (
		<PageWrapper>
			<article className='grid grid-cols-12 w-full mt-60'>
				<div className='col-span-1 sm:col-span-1 md:col-span-3  flex justify-end pr-10 '>
					<VerticalIndicator />
				</div>
				<div className='col-span-10 sm:col-span-10 md:col-span-6 flex flex-col space-y-4'>
					<Link
						href='/'
						className='flex space-x-2 items-center text-sky-500 hover:dark:text-sky-400 transition ease-in-out hover:translate-x-1 hover:scale-110  duration-300 max-w-min'>
						<IoIosArrowRoundBack className='h-6 w-6' />
						<div className='text-sm'>Home</div>
					</Link>
					<h1 className='text-5xl font-bold '>{post.title}</h1>
					<p className='text-xs text-sky-500 dark:text-sky-400 flex space-x-2 items-center'>
						<span className='flex items-center space-x-2'>
							<LuCalendarDays className='h-4 w-4' />
							<span>{format(new Date(post.date), 'PPP')}</span>
						</span>
						<span> / </span>
						<span className='flex items-center space-x-2'>
							<LuTimer className='h-4 w-4' />
							<span>{readingTime(post.body.raw).text}</span>
						</span>
					</p>
					<Mdx code={post.body.code} />
				</div>

				<div className='col-span-1 sm:col-span-1 md:col-span-3 px-4'>
					<div className='hidden xl:flex flex-col space-y-4 sticky top-20 right-6 overflow-y-auto pb-6 max-h-screen'>
						<TableOfContents />
						<Separator className='shrink w-full' />
						<div className=' flex justify-between w-full items-center'>
							<LikeButton initialCount={100} />
							<BackToTopButton />
						</div>
					</div>
				</div>
			</article>
			<Footer />
		</PageWrapper>
	);
}
