import Footer from '~/components/Footer';
import SectionHeader from '~/components/SectionHeader';
import ThreeColumnLayout from '~/components/ThreeColumnLayout';
import PageWrapper from '~/components/page-wrapper';

export default async function AboutPage() {
	return (
		<PageWrapper>
			<ThreeColumnLayout
				mainComponent={
					<>
						<SectionHeader label='About' />
					</>
				}
			/>
			<Footer />
		</PageWrapper>
	);
}
