import React, { ReactNode } from 'react';

interface ThreeColumnLayoutProps {
	leftComponent?: ReactNode;
	mainComponent: ReactNode;
	rightComponent?: ReactNode;
}

const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
	leftComponent,
	mainComponent,
	rightComponent
}) => {
	return (
		<article className='grid grid-cols-12 w-full mt-10'>
			<div className='col-span-1 sm:col-span-1 md:col-span-3 flex justify-end pr-10'>
				{leftComponent}
			</div>
			<div className='col-span-10 sm:col-span-10 md:col-span-6 min-h-screen'>
				<div className='flex flex-col space-y-4'>{mainComponent}</div>
			</div>
			<div className='col-span-1 sm:col-span-1 md:col-span-3 px-4'>{rightComponent}</div>
		</article>
	);
};

export default ThreeColumnLayout;
