import './globals.css';
import { IBM_Plex_Sans } from 'next/font/google';
import { ThemeProvider } from '~/components/theme-provider';
import TopNavBar from '~/components/TopNavBar';
import { Analytics } from '~/components/analytics';

const ibm_plex = IBM_Plex_Sans({
	weight: ['100', '200', '300', '400', '500', '600', '700'],
	subsets: ['latin']
});

export const metadata = {
	title: "Dev-SR' Log",
	description:
		'Hi, this is Sharukh Rahman. Join me in exploring the realms of programming and machine learning as I meticulously document my learning journey and insights in this blog.'
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang='en'>
			<body
				className={`${ibm_plex.className} antialiased min-h-screen bg-[url('bg-white.svg')] dark:bg-[url('bg-black.svg')] bg-center bg-repeat bg-auto `}>
				<ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
					<div className='flex flex-col'>
						<TopNavBar />
						<main>{children}</main>
					</div>
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	);
}
