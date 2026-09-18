import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import BlogPostClientPage from './BlogPostClientPage';
import { JsonLd } from '@/components/seo/json-ld';
import {
  constructMetadata,
  getArticleSchema,
  getBreadcrumbSchema,
  siteConfig,
} from '@/lib/seo';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }));
}

// Generate metadata for SEO
export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params;
  const slugArray = params.slug ?? [];
  if (slugArray.length === 0) {
    return { title: 'Post Not Found' };
  }
  const slug = slugArray.join('/');
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const path = `/blog/${post.slug}`;

  return constructMetadata({
    title: post.title,
    description: post.excerpt || `Read ${post.title} on Sharukh Rahman's technical blog.`,
    path,
    type: 'article',
    publishedTime: post.date,
    tags: post.tags,
    authors: [siteConfig.author],
    image: post.coverImage,
  });
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  const slugArray = params.slug ?? [];
  if (slugArray.length === 0) {
    notFound();
  }
  const slug = slugArray.join('/');
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  const allPosts = await getAllPosts();
  const path = `/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={[
          getArticleSchema({
            title: post.title,
            description: post.excerpt,
            path,
            datePublished: post.date,
            tags: post.tags,
            coverImage: post.coverImage,
            coverImageAlt: post.coverImageAlt,
            readingTime: post.readingTime,
          }),
          getBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: post.title, href: path },
          ]),
        ]}
      />
      <BlogPostClientPage post={post} allPosts={allPosts} />
    </>
  );
}
