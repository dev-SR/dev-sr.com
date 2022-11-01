import React, { JSXElementConstructor, ReactElement } from 'react';
import { HiArrowCircleRight } from 'react-icons/hi';
const LiTableOfContent = (props: React.HTMLAttributes<HTMLLIElement>) => {
	const children = props.children as
		| ReactElement<any, string | JSXElementConstructor<any>>
		| ReactElement<any, string | JSXElementConstructor<any>>[]
		| undefined;
	// default list item
	if ((children as ReactElement)?.props) {
		return (
			<li className='flex items-center space-x-2'>
				<HiArrowCircleRight className='text-green-400' />
				<a
					className=' text-indigo-200 hover:text-indigo-400'
					href={(children as ReactElement).props.href}>
					{(children as ReactElement).props.children}
				</a>
			</li>
		);
	} else {
		// nested list
		if (children && typeof children !== 'string') {
			const children_list = children as ReactElement<any, string | JSXElementConstructor<any>>[];
			return children_list.map((child, i) => {
				// nested list parent
				if (child.props?.href) {
					return (
						<li className='flex items-center space-x-2' key={i}>
							<HiArrowCircleRight className='text-green-400' />
							<a className=' text-indigo-200 hover:text-indigo-400' href={child.props.href}>
								{child.props.children}
							</a>
						</li>
					);
				}
				// nested list child
				return (
					<li key={i} {...props}>
						{child}
					</li>
				);
			});
		}
	}
};
export default LiTableOfContent;
