import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { firaCode, greycliff, inter } from '@/lib/fonts';
import { ThemeProvider } from '@/components/theme-provider';
import SmoothScrollProvider from '@/components/smooth-scroll-provider';
import SiteSplash from '@/components/site-splash';

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
  return (
    // moved font var classes to html so CSS can consume them immediately
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, greycliff.variable, firaCode.variable)}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var k='devsr:splash:v4';var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||window.localStorage.getItem(k)){var s=document.createElement('style');s.id='site-splash-guard';s.textContent='.site-splash{display:none!important}';document.head.appendChild(s)}}catch(e){}",
          }}
        />
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
