import { allPosts } from 'contentlayer/generated';
import Footer from '~/components/Footer';
import PageWrapper from '~/components/page-wrapper';
import Pagination from '~/components/Pagination';
import PostCard from '~/components/PostCard';
import PageHeader from '~/components/PageHeader';
import TagCard from '~/components/TagCard';
import ThreeColumnLayout from '~/components/ThreeColumnLayout';

export type Tags = {
	[key: string]: number;
};

type SearchParam = {
	page: string;
};
export const metadata = {
	title: 'Posts',
	description:
		'Hi, this is Sharukh Rahman. Join me in exploring the realms of programming and machine learning as I meticulously document my learning journey and insights in this blog.'
};

const getData = async ({ page = '1' }: SearchParam) => {
	const posts = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	const postsPerPage = 3;
	const totalPosts = posts.length;
	const totalPages = Math.ceil(totalPosts / postsPerPage);
	const indexOfLastPost = Number(page) * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

	const tags: Tags = {};
	allPosts.forEach((post) => {
		post.tags.forEach((tag) => {
			if (!tags[tag]) tags[tag] = 1;
			else tags[tag]++;
		});
	});

	// console.log(page, currentPosts[0].title);

	return { currentPosts, totalPages, tags };
};

interface BlogPostProps {
	searchParams: SearchParam;
}
export default async function BlogPostPage({ searchParams }: BlogPostProps) {
	const { currentPosts, totalPages, tags } = await getData(searchParams);

	return (
		<PageWrapper>
			<PageHeader label='All Posts' />
			<ThreeColumnLayout
				mainComponent={
					<>
						{currentPosts.map((post, i) => (
							<PostCard post={post} key={i} />
						))}

						<Pagination totalPages={totalPages} />
					</>
				}
				rightComponent={<TagCard tags={tags} />}
			/>

			<Footer />
		</PageWrapper>
	);
}
