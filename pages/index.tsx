import { GetStaticProps } from 'next/types';
import { getMdxPath, getPostFiles } from '../libs/mdxLibs';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { format } from 'date-fns';
import Link from 'next/link';
import NavBar from '../components/NavBar';
import { classNames } from '../libs/classNames';

type PostsType = {
	title: string;
	date: string;
	tags: string[];
	description: string;
	author: string;
	slug: string;
	url: string;
};

export type PostListProps = {
	posts_metadata: PostsType[];
};

const chipsColorClasses: {
	[key: string]: string;
} = {
	1: 'bg-pink-600/50 border-pink-700 dark:border-pink-500',
	2: 'bg-sky-600/50 border-sky-700 dark:border-sky-500',
	3: 'bg-green-600/50 border-green-700 dark:border-green-500',
	4: 'bg-yellow-600/50 border-yellow-700 dark:border-yellow-500',
	5: 'bg-orange-600/50 border-orange-700 dark:border-orange-500',
	6: 'bg-red-600/50 border-red-700 dark:border-red-500'
};

const cardClasses = {
	cardContainer:
		'rounded-md px-4 py-6 transition duration-300 ease-in-out bg-[#16181d]/5 hover:bg-[#16181d]/10 dark:bg-zinc-800/40 hover:dark:bg-zinc-800/80',
	cardBody: 'flex flex-col',
	chips: 'uppercase text-xs px-2 rounded text-white border cursor-pointer'
};

export default function Home({ posts_metadata }: PostListProps) {
	return (
		<div className='dark:bg-[#16181d] flex flex-col min-h-screen overflow-x-hidden'>
			<NavBar posts_metadata={posts_metadata} />
			<div className='h-32'></div>
			<div className='max-w-sm md:max-w-4xl mx-auto my-4'>
				<div className='flex items-center flex-wrap'>
					<h1 className='text-4xl font-bold text-gray-800 dark:text-gray-200'>Hey</h1>
					<h1 className='text-4xl font-bold text-gray-800 dark:text-gray-200 animate-wiggle'>👋🏼</h1>
					<h1 className='text-4xl font-bold text-gray-800 dark:text-gray-200'>,</h1>
					<h1 className='text-4xl font-bold text-gray-800 dark:text-gray-200'>
						I'm Sharukh Rahman
					</h1>
				</div>
				<p className='font-light text-xl my-4 text-gray-800 dark:text-gray-300'>
					I'm a fullstack web engineer, machine learning and deep learning enthusiast. Along the
					way, I like sharing what I learn about web technologies and software related soft skills.
				</p>
			</div>

			<div className='max-w-sm md:max-w-4xl mx-auto my-4 flex  items-center justify-between w-full'>
				<h2 className='text-xl font-bold text-gray-800 dark:text-gray-200'>Recent Posts</h2>
				<Link href={`blog`}>
					<p className='text-md text-gray-800 dark:text-gray-400 underline cursor-pointer hover:text-indigo-400 hover:dark:text-indigo-400'>
						View all
					</p>
				</Link>
			</div>

			<div className='max-w-sm md:max-w-4xl mx-auto my-4 flex flex-col w-full space-y-4'>
				{posts_metadata.map((post) => (
					<div key={post.slug}>
						<div className={cardClasses.cardContainer}>
							<div className={cardClasses.cardBody}>
								<Link href={`blogs/${post.slug}`}>
									<div className=' cursor-pointer '>
										<div className='flex items-center justify-between'>
											<p className='text-sm  font-light pb-2 text-gray-800 dark:text-gray-400'>
												{format(new Date(post.date), 'PPP')}
											</p>
											<p className='text-sm  font-light pb-2 text-gray-800 dark:text-gray-400'>
												1,000 views
											</p>
										</div>
										<h2 className='text-xl font-medium text-gray-800 dark:text-gray-200'>
											{post.title}
										</h2>
										<p className='text-md pb-2 text-gray-800 dark:text-gray-400'>
											{post.description}
										</p>
									</div>
								</Link>
								<div className='flex space-x-2'>
									{post.tags.map((tag, i) => {
										const randomColor = Math.floor(Math.random() * 6) + 1;
										const color = chipsColorClasses[String(randomColor)];
										return (
											<Link href={`tags/${tag}`} key={tag}>
												<p className={classNames(cardClasses.chips, color)}>{tag}</p>
											</Link>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const posts_metadata = getPostFiles
		.map((postFile) => {
			// read all the md files
			const content = fs.readFileSync(path.join(getMdxPath, postFile), 'utf-8');
			// parse the frontmatter
			const { data: postFrontMatterMetaData } = matter(content);
			return {
				...(postFrontMatterMetaData as PostsType),
				slug: postFile.replace('.md', '')
			};
		})
		.sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});
	// console.log(posts_metadata);

	return {
		props: {
			posts_metadata: JSON.parse(JSON.stringify(posts_metadata))
		}
	};
};
