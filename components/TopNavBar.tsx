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
		{ name: 'Home', href: '/' },
		{ name: 'Posts', href: '/posts' },
		{ name: 'Publications', href: '/publications' },
		{ name: 'Projects', href: '/projects' },
		{ name: 'About', href: '/about' }
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
			<link
				rel='stylesheet'
				href='https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css'
				integrity='sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC'
				crossOrigin='anonymous'
			/>
			<motion.nav
				className={`fixed flex justify-center top-0 left-0 w-full ${
					isScrolled ? 'py-2' : 'py-6'
				} transition-all duration-300 ease-in-out`}
				initial={{
					y: -100,
					opacity: 0
				}}
				animate={{
					y: 0,
					opacity: 1
				}}>
				<ul
					className={`flex justify-between items-center w-full md:w-1/2 mx-4 space-x-8 text-[0.9rem] font-medium rounded-full px-8 shadow-black/[0.03] backdrop-blur-[0.5rem] py-2
				${!isScrolled ? 'border' : ''}
				`}>
					<div className='flex'>
						<Link href='/'>
							<span className={`font-bold`}>
								<span className={`${fireCode.className}`}>&lt;</span>
								<span className={`${fireCode.className}`}>dev-sr</span>
								<span className='text-primary font-sans'>/</span>
								<span className={`${fireCode.className}`}>&gt;</span>
							</span>
						</Link>
					</div>
					{/* Desktop */}
					<div className='hidden md:flex space-x-2 h-full items-center'>
						{navigation.main.map((nav, i) => (
							<Link
								href={nav.href}
								key={i}
								className='relative flex items-center h-full px-3 group'>
								<span
									className={cn(
										'text-foreground/70 group-hover:text-foreground marker:hover:border',
										nav.href === path && 'text-foreground '
									)}>
									{nav.name}
								</span>
								{/* animate tab switch with motion layoutId */}
								{nav.href === path ? (
									<motion.span
										className='bg-secondary rounded-full absolute inset-0 -z-10'
										layoutId='underline'
										transition={{
											type: 'spring',
											stiffness: 380,
											damping: 30
										}}></motion.span>
								) : (
									<span className='border-0 group-hover:border-2 rounded-full absolute inset-0 -z-10 transition-all duration-100'></span>
								)}
							</Link>
						))}
					</div>
					{/* Mobile Menu */}

					<div className='flex space-x-2 items-center text-foreground/70'>
						<div className='border-0 hover:border-2 transition-all duration-100 rounded-md h-8 w-8 flex items-center justify-center'>
							<SearchIcon className='w-5 h-5 ' />
						</div>
						<ModeToggle />
					</div>
				</ul>
			</motion.nav>
		</header>
	);
};

export default TopNavBar;
