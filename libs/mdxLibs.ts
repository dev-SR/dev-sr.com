import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { FrontMatterMeta } from './type-defs';

const cwd = process.cwd();
export const mdxDirPath = path.join(cwd, 'blog-content');
export const postFilesList = fs.readdirSync(mdxDirPath).filter((p) => p.endsWith('.md'));

export const getAllPostsMetadata = (): FrontMatterMeta[] => {
	const posts = postFilesList.map((postFile) => {
		// read all the md files
		const content = fs.readFileSync(path.join(mdxDirPath, postFile), 'utf-8');
		// parse the front-matter
		const { data: postFrontMatterMetaData } = matter(content);
		return {
			...(postFrontMatterMetaData as FrontMatterMeta),
			slug: postFile.replace('.md', '')
		};
	});
	return posts;
};

export const getAllPostFiles = (dirName: string = mdxDirPath): string[] => {
	let files: string[] = [];
	const items = fs.readdirSync(dirName, { withFileTypes: true });

	for (const item of items) {
		if (item.isDirectory()) {
			// recursive call
			const oldFiles = [...files];
			const subFiles = getAllPostFiles(path.join(dirName, item.name));
			subFiles.forEach((subFile) => {
				const subDirName = item.name;
				// console.log(path.basename(subFile));
			});

			files = [...oldFiles, ...subFiles];
		} else {
			const path = `${dirName}/${item.name}`;
			files.push(path);
		}
	}

	files.forEach((file) => {
		console.log(path.dirname(file));
	});

	return files;
};
