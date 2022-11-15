import HighlightedCodeText from '@components/SyntaxHighlighter/HighlightedCodeText';

import Expandable from '@components/MDXcomponent/Expandable';
import Container from '@components/MDXcomponent/Container';
import CodeOutput from '@components/MDXcomponent/CodeOutput';
import Quiz from '@components/MDXcomponent/Quiz';
import dynamic from 'next/dynamic';
const HelloWorld = dynamic(() => import('@components/MDXcomponent/HelloWorld'));

const MDXComponents = {
	Container,
	CodeOutput,
	HelloWorld,
	Expandable,
	Quiz,
	p: (props: any) => (
		<p {...props} className=' dark:text-[#98a0b3] text-[18px] leading-[34px] py-4' />
		//  text-justify
	),
	strong: (props: any) => (
		<strong {...props} className='dark:text-[#e8e8fd] text-[18px] leading-[34px] font-semibold' />
	),
	em: (props: any) => <em {...props} className='dark:text-[#e8e8fd]/90 italic' />,
	h2: (props: any) => (
		<h2 {...props} className='text-2xl font-semibold dark:text-[#e8e8fd] py-4 ' />
	),
	h3: (props: any) => <h3 {...props} className='text-xl font-semibold dark:text-[#e8e8fd] py-4' />,
	h4: (props: any) => <h4 {...props} className='text-lg font-semibold dark:text-[#e8e8fd] py-4' />,
	ul: (props: any) => <ul {...props} className='list-outside pl-10 list-disc' />,
	li: (props: any) => <li {...props} className='dark:text-gray-400 text-lg' />,
	a: (props: any) => (
		<a {...props} className='text-indigo-400 dark:text-indigo-500 hover:dark:text-indigo-600 ' />
	),
	pre: HighlightedCodeText,
	code: (props: any) => (
		<code
			{...props}
			className='text-indigo-300 font-code bg-slate-700 rounded-md shadow-md px-2 border border-gray-700'
		/>
	),
	table: (props: any) => (
		<table {...props} className=' text-gray-300 w-full my-4 rounded-md	shadow shadow-slate-600' />
	),
	th: (props: any) => (
		<th {...props} className='text-left text-gray-300 font-bold border-b border-gray-700 p-2' />
	),
	tr: (props: any) => <tr {...props} className='p-2' />,
	td: (props: any) => <td {...props} className='p-2' />,
	div: (props: any) => {
		if (props.className && props.className.includes('math math-display')) {
			return <div {...props} className='text-purple-400 bg-gray-500 rounded-md' />;
		}
		// console.log(props.className);

		return <div {...props} />;
	},
	span: (props: any) => {
		console.log(props);

		if (props.className && props.className.includes('math math-inline')) {
			return <span {...props} className='text-purple-400 bg-gray-500  px-4 py-1 rounded' />;
		}
		return <span {...props} />;
	}
};

export default MDXComponents;
