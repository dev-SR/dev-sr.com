import type { MetadataRoute } from 'next';
import { getAllLearnSlugs } from '@/lib/learn';
import { getAllPosts } from '@/lib/mdx';
import { siteConfig } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, learnSlugs] = await Promise.all([getAllPosts(), getAllLearnSlugs()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/learn`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/tools/path-visualizer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const learnRoutes: MetadataRoute.Sitemap = learnSlugs.map((slug) => ({
    url: `${siteConfig.url}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...learnRoutes];
}
