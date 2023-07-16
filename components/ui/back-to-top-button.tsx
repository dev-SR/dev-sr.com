'use client';
import { Button } from './button';

const BackToTopButton: React.FC = () => {
	const handleBackToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
	return (
		<Button variant='ghost' onClick={handleBackToTop}>
			Back to top
		</Button>
	);
};

export default BackToTopButton;
