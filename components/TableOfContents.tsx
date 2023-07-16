'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const TableOfContents: React.FC = () => {
	const pathname = usePathname();
	const [headings, setHeadings] = useState<JSX.Element[]>([]);
	const tocRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const headingElements = Array.from(
			document.querySelectorAll('h1, h2, h3, h4, h5, h6')
		) as HTMLHeadingElement[];

		const tocElements: JSX.Element[] = [];
		const headingLevels = [0, 0, 0, 0, 0, 0];

		headingElements.forEach((heading) => {
			const headingId = heading.id;
			const headingLevel = parseInt(heading.tagName.substring(1));
			const indent = headingLevel - 1; // Adjust the indent level as needed

			headingLevels[headingLevel - 1]++;
			headingLevels.fill(0, headingLevel);

			const displayNumber = headingLevels.slice(1, headingLevel).join('.');

			const tocElement = (
				<li
					key={headingId}
					style={{ marginLeft: `${indent + headingLevel - 1}rem` }}
					className='cursor-pointer hover:text-sky-500 opacity-70 hover:opacity-100'>
					<Link href={`${pathname}#${headingId}`}>
						<strong>{displayNumber}</strong> {heading.textContent}
					</Link>
				</li>
			);

			tocElements.push(tocElement);
		});

		setHeadings(tocElements);
	}, [pathname]);

	// handle highlight on view
	useEffect(() => {
		const headingsList = tocRef.current;
		if (!headingsList) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const id = entry.target.getAttribute('id');
					const tocLink = headingsList.querySelector(`[href="${pathname}#${id}"]`);

					if (tocLink) {
						if (entry.isIntersecting) {
							tocLink.classList.add('text-sky-500', 'text-opacity-100');
						} else {
							tocLink.classList.remove('text-sky-500', 'text-opacity-100');
						}
					}
				});
			},
			{
				threshold: 0.5 // Adjust the threshold as needed
			}
		);

		const headingElements = Array.from(
			document.querySelectorAll('h1, h2, h3, h4, h5, h6')
		) as HTMLHeadingElement[];
		headingElements.forEach((heading) => observer.observe(heading));

		return () => {
			observer.disconnect();
		};
	}, [pathname]);

	return (
		<>
			<div className='text-muted-foreground'>ON THIS PAGE</div>
			<ul ref={tocRef}>{headings}</ul>
		</>
	);
};

export default TableOfContents;
