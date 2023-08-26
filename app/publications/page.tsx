import Footer from '~/components/Footer';
import SectionHeader from '~/components/SectionHeader';
import ThreeColumnLayout from '~/components/ThreeColumnLayout';
import PageWrapper from '~/components/page-wrapper';

export default async function PublicationPage() {
	return (
		<PageWrapper>
			<ThreeColumnLayout
				mainComponent={
					<>
						<SectionHeader label='Publications' />
					</>
				}
			/>
			<Footer />
		</PageWrapper>
	);
}
