import React from 'react';
type ExpandableProps = {
	children: React.ReactNode;
	text: string;
};
const Expandable = ({ children, text }: ExpandableProps) => {
	const [expanded, setExpanded] = React.useState(false);

	return expanded ? (
		<div className='bg-slate-800 rounded-lg p-4'>
			<button
				onClick={() => setExpanded(false)}
				className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded'>
				Collapse
			</button>
			<div className='pt-2'>{children}</div>
		</div>
	) : (
		<div className='bg-slate-800 rounded-lg p-4'>
			<button
				onClick={() => setExpanded(true)}
				className='bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded'>
				Expand
			</button>
		</div>
	);
};

export default Expandable;
