import { Fira_Code, Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const greycliff = localFont({
  src: [
    { path: '../app/fonts/greycliff/GreycliffCF-Medium.woff2', weight: '500' },
    { path: '../app/fonts/greycliff/GreycliffCF-Bold.woff2', weight: '700' },
    { path: '../app/fonts/greycliff/GreycliffCF-ExtraBold.woff2', weight: '800' },
  ],
  variable: '--font-greycliff',
  display: 'swap',
});

export const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
  display: 'swap',
});
