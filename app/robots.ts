import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const sitemap = `${siteConfig.url}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Applebot',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'DuckDuckBot',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      // AI / LLM crawlers — allow content for citation and answer engines
      {
        userAgent: 'GPTBot',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Bytespider',
        allow: ['/', '/api/og'],
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap,
    host: siteConfig.url,
  };
}
