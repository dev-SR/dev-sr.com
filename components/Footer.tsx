'use client';
import { BsFacebook, BsInstagram, BsLinkedin, BsGithub, BsYoutube } from 'react-icons/bs';
const navigation = {
	main: [
		{ name: 'About', href: '#' },
		{ name: 'Blogs', href: '#' },
		{ name: 'Publications', href: '#' },
		{ name: 'Projects', href: '#' }
	],
	social: [
		{
			name: 'Facebook',
			href: 'https://www.facebook.com/soikat.x/',
			icon: (props: React.SVGProps<SVGSVGElement>) => <BsFacebook {...props} />
		},
		{
			name: 'Linkedin',
			href: 'https://www.linkedin.com/in/sharukh-rahman/',
			icon: (props: React.SVGProps<SVGSVGElement>) => <BsLinkedin {...props} />
		},
		{
			name: 'GitHub',
			href: 'https://github.com/dev-SR',
			icon: (props: React.SVGProps<SVGSVGElement>) => <BsGithub {...props} />
		},
		{
			name: 'YouTube',
			href: '#',
			icon: (props: React.SVGProps<SVGSVGElement>) => <BsYoutube {...props} />
		},
		{
			name: 'Instagram',
			href: '#',
			icon: (props: React.SVGProps<SVGSVGElement>) => <BsInstagram {...props} />
		}
	]
};

export default function Footer() {
	return (
		<footer className='grid grid-cols-12 w-full  bg-card mt-10 border-t border-border z-10'>
			<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
			<div className='col-span-10 sm:col-span-10 md:col-span-8'>
				<div className='mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8'>
					<nav
						className='-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12'
						aria-label='Footer'>
						{navigation.main.map((item) => (
							<div key={item.name} className='pb-6'>
								<a
									href={item.href}
									className='text-sm leading-6 text-foreground/50 hover:text-foreground/80'>
									{item.name}
								</a>
							</div>
						))}
					</nav>
					<div className='mt-10 flex justify-center space-x-10'>
						{navigation.social.map((item) => (
							<a
								key={item.name}
								href={item.href}
								target='_blank'
								className='text-foreground/50 hover:text-foreground/80'>
								<span className='sr-only'>{item.name}</span>
								<item.icon className='h-6 w-6' aria-hidden='true' />
							</a>
						))}
					</div>
					<p className='mt-10 text-center text-xs leading-5 text-foreground/50'>
						&copy; 2023 Sharukh Rahman —— Dhaka.
					</p>
				</div>
			</div>
			<div className='col-span-1 sm:col-span-1 md:col-span-2'></div>
		</footer>
	);
}
