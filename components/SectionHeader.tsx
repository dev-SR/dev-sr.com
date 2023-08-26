import React from 'react';
import { Separator } from './ui/separator';
interface Props {
	label: string;
}

const SectionHeader = ({ label }: Props) => {
	return (
		<div className='mt-20 mb-6'>
			<div className='flex w-full items-end space-x-4'>
				<div className='flex items-end font-bold'>
					<div className='text-2xl font-black flex-shrink-0'>{label}</div>
					<div className='text-primary text-4xl flex-grow-0 font-black'>.</div>
				</div>
				<Separator className='shrink h-[3px] mb-4' />
			</div>
		</div>
	);
};

export default SectionHeader;
