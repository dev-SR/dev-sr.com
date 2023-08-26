import React from 'react';
import { Separator } from './ui/separator';
interface Props {
	label: string;
}

const PageHeader = ({ label }: Props) => {
	return (
		<div className='grid grid-cols-12 w-full mt-32'>
			<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
			<div className='col-span-10 sm:col-span-10 md:col-span-8'>
				<div className='flex w-full items-end space-x-4'>
					<div className='flex items-end font-bold flex-shrink-0'>
						<div className='text-2xl font-black flex-shrink-0'>{label}</div>
						<div className='text-primary text-4xl flex-grow-0 font-black'>.</div>
					</div>
					<Separator className='shrink h-[3px] mb-4' />
				</div>
			</div>
			<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
		</div>
	);
};

export default PageHeader;
