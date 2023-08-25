'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { SearchIcon } from 'lucide-react';
import { Fira_Code } from 'next/font/google';
const fireCode = Fira_Code({ subsets: ['latin'] });
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';
const navigation = {
	main: [
		{ name: 'Home', href: '/', active: true },
		{ name: 'Posts', href: '/posts', active: false },
		{ name: 'Publications', href: '/publications', active: false },
		{ name: 'Projects', href: '/projects', active: false },
		{ name: 'About', href: '/about', active: false }
	]
};
interface Props {}

const TopNavBar: React.FC<Props> = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;

			setIsScrolled(scrollPosition > 50);
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const path = usePathname();

	return (
		<header className='z-50 relative'>
			<motion.div
				className={`fixed grid grid-cols-12 w-full shadow-black/[0.03] backdrop-blur-[0.5rem]  ${
					isScrolled ? 'top-0' : 'top-10'
				} transition-all duration-300 ease-in-out`}
				initial={{
					y: -100,
					opacity: 0
				}}
				animate={{
					y: 0,
					opacity: 1
				}}>
				<link
					rel='stylesheet'
					href='https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css'
					integrity='sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC'
					crossOrigin='anonymous'
				/>
				<div className='col-span-1 sm:col-span-1 md:col-span-2 bg-transparent'></div>
				<nav className='col-span-10 sm:col-span-10 md:col-span-8 flex justify-between items-center bg-card border px-4 rounded-md h-16 text-lg'>
					<div className='flex'>
						<Link href='/'>
							<span className={`text-xl font-bold`}>
								<span className={`${fireCode.className}`}>&lt;</span>
								<span className={`${fireCode.className}`}>dev-sr</span>
								<span className='text-primary font-sans'>/</span>
								<span className={`${fireCode.className}`}>&gt;</span>
							</span>
						</Link>
					</div>
					<div className='hidden md:flex space-x-8 h-full items-center'>
						{navigation.main.map((nav, i) => (
							<Link href={nav.href} key={i} className=' relative flex items-center h-full'>
								{nav.href === path && (
									<motion.span
										className='absolute bottom-0 left-0 block h-[2px] w-full bg-primary rounded-full '
										layoutId='underline'
									/>
								)}
								<span className={cn('text-foreground/70', nav.href === path && ' text-foreground')}>
									{nav.name}
								</span>
							</Link>
						))}
					</div>
					<div className='flex space-x-2 items-center text-foreground/70'>
						<div className='hover:border rounded-md h-8 w-8 flex items-center justify-center'>
							<SearchIcon className='w-5 h-5 ' />
						</div>
						<ModeToggle />
					</div>
				</nav>
				<div className='col-span-1 sm:col-span-1 md:col-span-2 bg-transparent'></div>
			</motion.div>
		</header>
	);
};

export default TopNavBar;
