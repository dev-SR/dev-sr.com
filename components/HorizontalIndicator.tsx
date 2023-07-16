'use client';

import React, { useEffect, useState } from 'react';

interface HorizontalIndicatorProps {
	startPercentage?: number;
	endPercentage?: number;
}

const HorizontalIndicator: React.FC<HorizontalIndicatorProps> = ({
	startPercentage = 0,
	endPercentage = 100
}) => {
	const [scrollPercentage, setScrollPercentage] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;
			const scrollableHeight = document.documentElement.scrollHeight - windowHeight;
			const startOffset = (scrollableHeight * startPercentage) / 100;
			const endOffset = (scrollableHeight * endPercentage) / 100;
			const visibleHeight = endOffset - startOffset;
			const visibleScrollY = Math.max(0, scrollY - startOffset);
			const percentage = (visibleScrollY / visibleHeight) * 100;
			setScrollPercentage(percentage);
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [startPercentage, endPercentage]);

	return (
		<div className='fixed top-0 left-0 w-full h-1 bg-gray-300'>
			<div className='h-full bg-blue-500' style={{ width: `${scrollPercentage}%` }}></div>
		</div>
	);
};

export default HorizontalIndicator;
