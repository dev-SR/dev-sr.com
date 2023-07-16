import { allPosts } from 'contentlayer/generated';
import { format } from 'date-fns';
import readingTime from 'reading-time';
import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '~/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import PageWrapper from '~/components/page-wrapper';

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
			<article className='grid grid-cols-12 w-full mt-60'>
				<div className='col-span-1 sm:col-span-1 md:col-span-3  flex justify-end pr-10 '></div>
				<div className='col-span-10 sm:col-span-10 md:col-span-6'>
					<div className='flex flex-col space-y-4'>
						{allPosts.map((post, i) => {
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
				<div className='col-span-1 sm:col-span-1 md:col-span-3 px-4'></div>
			</article>
			<Footer />
		</PageWrapper>
	);
}
