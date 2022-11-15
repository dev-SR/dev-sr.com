import { motion } from 'framer-motion';
import React from 'react';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import { useWindowScroll } from 'react-use';

const PushToTop = () => {
	const { x, y } = useWindowScroll();

	return (
		<div className='fixed bottom-0 right-0 mb-4 mr-4'>
			<motion.button
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				initial={{ opacity: 0 }}
				animate={{ opacity: y > 400 ? 1 : 0 }}
				className='animate-bounce hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full p-2'>
				<BsFillArrowUpCircleFill className='h-10 w-10 text-gray-600 dark:text-gray-400' />
			</motion.button>
		</div>
	);
};

export default PushToTop;
