'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { BsFacebook, BsGithub, BsLinkedin } from 'react-icons/bs';

import Link from 'next/link';
import Matrix from './Showcase';
import { motion } from 'framer-motion';

const Avatar = () => {
	return (
		// <div className='w-[110px] h-[110px] md:h-[140px] md:w-[140px] flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500/50'>
		<div className='w-[100px] h-[100px] md:h-[130px] md:w-[130px] flex items-center justify-center rounded-full bg-foreground'>
			<div className='h-[90px] w-[90px] md:h-[120px] md:w-[120px] rounded-full  relative'>
				<Image src='/191902061.jpg' alt='My Image' fill className='rounded-full' />
			</div>
		</div>
		// </div>
	);
};

const Hero = () => {
	return (
		<>
			<motion.div
				className='w-full relative flex flex-col space-y-4 md:space-y-6'
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
				exit={{ opacity: 0, x: 20 }}>
				<div className='flex space-x-4 md:space-x-6 items-center md:mt-6 z-10'>
					<div className=''>
						<Avatar />
					</div>
					<div className='h-full flex justify-center w-full flex-col z-10'>
						<div className='flex'>
							<div className='text-4xl md:text-6xl font-black'>Sharukh</div>
							<div className='text-4xl md:text-6xl text-primary font-black'>.</div>
						</div>
						<div className='flex space-x-2'>
							<div className='text-primary text-2xl  md:text-3xl font-black'>ML Engineer</div>
							<div className='text-foreground/70 text-2xl md:text-3xl font-light'>at X</div>
						</div>
					</div>
				</div>
				<div className='md:text-lg z-10 text-justify hyphens-auto'>
					<span className='text-foreground/70'>Greetings!</span>
					<span className='animate-wiggle inline-flex text-foreground mx-[.5px]'>👋🏼</span>
					<span className='text-foreground/70'>
						As a{' '}
						<span className='font-bold text-foreground/80'>Natural Language Processing(NLP)</span>{' '}
						enthusiast with a solid foundation in Computer Science and Engineering, I am interested
						in making Large Language Models (LLMs) more{' '}
						<span className='font-bold text-foreground/80'>dynamic</span> through{' '}
						<span className='font-bold text-foreground/80'>Lifelong Continual Learning</span>. I
						also want to enable LLMs to be{' '}
						<span className='font-bold text-foreground/80'>
							Interpretable, Editable, and Modular Knowledge Learners
						</span>
						. My past research involved Text Mining Techniques to develop strategies for research
						article recommendations that facilitate chronological learning, published in the{' '}
						<a
							href='https://doi.org/10.1109/STI56238.2022.10103286'
							target='_blank'
							className='underline'>
							IEEE STI 2022 Conference
						</a>
						. Currently, I am working on a novel Topic Modeling strategy that combines Graphs and
						Transformers to identify researchers&apos; expertise.
					</span>
				</div>
				<div className='flex space-x-4 z-10 '>
					<Button>Contact Me</Button>
					{/* <Button variant={'outline'}>My Resume</Button> */}
					<div className='border rounded-md border-border flex items-center space-x-4 px-4 bg-card'>
						<Link href='https://github.com/dev-SR' target='_blank'>
							<BsGithub className='w-5 h-5 text-foreground/70 hover:text-foreground' />
						</Link>
						<Link href='https://www.linkedin.com/in/sharukh-rahman/' target='_blank'>
							<BsLinkedin className='w-5 h-5 text-foreground/70 hover:text-foreground' />
						</Link>
						<Link href='https://www.facebook.com/soikat.x/' target='_blank'>
							<BsFacebook className='w-5 h-5 text-foreground/70 hover:text-foreground' />
						</Link>
					</div>
				</div>
				<div className='absolute top-0 hidden md:block md:right-0'>
					<Matrix />
				</div>
			</motion.div>
		</>
	);
};

export default Hero;
