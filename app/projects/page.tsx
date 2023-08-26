import Footer from '~/components/Footer';
import SectionHeader from '~/components/SectionHeader';
import ThreeColumnLayout from '~/components/ThreeColumnLayout';
import PageWrapper from '~/components/page-wrapper';

export default async function ProjectPage() {
	return (
		<PageWrapper>
			<ThreeColumnLayout
				mainComponent={
					<>
						<SectionHeader label='Project' />
					</>
				}
			/>
			<Footer />
		</PageWrapper>
	);
}
