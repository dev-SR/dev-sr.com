import { useEffect, useState } from 'react';
const getInitialTheme = () => {
	if (typeof window !== 'undefined' && window.localStorage) {
		const storedPrefs = window.localStorage.getItem('theme');
		if (typeof storedPrefs === 'string') {
			return storedPrefs;
		}

		// const userMedia = window.matchMedia('(prefers-color-scheme: light)');
		// if (userMedia.matches) {
		// 	return 'dark';
		// }
	}

	return 'dark'; // dark theme as the default;
};
export const useDarkMode = () => {
	const [theme, setTheme] = useState(getInitialTheme());
	const colorTheme = theme === 'dark' ? 'light' : 'dark';

	const toggleTheme = () => {
		if (theme === 'dark') {
			localStorage.setItem('theme', 'light');
			setTheme('light');
		} else {
			localStorage.setItem('theme', 'dark');
			setTheme('dark');
		}
	};

	useEffect(() => {
		if (typeof window !== 'undefined' && window.localStorage) {
			const root = window.document.documentElement;
			root.classList.remove(colorTheme);
			root.classList.add(theme);
			localStorage.setItem('theme', theme);
		}
	}, [theme, colorTheme]);

	return {
		theme: colorTheme,
		setTheme: toggleTheme
	};
};
