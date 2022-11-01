import React from 'react';
type ContainerProps = { children: React.ReactNode; px: string };
const Container = ({ children, px = 'px-2 md:px-72' }: ContainerProps) => {
	return <div className='px-2 md:px-72'>{children}</div>;
};
export default Container;