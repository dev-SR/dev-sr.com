import { allPosts } from 'contentlayer/generated';
import Footer from '~/components/Footer';
import TagCard from '~/components/TagCard';
import PageWrapper from '~/components/page-wrapper';
import { Separator } from '~/components/ui/separator';
import { Tags } from '../posts/page';
import PageHeader from '~/components/PageHeader';
import ThreeColumnLayout from '~/components/ThreeColumnLayout';
export const dynamic = 'force-static';

const getData = async () => {
	const tags: Tags = {}; // Frequency count of tags
	allPosts.forEach((post) => {
		post.tags.forEach((tag) => {
			if (!tags[tag]) tags[tag] = 1;
			else tags[tag]++;
		});
	});

	return { tags };
};

export default async function TagPage() {
	const { tags } = await getData();

	return (
		<PageWrapper>
			<PageHeader label='All Tags' />
			<ThreeColumnLayout mainComponent={<TagCard tags={tags} />} />

			<Footer />
		</PageWrapper>
	);
}
