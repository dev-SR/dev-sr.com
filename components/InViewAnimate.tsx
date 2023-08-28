'use client';
import React, { useEffect } from 'react';
import { useAnimation, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
const squareVariants = {
	visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
	hidden: { opacity: 0, scale: 0 }
};

interface InViewAnimateProps {
	children: React.ReactNode;
}

export default function InViewAnimate({ children }: InViewAnimateProps) {
	const controls = useAnimation();
	const [ref, inView] = useInView();
	useEffect(() => {
		if (inView) {
			controls.start('visible');
		}
	}, [controls, inView]);
	return (
		<motion.div ref={ref} animate={controls} initial='hidden' variants={squareVariants}>
			{children}
		</motion.div>
	);
}
