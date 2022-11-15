import { GetStaticProps } from 'next/types';
import Link from 'next/link';
import { getAllPostsMetadata } from '../../libs/mdxLibs';
import Layout from '../../components/Layout';
import { FrontMatterMeta } from '@libs/type-defs';
type TagsProps = {
	posts_metadata: FrontMatterMeta[];
};
const Tags = ({ posts_metadata }: TagsProps) => {
	return (
		<Layout posts_metadata={posts_metadata}>
			{posts_metadata.map((post) => {
				return (
					<div key={post.slug} className='h-72'>
						<Link href={`/blog/${post.slug}`}>
							<span className='text-2xl text-gray-800 dark:text-gray-200 font-bold'>
								{post.title}
							</span>
						</Link>
						<p className='text-gray-800 dark:text-gray-300'>{post.description}</p>
						<p className='text-gray-800 dark:text-gray-300'>{post.date}</p>
					</div>
				);
			})}
		</Layout>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	const posts_metadata = getAllPostsMetadata()
		.sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		})
		.slice(0, 5);
	return {
		props: {
			posts_metadata: JSON.parse(JSON.stringify(posts_metadata))
		}
	};
};

export default Tags;
