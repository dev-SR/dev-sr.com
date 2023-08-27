'use client';
import { SearchIcon } from 'lucide-react';
import { FaRegSurprise } from 'react-icons/fa';
import { IoIosSchool } from 'react-icons/io';
import { SiSemanticscholar } from 'react-icons/si';
import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
const experiencesData = [
	{
		title: 'Full-Stack Developer',
		location: '~',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla.',
		icon: <IoIosSchool />,
		date: '2019'
	},
	{
		title: 'Full-Stack Developer',
		location: '~',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla.',
		icon: <FaRegSurprise />,
		date: '2019 - 2021'
	},
	{
		title: 'Full-Stack Developer',
		location: '~',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla.',
		icon: <SiSemanticscholar />,
		date: '2021 - present'
	},
	{
		title: 'Full-Stack Developer',
		location: '~',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla.',
		icon: <SearchIcon />,
		date: '2021 - present'
	},
	{
		title: 'Full-Stack Developer',
		location: '~',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla.',
		icon: <SearchIcon />,
		date: '2021 - present'
	},
	{
		title: 'Full-Stack Developer',
		location: '~',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla.',
		icon: <SearchIcon />,
		date: '2021 - present'
	},
	{
		title: 'Full-Stack Developer',
		location: '~',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla.',
		icon: <SearchIcon />,
		date: '2021 - present'
	}
] as const;

export default function ExperienceVerticalTimeline() {
	const { theme } = useTheme();

	return (
		<motion.section className='scroll-mt-28 mb-28 sm:mb-40'>
			<VerticalTimeline lineColor={theme === 'light' ? 'black' : 'white'}>
				{experiencesData.map((item, index) => (
					<React.Fragment key={index}>
						<VerticalTimelineElement
							date={item.date}
							icon={item.icon}
							contentStyle={{
								background: theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(20, 20, 20)',
								boxShadow: 'none',
								border:
									theme === 'light' ? '1px solid rgb(225, 231, 239)' : '1px solid rgb(38, 38, 38)',
								padding: '1.3rem 1rem'
							}}
							contentArrowStyle={{
								borderRight:
									theme === 'light'
										? '0.4rem solid rgb(225, 231, 239)'
										: '0.4rem solid rgb(38, 38, 38)'
							}}
							iconStyle={{
								background: theme === 'light' ? 'white' : 'black',
								boxShadow: theme === 'light' ? '0 0 0 4px black' : '0 0 0 4px white'
								// You can add more CSS properties here if needed
							}}
							iconClassName='!p-0 !w-[40px] !h-[40px] push_icon_desktop push_icon_mobile'
							dateClassName='!p-0'>
							<div>
								<h3 className='font-semibold capitalize'>{item.title}</h3>
								<p className='font-normal !mt-0'>{item.location}</p>
								<p className='!mt-1 !font-normal '>{item.description}</p>
							</div>
						</VerticalTimelineElement>
					</React.Fragment>
				))}
			</VerticalTimeline>
		</motion.section>
	);
}
