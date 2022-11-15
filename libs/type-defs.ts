export type FrontMatterMeta = {
	title: string;
	date: string;
	updated: string;
	tags: string[];
	description: string;
	author: string;
	slug: string;
	poster_image: string;
};

export type PostListProps = {
	posts_metadata: FrontMatterMeta[];
};
