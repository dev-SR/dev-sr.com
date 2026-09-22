import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { caveat, firaCode, greycliff, inter } from '@/lib/fonts';
import { ThemeProvider } from '@/components/theme-provider';
import SmoothScrollProvider from '@/components/smooth-scroll-provider';
import SiteSplash from '@/components/site-splash';
import { JsonLd } from '@/components/seo/json-ld';
import {
  constructMetadata,
  getOrganizationSchema,
  getPersonSchema,
  getWebSiteSchema,
  siteConfig,
} from '@/lib/seo';

export const metadata: Metadata = {
  ...constructMetadata(),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
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
      className={cn(inter.variable, greycliff.variable, firaCode.variable, caveat.variable)}>
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
        <JsonLd data={[getPersonSchema(), getWebSiteSchema(), getOrganizationSchema()]} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
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
