'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, transform, useAnimation } from 'framer-motion';
import { useTheme } from 'next-themes';

interface BoxProps {
	x: any;
	y: any;
	column: number;
	row: number;
}

const containerSize = 580;
const columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const balanceImbalance = 160;
const boxSize = containerSize / columns.length;
const transition = { duration: 5, repeat: Infinity, ease: 'easeOut' };

export default function Matrix() {
	const x = useMotionValue(-boxSize);
	const y = useMotionValue(-boxSize);
	const containerRef = useRef<HTMLDivElement>(null);
	const animation = useAnimation();

	const loopAnimation = useCallback(() => {
		animation.start({
			x: [-boxSize, containerSize, containerSize, -boxSize, -boxSize],
			y: [
				-boxSize,
				-boxSize,
				containerSize - balanceImbalance,
				containerSize - balanceImbalance,
				-boxSize
			],
			rotate: [0, 0, 90, 90, 180, 180, 270, 270, 360],
			transition
		});
	}, [animation]);

	const stopAnimation = useCallback(() => animation.stop(), [animation]);

	const restartAnimation = async () => {
		await animation.start({
			x: -boxSize,
			y: -boxSize,
			rotate: 0
		});
		await loopAnimation();
	};

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		stopAnimation();
		const newXPos = event.pageX - containerRef.current!.getBoundingClientRect().x - boxSize / 2;
		x.set(newXPos);
		y.set(event.pageY - containerRef.current!.getBoundingClientRect().y - boxSize / 2);
	};

	useEffect(() => {
		loopAnimation();
		return () => stopAnimation();
	}, [loopAnimation, stopAnimation]);

	const theme = useTheme();
	const borderColor = theme.theme === 'dark' ? '#4D535C' : '#D1D5DB';

	return (
		<div
			className='relative w-[580px] h-[500px] bg-transparent'
			ref={containerRef}
			onMouseEnter={stopAnimation}
			onMouseLeave={restartAnimation}
			onMouseMove={handleMouseMove}>
			{columns.map((column, columnIndex) =>
				rows.map((row, rowIndex) => (
					<Box x={x} y={y} column={columnIndex} row={rowIndex} key={`${column}${row}`} />
				))
			)}
			<motion.div
				style={{
					height: boxSize,
					width: boxSize,
					borderRadius: boxSize * 0.33,
					x,
					y,
					border: `6px solid ${borderColor}`,
					scale: 0.5
				}}
				animate={animation}
			/>
		</div>
	);
}

const Box: React.FunctionComponent<BoxProps> = ({ x, y, column, row }) => {
	const theme = useTheme();
	const top = row * boxSize;
	const left = column * boxSize;

	const angle = useMotionValue(0);
	const scale = useMotionValue(0);
	const borderRadius = useMotionValue(0);
	const background = useMotionValue('');

	useEffect(() => {
		function updateProps() {
			const updatedAngle = calcAngle(top, left, x.get(), y.get());
			angle.set(updatedAngle);

			const proximity = Math.max(Math.abs(left - x.get()), Math.abs(top - y.get()));

			// For dark theme
			const darkColor = transform(proximity, [0, containerSize - boxSize], ['#2d2f34', '#1B1E24']);

			// For light theme, using lighter colors
			const lightColor = transform(proximity, [0, containerSize - boxSize], ['#EAEAEA', '#F3F3F3']);

			const newColor = theme.theme == 'dark' ? darkColor : lightColor;

			const newScale = transform(proximity, [0, containerSize - boxSize], [0.8, 0.5]);
			const newBorderRadius = transform(
				proximity,
				[0, containerSize - boxSize],
				[boxSize * 0.11, boxSize * 0.33]
			);
			background.set(newColor);
			scale.set(newScale);
			borderRadius.set(newBorderRadius);
		}

		const unsubscribeX = x.onChange(updateProps);
		const unsubscribeY = y.onChange(updateProps);

		return () => {
			unsubscribeX();
			unsubscribeY();
		};
	}, [angle, background, borderRadius, left, scale, theme.theme, top, x, y]);
	return (
		<motion.div
			style={{
				height: boxSize,
				width: boxSize,
				position: 'absolute',
				top,
				left,
				background,
				scale,
				borderRadius,
				rotate: angle
			}}
		/>
	);
};

function calcAngle(top: number, left: number, cursorTop: number, cursorLeft: number) {
	let angle = Math.atan2(cursorTop - left, cursorLeft - top) * (180 / Math.PI);
	return angle < 0 ? -(angle + 540) : -(angle + 180);
}
