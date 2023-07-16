import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { allPages, allPosts } from 'contentlayer/generated';

import { Mdx } from '~/components/mdx-components';
import { format } from 'date-fns';
import readingTime from 'reading-time';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import Link from 'next/link';
import { Badge } from '~/components/ui/badge';

interface PostProps {
	params: {
		tag: string;
	};
}

async function getPostFromParams(params: PostProps['params']) {
	const tag = params?.tag;
	const posts = allPosts.filter((post) => post.tags.includes(tag));

	if (!posts) {
		null;
	}

	return posts;
}

export async function generateStaticParams(): Promise<PostProps['params'][]> {
	return allPosts.map((post) => ({
		tag: post.slugAsParams
	}));
}

export default async function TagsPage({ params }: PostProps) {
	const posts = await getPostFromParams(params);

	return (
		<article className='grid grid-cols-12 w-full mt-32'>
			<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
			<div className='col-span-10 sm:col-span-10 md:col-span-8'>
				<div className='flex flex-col space-y-4'>
					{posts.map((post, i) => {
						return (
							<Link href={post.slug} key={i}>
								<Card>
									<CardHeader>
										<CardTitle>{post.title}</CardTitle>

										<CardDescription>
											<div className='flex py-1 space-x-2 items-center'>
												{post.tags.split(',').map((tag, j) => (
													<Badge key={j} variant={'outline'} className='text-muted-foreground'>
														{tag}
													</Badge>
												))}
												<p className='text-xs flex space-x-2 items-center'>
													<span> / </span>
													<span>{format(new Date(post.date), 'PPP')}</span>
													<span> / </span>
													<span>{readingTime(post.body.raw).text}</span>
												</p>
											</div>
										</CardDescription>
									</CardHeader>
									<CardContent className='-mt-4'>{post.description}</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>
			</div>
			<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
		</article>
	);
}
