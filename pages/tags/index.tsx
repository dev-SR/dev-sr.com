import { GetStaticProps } from 'next/types';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { format } from 'date-fns';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { getAllPostsMetadata, getMdxPath, getPostFiles,PostsType } from '../../libs/mdxLibs';
import Layout from '../../components/Layout';
type TagsProps = {
	posts_metadata: PostsType[];

};
const Tags = ({posts_metadata}:TagsProps) => {
	return (
		<Layout posts_metadata={posts_metadata}>

			{
				posts_metadata.map((post) => {
					return (
						<div key={post.slug} className="h-72">
							<Link href={`/blog/${post.slug}`}>
								<span className='text-2xl text-gray-800 dark:text-gray-200 font-bold'>
									{post.title}
								</span>
							</Link>
							<p className='text-gray-800 dark:text-gray-300'>{post.description}</p>
							<p className='text-gray-800 dark:text-gray-300'>{post.date}</p>
						</div>
					);
				})
			}

		</Layout>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	const posts_metadata = getAllPostsMetadata().sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		}).slice(0,5);
	return {
		props: {
			posts_metadata: JSON.parse(JSON.stringify(posts_metadata))
		}
	};
};


export default Tags;