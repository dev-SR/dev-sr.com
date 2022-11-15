import { FrontMatterMeta } from '@libs/type-defs';
import React from 'react';
import Footer from './Footer';
import NavBar from './NavBar';

type LayoutProps = {
	posts_metadata: FrontMatterMeta[];
	children: React.ReactNode;
};

const Layout = ({ children, posts_metadata }: LayoutProps) => {
	return (
		<main className='flex flex-col justify-between  min-h-screen'>
			<NavBar posts_metadata={posts_metadata} />
			<div className='h-32'></div>
			{children}
			<Footer />
		</main>
	);
};

export default Layout;
