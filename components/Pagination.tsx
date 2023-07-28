'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';

interface PaginationProps {
	totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	// Get the current page from the router query
	const currentPage = parseInt(searchParams.get('page') as string, 10) || 1;

	// Function to handle page change and update the searchParams
	const handlePageChange = (page: number) => {
		router.push(pathname + '?' + `page=${page}`);
	};

	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPages;

	// Function to generate the array of page numbers to be displayed
	const generatePageNumbers = () => {
		const pageNumbers = [];
		const maxDisplayedPages = 2;

		let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
		const endPage = Math.min(startPage + maxDisplayedPages - 1, totalPages);

		if (endPage - startPage + 1 < maxDisplayedPages) {
			startPage = Math.max(endPage - maxDisplayedPages + 1, 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}

		return pageNumbers;
	};

	const pageNumbers = generatePageNumbers();

	return (
		<div className='flex justify-end space-x-2 mt-8'>
			<Button
				onClick={() => handlePageChange(1)}
				variant={isFirstPage ? 'secondary' : 'outline'}
				disabled={isFirstPage}>
				First
			</Button>
			<Button
				disabled={isFirstPage}
				onClick={() => handlePageChange(currentPage - 1)}
				variant={isFirstPage ? 'secondary' : 'outline'}>
				Previous
			</Button>

			{pageNumbers[0] > 1 && (
				<>
					<Button disabled variant='secondary'>
						...
					</Button>
					<Button onClick={() => handlePageChange(pageNumbers[0] - 1)} variant='outline'>
						{pageNumbers[0] - 1}
					</Button>
				</>
			)}

			{pageNumbers.map((page) => (
				<Button
					key={page}
					disabled={currentPage === page}
					onClick={() => handlePageChange(page)}
					variant={currentPage === page ? 'secondary' : 'outline'}>
					{page}
				</Button>
			))}

			{pageNumbers[pageNumbers.length - 1] < totalPages && (
				<>
					<Button
						onClick={() => handlePageChange(pageNumbers[pageNumbers.length - 1] + 1)}
						variant='outline'>
						{pageNumbers[pageNumbers.length - 1] + 1}
					</Button>
					<Button disabled variant='secondary'>
						...
					</Button>
				</>
			)}

			<Button
				onClick={() => handlePageChange(currentPage + 1)}
				variant={isLastPage ? 'secondary' : 'outline'}
				disabled={isLastPage}>
				Next
			</Button>
			<Button
				onClick={() => handlePageChange(totalPages)}
				variant={isLastPage ? 'secondary' : 'outline'}
				disabled={isLastPage}>
				Last
			</Button>
		</div>
	);
};

export default Pagination;
