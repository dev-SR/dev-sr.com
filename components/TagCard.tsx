'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { Badge } from '~/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Tags } from '~/app/posts/page';
type TagCardProps = {
	tags: Tags;
};
const TagCard = ({ tags }: TagCardProps) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);
	return (
		<Card>
			<CardHeader>
				<CardTitle className='font-medium text-xl'>All Tags</CardTitle>
				<CardDescription>
					{isClient && (
						<div className='w-full flex items-center py-1 flex-wrap gap-2'>
							{Object.keys(tags).map((tag, j) => (
								<Link key={j} href={`/tags/${tag}`}>
									<Badge
										variant={'outline'}
										className='text-foreground/80 hover:text-foreground uppercase text-sm'>
										{tag} ({tags[tag]})
									</Badge>
								</Link>
							))}
						</div>
					)}
				</CardDescription>
			</CardHeader>
		</Card>
	);
};

export default TagCard;
