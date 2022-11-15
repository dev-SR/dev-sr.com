import Link from 'next/link';
import React from 'react';
import { PostListProps } from '../../libs/mdxLibs';
import { format } from 'date-fns';
import { classNames } from '../../libs/classNames';
const cardClasses = {
	cardContainer:
		'rounded-md px-4 py-6 transition duration-300 ease-in-out bg-dark/5 hover:bg-dark/10 dark:bg-dark-medium hover:dark:bg-dark-light',
	cardBody: 'flex flex-col',
	chips: 'uppercase text-xs px-2 rounded text-white border cursor-pointer'
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
const RecentPosts = ({ posts_metadata }: PostListProps) => {
	return (
		<div className='flex flex-col space-y-4 mt-10'>
			<div className='flex items-center justify-between w-full'>
				<h2 className='text-xl font-bold text-gray-800 dark:text-gray-200'>Recent Posts</h2>
				<Link href={`blog`}>
					<p className='text-md text-gray-800 dark:text-gray-400 underline cursor-pointer hover:text-indigo-400 hover:dark:text-indigo-400'>
						View all
					</p>
				</Link>
			</div>

			<div className='flex flex-col w-full space-y-4'>
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
												{/* Warning: Prop `className` did not match. */}
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
};
export default RecentPosts;
