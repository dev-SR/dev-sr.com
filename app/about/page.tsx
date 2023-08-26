import Footer from '~/components/Footer';
import SectionHeader from '~/components/SectionHeader';
import ThreeColumnLayout from '~/components/ThreeColumnLayout';
import PageWrapper from '~/components/page-wrapper';
import Skills from '~/components/Skills';
import ExperienceVerticalTimeline from '~/components/ExperienceVerticalTimeline';

export default async function AboutPage() {
	return (
		<PageWrapper>
			<ThreeColumnLayout
				mainComponent={
					<>
						<SectionHeader label='Skills' />
						<Skills />
						<SectionHeader label='Experience' />
						<ExperienceVerticalTimeline />
					</>
				}
			/>
			<Footer />
		</PageWrapper>
	);
}
