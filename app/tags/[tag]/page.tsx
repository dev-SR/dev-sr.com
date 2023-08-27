import { allPosts } from 'contentlayer/generated';

import PageWrapper from '~/components/page-wrapper';
import Footer from '~/components/Footer';
import PostCard from '~/components/PostCard';
import { Tags } from '~/app/posts/page';
import TagCard from '~/components/TagCard';
import PageHeader from '~/components/PageHeader';
import ThreeColumnLayout from '~/components/ThreeColumnLayout';

interface PostProps {
	params: {
		tag: string;
	};
}

async function getPostFromParams(params: PostProps['params']) {
	const tag = params?.tag.replaceAll('%20', ' ');

	const posts = allPosts.filter((post) => post.tags.includes(tag));
	// console.log(tag, posts);
	const tags: Tags = {};
	allPosts.forEach((post) => {
		post.tags.forEach((tag) => {
			if (!tags[tag]) tags[tag] = 1;
			else tags[tag]++;
		});
	});
	if (!posts) {
		null;
	}

	return { posts, tags };
}

export async function generateStaticParams(): Promise<PostProps['params'][]> {
	return allPosts.map((post) => ({
		tag: post.slugAsParams
	}));
}

export default async function TagsPage({ params }: PostProps) {
	const { posts, tags } = await getPostFromParams(params);

	return (
		<PageWrapper>
			<PageHeader label={`[${params?.tag.replaceAll('%20', ' ')}]`} />
			<ThreeColumnLayout
				mainComponent={
					<>
						{posts
							.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
							.map((post, i) => (
								<PostCard post={post} key={i} />
							))}
					</>
				}
				rightComponent={<TagCard tags={tags} />}
			/>

			<Footer />
		</PageWrapper>
	);
}
