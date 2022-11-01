/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
 content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './blog-content/**/*.{md,mdx}'
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
		fontFamily: {
			code: ['Fira Code', 'monospace']
		},
		extend: {
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans]
			},
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-5deg)' },
					'50%': { transform: 'rotate(5deg)' }
				}
			},
			animation: {
				wiggle: 'wiggle .5s ease-in-out infinite'
			}
		}
  },
  plugins: [],
}
