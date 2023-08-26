'use client';

import React from 'react';
import { motion } from 'framer-motion';
export const skillsData = [
	'Python',
	'JavaScript',
	'TypeScript',
	'Java/Kotlin',
	'C/C++',
	'PostgreSQL',
	'NumPy',
	'pandas',
	'scikit‑learn',
	'PyTorch',
	'TensorFlow',
	'matplotlib',
	'seaborn',
	'plotly.py',
	'Weights & Biases',
	'Keras',
	'transformers',
	'sentence‑transformers',
	'NLTK',
	'spaCy',
	'gensim',
	'React.js',
	'Next.js',
	'Nest.js',
	'Node.js|Express',
	'Git',
	'Tailwind',
	'Prisma',
	'Redux-Toolkit',
	'Framer Motion',
	'React-Query'
] as const;

const fadeInAnimationVariants = {
	initial: {
		opacity: 0,
		y: 100
	},
	animate: (index: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: 0.05 * index
		}
	})
};

export default function Skills() {
	return (
		<section id='skills' className='mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40'>
			<ul className='grid grid-cols-4 md:grid-cols-5 gap-4'>
				{skillsData.map((skill, index) => (
					<motion.li
						key={index}
						variants={fadeInAnimationVariants}
						initial='initial'
						whileInView='animate'
						viewport={{
							once: true
						}}
						custom={index}>
						<div className=' text-sm inline-flex items-center rounded-full border px-2.5 py-0.5  font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'>
							{skill}
						</div>
					</motion.li>
				))}
			</ul>
		</section>
	);
}
