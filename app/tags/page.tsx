import { allPosts, Post } from 'contentlayer/generated';
import Link from 'next/link';
import Footer from '~/components/Footer';
import PageWrapper from '~/components/page-wrapper';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';

async function getTagFromParams() {
	const allTags = allPosts.flatMap((post) => post.tags.split(','));
	const uniqueTags = Array.from(new Set(allTags));

	if (uniqueTags.length === 0) {
		return null;
	}

	return uniqueTags;
}

export default async function TagPage() {
	const tags = await getTagFromParams();
	console.log(tags);

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
					<div className='flex gap-4'>
						{tags?.map((tag, j) => (
							<Link key={j} href={`/tags/${tag}`}>
								<Badge
									variant={'outline'}
									className='text-foreground/80 hover:text-foreground max-w-min uppercase'>
									{tag}
								</Badge>
							</Link>
						))}
					</div>
				</div>
				<div className='col-span-1 sm:col-span-1 md:col-span-3 px-4'></div>
			</article>
			<Footer />
		</PageWrapper>
	);
}
