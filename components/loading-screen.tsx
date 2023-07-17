import { Skeleton } from './ui/skeleton';
export function SkeletonDemo() {
	return (
		<div className='flex flex-col space-y-4 max-h-screen w-full'>
			{Array.from({ length: 6 }, (_, i) => (
				<Skeleton key={i} className='w-full h-12' />
			))}
		</div>
	);
}
