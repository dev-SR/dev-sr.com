'use client';
import React, { useEffect, useState } from 'react';

interface VerticalIndicatorProps {
	StartScrollOffset?: number;
	EndScrollOffset?: number;
}

const VerticalIndicator: React.FC<VerticalIndicatorProps> = ({
	StartScrollOffset = 1000,
	EndScrollOffset = 300
}) => {
	const [scrollPercentage, setScrollPercentage] = useState(0);
	const [isIndicatorVisible, setIsIndicatorVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const { scrollY, innerHeight } = window;
			const { scrollHeight } = document.documentElement;
			const maxScroll = scrollHeight - innerHeight - StartScrollOffset;
			const percentage = ((scrollY - StartScrollOffset) / maxScroll) * 100;
			setScrollPercentage(percentage);

			const upto = scrollHeight - innerHeight - EndScrollOffset;

			// Check if the scroll position is between StartScrollOffset and upto
			if (!isIndicatorVisible && scrollY >= StartScrollOffset && scrollY <= upto) {
				setIsIndicatorVisible(true);
			} else if (isIndicatorVisible && (scrollY < StartScrollOffset || scrollY > upto)) {
				setIsIndicatorVisible(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [EndScrollOffset, StartScrollOffset, isIndicatorVisible]);

	return (
		<div
			className={`fixed h-1/2 w-1 bg-foreground/20 ${
				isIndicatorVisible ? 'opacity-100' : 'opacity-0'
			}`}>
			<div className='h-full bg-sky-500' style={{ height: `${scrollPercentage}%` }}></div>
		</div>
	);
};

export default VerticalIndicator;
