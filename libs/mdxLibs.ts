import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export type PostsType = {
	title: string;
	date: string;
	tags: string[];
	description: string;
	author: string;
	slug: string;
	url: string;
};

export type PostListProps = {
	posts_metadata: PostsType[];
};

const cwd = process.cwd();
export const getMdxPath = path.join(cwd, 'blog-content');
export const getPostFiles = fs.readdirSync(getMdxPath).filter((p) => p.endsWith('.md'));


export const getAllPostsMetadata = ():PostsType[] => {
	const posts = getPostFiles.map((postFile) => {
			// read all the md files
			const content = fs.readFileSync(path.join(getMdxPath, postFile), 'utf-8');
			// parse the front-matter
			const { data: postFrontMatterMetaData } = matter(content);
			return {
				...(postFrontMatterMetaData as PostsType),
				slug: postFile.replace('.md', '')
			};
		})
	return posts;
};