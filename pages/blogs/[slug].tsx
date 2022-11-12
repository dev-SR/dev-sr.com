import { GetStaticPaths, GetStaticProps } from 'next';
import path from 'path';
import fs from 'fs';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getAllPostsMetadata, getMdxPath, getPostFiles, PostsType } from '../../libs/mdxLibs';
import matter from 'gray-matter';
import Head from 'next/head';
import Image from 'next/image';
import { BiArrowBack } from 'react-icons/bi';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { JSXElementConstructor, ReactElement } from 'react';
import Highlight, { defaultProps, Language, PrismTheme } from 'prism-react-renderer';
const HelloWorld = dynamic(() => import('../../components/MDXcomponent/HelloWorld'));
import remarkSlug from 'remark-slug';
import remarkAutolinkHeadings from 'remark-autolink-headings';
import remarkMdxCodeMeta from 'remark-mdx-code-meta';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
// import dracula from 'prism-react-renderer/themes/dracula';
import { HiArrowCircleRight, HiMinusCircle, HiPlusCircle } from 'react-icons/hi';
import { myCustomPrismTheme } from '../../libs/prism-theme';
import { remarkSectionize } from '../../libs/remark-sectionize-fork';
import { useCopyToClipboard } from 'react-use';
import { IoCopyOutline } from 'react-icons/io5';
import toast, { Toaster } from 'react-hot-toast';
import Expandable from '../../components/MDXcomponent/Expandable';
import Container from '../../components/MDXcomponent/Container';
import CodeOutput from '../../components/MDXcomponent/CodeOutput';
import Quiz from '../../components/MDXcomponent/Quiz';
import NavBar from '../../components/NavBar';
import Layout from '../../components/Layout';
import { NextSeo } from 'next-seo';

const customComponents = {
	Container,
	CodeOutput,
	HelloWorld,
	Expandable,
	Quiz
};

const classNames = (...classes: any[]) => {
	return classes.filter(Boolean).join(' ');
};

type Props = {
	frontMatter: {
		[key: string]: any;
	};
	mdSource: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>;
	posts_metadata: PostsType[];
	slug: string;
};

type ProcessedCodeText = {
	codeString: string;
	language: string;
	filename: string;
	highlight_lines?: number[];
	add_highlight_lines?: number[];
	remove_highlight_lines?: number[];
	copy: boolean;
};

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

const notify = () =>
	toast.success('Code copied to clipboard!', {
		icon: '👏',
		style: {
			borderRadius: '10px',
			background: '#333',
			color: '#fff'
		}
	});

export interface HighlightedCodeTextProps {
	codeString: string;
	language: Language;
	highlightLine?: (index: number) => boolean;
}
const className = {
	Line: 'flex w-full pl-2 items-center',
	LineNo: 'select-none text-gray-500',
	LineContent: 'pl-4',
	LineIndicator: 'w-10 flex items-center  justify-between'
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

const components = {
	...customComponents,
	p: (props: any) => (
		<p {...props} className=' text-gray-400 text-lg' />
		//  text-justify
	),
	strong: (props: any) => <strong {...props} className='text-gray-300 text-lg font-medium' />,
	em: (props: any) => <em {...props} className='text-gray-300 text-lg font-normal italic' />,
	h2: (props: any) => <h2 {...props} className='text-2xl font-bold text-white py-4 ' />,
	h3: (props: any) => <h3 {...props} className='text-xl font-bold text-white py-4' />,
	h4: (props: any) => <h4 {...props} className='text-lg font-bold text-white py-4' />,
	ul: (props: any) => <ul {...props} className='list-outside pl-10 list-disc' />,
	li: (props: any) => <li {...props} className='text-gray-400 text-lg' />,
	a: (props: any) => <a {...props} className='text-indigo-200 hover:text-indigo-400 ' />,
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

const SingleBlogPost = ({ frontMatter, mdSource, posts_metadata, slug }: Props) => {
	return (
		<Layout posts_metadata={posts_metadata}>
			<NextSeo
				title={frontMatter.title}
				description={frontMatter.description}
				canonical={`https://dev-sr.vercel.app/blogs/${slug}`}
				openGraph={{
					url: `https://dev-sr.vercel.app/blogs/${slug}`,
					title: frontMatter.title,
					description: frontMatter.description,
					images: [
						{
							url: frontMatter.image,
							width: 800,
							height: 600,
							alt: frontMatter.title
						}
					],
					site_name: 'Sharukh Rahman | Software Developer & Researcher'
				}}
			/>
			<div className='px-2 md:px-72'>
				<div className='h-32'></div>
				<div className='group'>
					<Link href={'/'}>
						<div
							className='flex item-center space-x-2 text-gray-800 dark:text-gray-200
						transition duration-300 ease-in-out transform cursor-pointer
						 group-hover:text-indigo-500
						'>
							<div className='flex items-center justify-center group-hover:-translate-x-px'>
								<BiArrowBack className='h-4 w-4 ' />
							</div>
							<div className='flex-shrink-0'>
								<p className='text-center'>Home</p>
							</div>
						</div>
					</Link>
				</div>
				<div>
					<div className='w-full py-8'>
						<h1 className='text-4xl font-bold text-gray-800 dark:text-gray-200'>
							{frontMatter.title}
						</h1>
					</div>
				</div>
			</div>
			{/*@ts-ignore */}
			<MDXRemote {...mdSource} components={components} />
		</Layout>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const postsPaths = getPostFiles.map((postFile) => {
		return {
			params: {
				slug: postFile.replace('.md', '')
			}
		};
	});

	return {
		paths: postsPaths,
		fallback: false
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const posts_metadata = getAllPostsMetadata();

	const slug = context.params?.slug as string;
	const filePath = path.join(getMdxPath, `${slug}.md`);
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const { data: frontMatter, content } = matter(fileContent);
	const mdSource = await serialize(content, {
		mdxOptions: {
			remarkPlugins: [
				remarkMdxCodeMeta,
				remarkAutolinkHeadings,
				remarkSlug,
				remarkGfm,
				remarkSectionize, // for interactionOnScroll,
				remarkMath // for math
			],
			rehypePlugins: [rehypeKatex]
			/*
			// https://nickymeuleman.netlify.app/blog/math-gatsby-mdx
			rendering latex math
			import remarkMath from 'remark-math';
			import rehypeKatex from 'rehype-katex';
			👉 The KaTeX CSS file needs to be imported on a page to render the math correctly.
			import 'katex/dist/katex.min.css';




			*/
		}
	});

	return {
		props: {
			slug,
			mdSource,
			frontMatter: JSON.parse(JSON.stringify(frontMatter)),
			posts_metadata: JSON.parse(JSON.stringify(posts_metadata))
		}
	};
};

export default SingleBlogPost;
