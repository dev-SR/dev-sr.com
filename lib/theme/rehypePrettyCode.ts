import { Options } from 'rehype-pretty-code';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('lib/theme/moonlight-ii.json');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const jsonData = JSON.parse(fileContent);

// https://delba.dev/blog/next-blog-build-time-syntax-highlighting
export const rehypePrettyCodeOptions: Options = {
	// use a prepackaged theme
	// theme: {
	// 	dark: 'one-dark-pro',
	// 	light: 'solarized-light'
	// },
	theme: jsonData,
	keepBackground: false,
	onVisitLine(node) {
		// Prevent lines from collapsing in `display: grid` mode, and allow empty
		// lines to be copy/pasted
		if (node.children.length === 0) {
			node.children = [{ type: 'text', value: ' ' }];
		}
	},
	onVisitHighlightedLine(node) {
		node.properties.className?.push('line--highlighted');
	},
	onVisitHighlightedChars(node) {
		node.properties.className = ['word--highlighted'];
	}
};
/*
export type Theme =
  | 'css-variables'
  | 'dark-plus'
  | 'dracula-soft'
  | 'dracula'
  | 'github-dark-dimmed'
  | 'github-dark'
  | 'github-light'
  | 'hc_light'
  | 'light-plus'
  | 'material-theme-darker'
  | 'material-theme-lighter'
  | 'material-theme-ocean'
  | 'material-theme-palenight'
  | 'material-theme'
  | 'min-dark'
  | 'min-light'
  | 'monokai'
  | 'nord'
  | 'one-dark-pro'
  | 'poimandres'
  | 'rose-pine-dawn'
  | 'rose-pine-moon'
  | 'rose-pine'
  | 'slack-dark'
  | 'slack-ochin'
  | 'solarized-dark'
  | 'solarized-light'
  | 'vitesse-dark'
  | 'vitesse-light'

*/
