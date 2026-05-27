import type { Metadata } from 'next';
import { Roboto, Fira_Code, Nunito } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import SmoothScrollProvider from '@/components/smooth-scroll-provider';
import SiteSplash from '@/components/site-splash';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sharukh Rahman | Portfolio and Technical Blog',
  description:
    'Portfolio, technical writing, interactive notes, and engineering experiments by Sharukh Rahman.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // @ts-ignore
  return (
    // moved font var classes to html so CSS can consume them immediately
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(roboto.variable, firaCode.variable, nunito.variable)}>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SmoothScrollProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <SiteSplash />
            {children}
          </ThemeProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
