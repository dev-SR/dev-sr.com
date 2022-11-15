import { JSXElementConstructor, ReactElement } from 'react';
import Highlight, { defaultProps, Language, PrismTheme } from 'prism-react-renderer';
import { HiArrowCircleRight, HiMinusCircle, HiPlusCircle } from 'react-icons/hi';
import { myCustomPrismTheme } from '@libs/prism-theme';
import { useCopyToClipboard } from 'react-use';
import { IoCopyOutline } from 'react-icons/io5';
import { classNames } from '@libs/classNames';
import toast, { Toaster } from 'react-hot-toast';

const notify = () =>
	toast.success('Code copied to clipboard!', {
		icon: '👏',
		style: {
			borderRadius: '10px',
			background: '#333',
			color: '#fff'
		}
	});

type ProcessedCodeText = {
	codeString: string;
	language: string;
	filename: string;
	highlight_lines?: number[];
	add_highlight_lines?: number[];
	remove_highlight_lines?: number[];
	copy: boolean;
};

const className = {
	Line: 'flex w-full pl-2 items-center',
	LineNo: 'select-none text-gray-500',
	LineContent: 'pl-4',
	LineIndicator: 'w-10 flex items-center  justify-between'
};
export interface HighlightedCodeTextProps {
	codeString: string;
	language: Language;
	highlightLine?: (index: number) => boolean;
}
export const preToCodeBlock = (preProps: any): ProcessedCodeText => {
	const { filename, highlight_lines, copy, add_highlight_lines, remove_highlight_lines } = preProps;
	const meta = { filename, highlight_lines, copy, add_highlight_lines, remove_highlight_lines };

	const children = preProps.children as
		| ReactElement<any, string | JSXElementConstructor<any>>
		| undefined;
	// if (children && children.props) {

	const { children: codeString, className = '' } = children?.props;
	const matches = className.match(/language-(?<lang>.*)/);
	return {
		codeString: codeString.trim() as string,
		language:
			matches && matches.groups && matches.groups.lang
				? (matches.groups.lang as string)
				: ('' as string),
		...meta
	};
	// }
};
const HighlightedCodeText = (props: any) => {
	const {
		codeString,
		language,
		filename,
		highlight_lines,
		add_highlight_lines,
		remove_highlight_lines,
		...other
	} = preToCodeBlock(props);
	console.log(language);

	const [_, copyToClipboard] = useCopyToClipboard();

	return (
		<div className='flex flex-col w-full  my-4 rounded-md shadow border border-white/10'>
			<div className='flex h-12 bg-gray-900 items-center justify-between border-b-2 rounded-t-lg border-white/10 px-4  space-x-4'>
				<p className=' text-white font-bold'>{filename}</p>
				<div>
					<Toaster />
					<IoCopyOutline
						className='text-gray-500 w-5 h-7 hover:text-indigo-500 cursor-pointer'
						onClick={() => {
							copyToClipboard(codeString);
							notify();
						}}
					/>
				</div>
			</div>
			<Highlight
				{...defaultProps}
				code={codeString}
				language={language as Language}
				theme={myCustomPrismTheme as PrismTheme}>
				{({ className: defaultClasses, style, tokens, getLineProps, getTokenProps }) => (
					<pre
						className={classNames(
							defaultClasses,
							'py-4 max-h-80 text-left overflow-y-auto  scroll-smooth scroll-p-4 font-code rounded-b-lg'
						)}
						style={style}>
						{tokens.map((line, i) => {
							const lineNo = i + 1;
							return (
								<div
									key={i}
									{...getLineProps({
										line,
										key: i,
										className: classNames(
											className.Line,
											highlight_lines?.includes(lineNo) &&
												'bg-sky-500/[.2] border-l-4 border-sky-300 pl-1',
											add_highlight_lines?.includes(lineNo) &&
												'bg-green-500/[.2] border-l-4 border-green-300 pl-1',
											remove_highlight_lines?.includes(lineNo) &&
												'bg-red-500/[.2] border-l-4 border-red-300 pl-1'
										)
									})}
									// className={ }
								>
									<div className={className.LineIndicator}>
										<span className={className.LineNo}>{lineNo}</span>
										{highlight_lines?.includes(lineNo) && (
											<HiArrowCircleRight className='text-sky-500' />
										)}
										{add_highlight_lines?.includes(lineNo) && (
											<HiPlusCircle className='text-green-500' />
										)}
										{remove_highlight_lines?.includes(lineNo) && (
											<HiMinusCircle className='text-red-500' />
										)}
									</div>

									{!highlight_lines?.includes(lineNo) && <span className='w-2 pr-2 select-none' />}
									<span className={className.LineContent}>
										{line.map((token, key) => (
											<span {...getTokenProps({ token, key })} key={i} />
										))}
									</span>
								</div>
							);
						})}
					</pre>
				)}
			</Highlight>
		</div>
	);
};

export default HighlightedCodeText;
