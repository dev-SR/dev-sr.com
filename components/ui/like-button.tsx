'use client';
import { useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { Button } from './button';

interface LikeButtonProps {
	initialCount: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ initialCount }) => {
	const [count, setCount] = useState(initialCount);
	const [isLiked, setIsLiked] = useState(false);

	const handleLikeClick = () => {
		setIsLiked(!isLiked);
		setCount(count + (isLiked ? -1 : 1));
	};

	return (
		<Button variant='outline' onClick={handleLikeClick}>
			<AiFillHeart className={`mr-2 h-5 w-5 ${isLiked ? 'text-red-500' : 'text-sky-400'}`} />
			{count}
		</Button>
	);
};

export default LikeButton;
