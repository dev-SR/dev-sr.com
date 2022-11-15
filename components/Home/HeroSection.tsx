import React from 'react';

const HeroSection = () => {
	return (
		<>
			<div className='flex items-center flex-wrap'>
				<h1 className='text-4xl font-bold text-gray-800 dark:text-[#e8e8fd] '>Hey</h1>
				<h1 className='text-4xl font-bold text-gray-800 dark:text-[#e8e8fd]  animate-wiggle'>👋🏼</h1>
				<h1 className='text-4xl font-bold text-gray-800 dark:text-[#e8e8fd] '>,</h1>
				<h1 className='text-4xl font-bold text-gray-800 dark:text-[#e8e8fd] '>
					I'm Sharukh Rahman
				</h1>
			</div>
			<p className='font-light text-xl my-4 text-gray-800 dark:text-[#e8e8fd]/80 '>
				I'm a fullstack web engineer, machine learning and deep learning enthusiast. Along the way,
				I like sharing what I learn about web technologies and software related soft skills.
			</p>
		</>
	);
};

export default HeroSection;
