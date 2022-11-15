import { FrontMatterMeta } from '@libs/type-defs';
import Link from 'next/link';
import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { format } from 'date-fns';

type BlogPostHeroSectionProps = {
	frontMatter: FrontMatterMeta;
	readingTime: string;
};

const BlogPostHeroSection = ({ frontMatter, readingTime }: BlogPostHeroSectionProps) => {
	return (
		<div className='px-6 md:px-80'>
			<div className='h-28'></div>
			<div className='group'>
				<Link href={'/'}>
					<div
						className='flex item-center space-x-2 text-gray-800 dark:text-gray-200
						transition duration-300 ease-in-out transform cursor-pointer
						 group-hover:text-indigo-500
						'>
						<div className='flex items-center justify-center group-hover:-translate-x-px'>
							<BiArrowBack className='h-4 w-4 ' />
						</div>
						<div className='flex-shrink-0'>
							<p className='text-center'>Home</p>
						</div>
					</div>
				</Link>
			</div>
			<div>
				<div className='w-full py-6'>
					<h1 className='text-4xl text-gray-800 dark:text-[#e8e8fd] font-semibold leading-relaxed'>
						{frontMatter.title}
					</h1>
				</div>
			</div>
			<div className='mb-10'>
				<span>
					<span className=' dark:text-gray-400 text-sm'>
						{format(new Date(frontMatter.date), 'PPP')} / {readingTime} /{' '}
					</span>
					<span className=' dark:text-[#5686f5] text-sm'>18 Likes • 2 Replies • 15 Mentions</span>
				</span>
			</div>
		</div>
	);
};

export default BlogPostHeroSection;
