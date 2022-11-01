import React from 'react';
type CodeOutputProps = {
	children: React.ReactNode;
	align?: 'left' | 'right' | 'center';
};
const classNames = (...classes: any[]) => {
	return classes.filter(Boolean).join(' ');
};

const CodeOutput = ({ children, align = 'center' }: CodeOutputProps) => {
	return (
		<div
			className={classNames(
				'rounded-md py-4 px-2 my-4 backdrop-blur-sm bg-slate-700/25 border border-white/5 flex',
				align == 'center' && 'justify-center items-center'
			)}>
			{children}
		</div>
	);
};
export default CodeOutput;
