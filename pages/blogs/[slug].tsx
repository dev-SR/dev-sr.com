import { GetStaticPaths, GetStaticProps } from 'next';
import path from 'path';
import fs from 'fs';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getAllPostsMetadata, mdxDirPath, postFilesList } from '@libs/mdxLibs';
import matter from 'gray-matter';
import Layout from '@components/Layout';
import { NextSeo } from 'next-seo';
import readingTime from 'reading-time';
import remarkSlug from 'remark-slug';
import remarkAutolinkHeadings from 'remark-autolink-headings';
import remarkMdxCodeMeta from 'remark-mdx-code-meta';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
// import dracula from 'prism-react-renderer/themes/dracula';
import { remarkSectionize } from '@libs/remark-sectionize-fork';
import MDXComponents from '@components/MDXcomponent';
import BlogPostHeroSection from '@components/BlogPost/BlogPostHeroSection';
import { FrontMatterMeta } from '@libs/type-defs';
import PushToTop from '@components/PushToTop';

type Props = {
	frontMatter: FrontMatterMeta;
	mdSource: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>;
	posts_metadata: FrontMatterMeta[];
	slug: string;
	readingTime: string;
};

const SingleBlogPost = ({ frontMatter, readingTime, mdSource, posts_metadata, slug }: Props) => {
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
							// url: frontMatter.image,
							url: 'https://dev-sr.vercel.app/static/og/singnature-default.png',
							width: 1200,
							height: 630,
							alt: frontMatter.title
						}
					],
					site_name: 'Sharukh Rahman | Software Developer & Researcher'
				}}
			/>
			<BlogPostHeroSection frontMatter={frontMatter} readingTime={readingTime} />
			<PushToTop />
			{/*@ts-ignore */}
			<MDXRemote {...mdSource} components={MDXComponents} />
		</Layout>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const postsPaths = postFilesList.map((postFile) => {
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
	const filePath = path.join(mdxDirPath, `${slug}.md`);
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const reading_time = readingTime(fileContent).text;

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

	// console.log(mdSource);

	return {
		props: {
			slug,
			mdSource,
			frontMatter: JSON.parse(JSON.stringify(frontMatter)),
			readingTime: reading_time,
			posts_metadata: JSON.parse(JSON.stringify(posts_metadata))
		}
	};
};

export default SingleBlogPost;
