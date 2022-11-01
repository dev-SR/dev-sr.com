import React from 'react';

type Quiz = {
	question: string;
	answer: string;
	options: string[];
};

type QuizProps = {
	quiz: Quiz[];
};
const Quiz = ({ quiz }: QuizProps) => {
	return (
		<div>
			{quiz.map((item, index) => {
				return (
					<div key={index} className='my-4'>
						<p
							className='font-bold
						text-gray-200
						text-lg'>
							{item.question}
						</p>
						<div className='py-2'>
							{item.options.map((choice, index) => {
								return (
									<div key={index} className='flex items-center space-x-2 pl-4'>
										<input
											type='radio'
											name={item.question}
											id={choice}
											className='h-4 w-4 accent-pink-500'
										/>
										<label htmlFor={choice} className='text-gray-600 text-lg'>
											{choice}
										</label>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
};
export default Quiz;
