import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.siteName,
    short_name: 'dev-sr',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: siteConfig.brandColors.dark,
    theme_color: siteConfig.brandColors.dark,
    lang: siteConfig.language,
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
