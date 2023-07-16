'use client';
import Footer from '~/components/Footer';
import PageWrapper from '~/components/page-wrapper';

export default async function TagsPage() {
	return (
		<PageWrapper>
			<article className='grid grid-cols-12 w-full mt-60'>
				<div className='col-span-1 sm:col-span-1 md:col-span-3  flex justify-end pr-10 '></div>
				<div className='col-span-10 sm:col-span-10 md:col-span-6'>
					<div className='flex flex-col space-y-4'>TagsPage</div>
				</div>
				<div className='col-span-1 sm:col-span-1 md:col-span-3 px-4'></div>
			</article>
			<Footer />
		</PageWrapper>
	);
}
