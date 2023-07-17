'use client';

import { motion, Variants, Transition } from 'framer-motion';
import React, { ReactNode, useEffect, useState } from 'react';
import { SkeletonDemo } from './loading-screen';

interface PageWrapperProps {
	children: ReactNode;
}

const pageVariants: Variants = {
	initial: { opacity: 0, y: '200' },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: '-200' } // Adjust the exit animation to move upwards
};

const pageTransition: Transition = {
	type: 'tween',
	ease: 'easeInOut', // Use a custom easing function (e.g., easeInOut, easeInOutBack, etc.)
	duration: 0.3 // Adjust the transition duration as needed
};

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient ? (
		<motion.div
			initial='initial'
			animate='animate'
			exit='exit'
			variants={pageVariants}
			transition={pageTransition}>
			{children}
		</motion.div>
	) : (
		<div className='grid grid-cols-12 w-full mt-32'>
			<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
			<div className='col-span-10 sm:col-span-10 md:col-span-8'>
				<SkeletonDemo />
			</div>
			<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
		</div>
	);
};

export default PageWrapper;
