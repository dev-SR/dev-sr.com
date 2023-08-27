import { MetadataRoute } from 'next';
import { allPosts } from '~/.contentlayer/generated';

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://dev-sr.vercel.app';
	const post = allPosts;
	const postUrls = post.map((post) => {
		return {
			url: `${baseUrl}/posts/${post.slugAsParams}`,
			lastModified: new Date()
		};
	});

	const tags = allPosts.map((post) => post.tags.join(','));
	const uniqueTags = new Set();

	tags.forEach((item) => {
		const splitItems = item.split(',');
		splitItems.forEach((subItem) => uniqueTags.add(subItem));
	});
	const tagsUrls = Array.from(uniqueTags).map((tag) => {
		return {
			url: `${baseUrl}/tags/${tag}`,
			lastModified: new Date()
		};
	});

	return [
		{
			url: baseUrl,
			lastModified: new Date()
		},
		...postUrls,
		...tagsUrls
	];
}
