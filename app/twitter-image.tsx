import { createOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og-card';
import { siteConfig } from '@/lib/seo';

export const alt = siteConfig.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return createOgImage({
    title: siteConfig.title,
    description: siteConfig.description,
    eyebrow: 'Portfolio · Blog · Learn',
    tags: ['Data Science', 'Software Engineering', 'Applied ML', 'System Design'],
    footerLeft: siteConfig.author,
    footerRight: 'Open to ML / SWE roles',
  });
}
