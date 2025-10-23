import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import BlogPostClientPage from './BlogPostClientPage';
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

  return {
    title: `${post.title} | Portfolio Blog`,
    description: post.excerpt || `Read ${post.title} on our technical blog`,
    keywords: post.tags?.join(', '),
    authors: [{ name: 'Portfolio Author' }],
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
    },
  };
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
  return <BlogPostClientPage post={post} allPosts={allPosts} />;
}
