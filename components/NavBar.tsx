import React, { useEffect, useRef, useState } from 'react';
import { useWindowScroll } from 'react-use';
import { motion } from 'framer-motion';
import { BsGithub } from 'react-icons/bs';
import { useDarkMode } from '../libs/useDarkMode';
import Link from 'next/link';
import Modal from './Modal';
import { format } from 'date-fns';
import { classNames } from '../libs/classNames';
import { PostListProps } from '@libs/type-defs';

export const transition = {
	type: 'spring',
	stiffness: 200,
	damping: 10
};
// https://medium.com/next-generation-web/create-a-dark-mode-toggle-micro-interaction-like-a-pro-279305e9c2
export const MoonIcon = ({ className }: { className: string }) => {
	const variants = {
		initial: { scale: 0.6, rotate: 90 },
		animate: { scale: 1, rotate: 0, transition },
		whileTap: { scale: 0.95, rotate: 15 }
	};

	return (
		<motion.svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={2}
			stroke='currentColor'
			className={className}>
			<motion.path
				stroke='currentColor'
				strokeLinecap='round'
				strokeLinejoin='round'
				// animation start state
				initial={{
					// opacity: 0,
					// animate path
					pathLength: 0
				}}
				// animation end state
				animate={{
					// opacity: 1,
					pathLength: 1
				}}
				transition={{
					duration: 0.7,
					ease: 'easeInOut'
				}}
				d='M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z'
			/>
		</motion.svg>
	);
};
// https://medium.com/next-generation-web/create-a-dark-mode-toggle-micro-interaction-like-a-pro-279305e9c2
// https://pavanjadhaw.me/blog/animate-svg-using-framer-motion

export const SunIcon = ({ className }: { className: string }) => {
	const whileTap = { scale: 0.95, rotate: 15 };

	const raysVariants = {
		initial: { rotate: 45 },
		animate: { rotate: 0, transition }
	};

	const coreVariants = {
		initial: { scale: 1.5 },
		animate: { scale: 1, transition }
	};
	return (
		<motion.svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			className={className}>
			<motion.path
				// animation start state
				initial={{
					opacity: 0,
					rotate: -45,
					// animate path
					pathLength: 0
				}}
				// animation end state
				animate={{
					opacity: 1,
					rotate: 0,
					pathLength: 1
				}}
				transition={{
					duration: 1,
					ease: 'easeInOut'
				}}
				stroke='currentColor'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
			/>
		</motion.svg>
	);
};

const SearchIcon = ({ className }: { className: string }) => {
	return (
		<motion.svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			className={className}
			stroke='currentColor'>
			<motion.path
				stroke='currentColor'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				initial={{
					opacity: 0,
					rotate: -45,
					// animate path
					pathLength: 0
				}}
				// animation end state
				animate={{
					opacity: 1,
					rotate: 0,
					pathLength: 1
				}}
				transition={{
					duration: 1,
					ease: 'easeInOut'
				}}
				d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
			/>
		</motion.svg>
	);
};

const ModalContent = ({ posts_metadata }: Partial<PostListProps>) => {
	const [input, setInput] = useState('');
	const [filteredPosts, setFilteredPosts] = useState(posts_metadata);
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		inputRef.current?.focus();
	}, []);
	useEffect(() => {
		if (posts_metadata) {
			const filtered = posts_metadata.filter((post) => {
				return (
					post.title.toLowerCase().includes(input.toLowerCase()) ||
					post.tags.some((tag) => tag.toLowerCase().trim().includes(input.toLowerCase())) ||
					post.description.toLowerCase().includes(input.toLowerCase())
				);
			});
			setFilteredPosts(filtered);
		}
	}, [input, posts_metadata]);

	return (
		<div className='flex flex-col space-y-2 w-full'>
			<input
				type='text'
				className=' rounded-t-2xl  py-2 px-4 w-full focus:outline-none focus:right-0 bg-gray-400 dark:bg-slate-600 dark:text-gray-100'
				placeholder='Search'
				ref={inputRef}
				onChange={(e) => {
					setInput(e.target.value);
					if (e.target.value === '') {
						setFilteredPosts(posts_metadata);
						return;
					}
				}}
			/>

			<div className='p-2 flex flex-col space-y-2'>
				{filteredPosts?.map((post) => {
					return (
						<div
							key={post.slug}
							className='bg-black hover:bg-black/20 rounded-md p-2 cursor-pointer'>
							<Link href={`/blogs/${post.slug}`}>
								<div>
									<h2 className='text-md py-1 text-gray-800 dark:text-gray-200'>{post.title}</h2>
									<span className='text-sm text-gray-800 dark:text-gray-400'>
										{post.description} - {}
									</span>
									<span className='text-xs text-gray-800 dark:text-gray-500'>
										{format(new Date(post.date), 'PPP')}
									</span>
								</div>
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
};
const NavBar = ({ posts_metadata }: Partial<PostListProps>) => {
	const { x, y } = useWindowScroll();
	// const { theme, setTheme } = useTheme();
	const { theme, setTheme } = useDarkMode();
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<>
			<motion.nav
				animate={{
					height: y > 100 ? 60 : 120
				}}
				className={classNames(
					'w-screen fixed top-0 z-10 backdrop-blur dark:bg-dark/5 transition-colors ease-in-out duration-300',
					y > 10 ? 'border-b border-black/10 dark:border-white/10 ' : 'border-b border-white/0'
				)}>
				<div className='max-w-sm md:max-w-4xl mx-auto flex items-center justify-between h-full py-2'>
					<Link href={'/'}>
						<div className='text-3xl font-bold dark:text-gray-200 cursor-pointer'>&#60;/&#62;</div>
					</Link>
					<div className='h-full flex items-center flex-shrink-0 justify-center space-x-4'>
						<div className='relative group'>
							<button
								className='w-11 h-11 relative rounded-md p-2 flex justify-center items-center border  border-transparent hover:border-[2px] group-hover:border-[#5685f4] transition ease-in-out duration-300 group-hover:shadow-[0px_0px_30px_1px_rgb(86,133,244,.5)] bg-dark-light/10  dark:bg-dark-light'
								onClick={() => setIsOpen((prev) => !prev)}>
								{!isOpen && (
									<SearchIcon className='w-8 h-8  dark:text-gray-200 text-gray-700 group-hover:text-[#5685f4]' />
								)}
							</button>
						</div>
						<div className='relative group'>
							<button className='w-11 h-11 relative rounded-md p-2 flex justify-center items-center border  border-transparent hover:border-[2px] group-hover:border-[#5685f4] transition ease-in-out duration-300 group-hover:shadow-[0px_0px_30px_1px_rgb(86,133,244,.5)] bg-dark-light/10  dark:bg-dark-light '>
								<a href='https://github.com/dev-SR' target='_blank' rel='noopener noreferrer'>
									<BsGithub
										className={classNames(
											'w-6 h-6  dark:text-gray-200 text-gray-700 group-hover:text-[#5685f4]'
										)}
									/>
								</a>
							</button>
						</div>

						<div className='relative group'>
							{/* <div className='absolute inset-0 bg-indigo-600 blur opacity-0 group-hover:opacity-100 transition duration-300'></div> */}
							<button
								className={classNames(
									' w-11 h-11 relative rounded-md p-1 flex justify-center items-center border border-transparent hover:border-[2px] group-hover:border-[#5685f4] transition ease-in-out duration-300 group-hover:shadow-[0px_2px_40px_-4px_rgb(86,133,244,.5)] bg-dark-light/10  dark:bg-dark-light '
								)}
								onClick={setTheme}>
								{theme == 'dark' ? (
									<SunIcon className='shrink-0 h-8 w-8 dark:text-gray-200 text-gray-700 group-hover:text-[#5685f4] ' />
								) : (
									<MoonIcon className='shrink-0 h-7 w-7 dark:text-gray-200 text-gray-700 group-hover:text-[#5685f4]' />
								)}
							</button>
						</div>
					</div>
				</div>
			</motion.nav>
			<Modal isOpen={isOpen} setIsOpen={setIsOpen}>
				<ModalContent posts_metadata={posts_metadata} />
			</Modal>
		</>
	);
};

export default NavBar;
