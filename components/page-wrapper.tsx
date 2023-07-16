'use client';

import { motion, Variants, Transition } from 'framer-motion';
import React, { ReactNode } from 'react';

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
	duration: 0.2 // Adjust the transition duration as needed
};

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => (
	<motion.div
		initial='initial'
		animate='animate'
		exit='exit'
		variants={pageVariants}
		transition={pageTransition}>
		{children}
	</motion.div>
);

export default PageWrapper;
