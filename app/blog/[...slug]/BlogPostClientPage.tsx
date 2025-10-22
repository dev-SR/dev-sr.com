'use client';

import type { BlogPost } from '@/lib/mdx';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Eye, Share2, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';
import { mdxComponents } from '@/components/mdx-components';
import { TableOfContents } from '@/components/table-of-contents';
import Header from '@/components/Header';

interface BlogPostPageProps {
  params: {
    slug: string[];
  };
  post?: BlogPost;
  allPosts: BlogPost[];
}

export default function BlogPostClientPage({ params, post, allPosts }: BlogPostPageProps) {
  // params may be undefined in some edge navigations; avoid using it directly. Use post.slug instead where needed.
  if (!post) {
    // Server page will handle notFound(); on client, render nothing to avoid runtime errors.
    return null;
  }

  // Get related posts (same tags)
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.tags?.some((tag) => post.tags?.includes(tag)))
    .slice(0, 3);

  // Get next/previous posts
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <div className="bg-background">
      <Header />
      <div className="bg-card/50 border-b border-border mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-foreground">{post.title}</span>
            </nav>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{post.title}</h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{post.excerpt}</p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{post.viewCount || 0} views</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blog Content with 30-60-30 Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left sidebar - 30% width - TOC */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </div>

          {/* Main Content - 60% width */}
          <div className="lg:col-span-6">
            <article className="prose prose-lg max-w-none mdx-content">
              {/* Render MDX */}
              {/* Using client variant of MDXRemote with pre-serialized source */}
              {post.mdxSource ? (
                <MDXRemote {...post.mdxSource} components={mdxComponents as any} />
              ) : null}
            </article>

            <div className="mt-12 pt-8 border-t border-border">
              <div className="grid md:grid-cols-2 gap-6">
                {previousPost && (
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <ArrowLeft className="h-4 w-4" />
                        Previous Post
                      </div>
                      <Link
                        href={`/blog/${previousPost.slug}`}
                        className="text-foreground group-hover:text-accent transition-colors">
                        <h3 className="font-medium line-clamp-2">{previousPost.title}</h3>
                      </Link>
                    </CardContent>
                  </Card>
                )}
                {nextPost && (
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                        Next Post
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <Link
                        href={`/blog/${nextPost.slug}`}
                        className="text-foreground group-hover:text-accent transition-colors">
                        <h3 className="font-medium line-clamp-2 text-right">{nextPost.title}</h3>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar - 30% width - Related/Share/Topics */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Share2 className="h-4 w-4" />
                    Share This Post
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      const url = window.location.href;
                      const text = `Check out "${post.title}"`;
                      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                      window.open(twitterUrl, '_blank');
                    }}>
                    Share on Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      const url = window.location.href;
                      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                      window.open(linkedinUrl, '_blank');
                    }}>
                    Share on LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}>
                    Copy Link
                  </Button>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Related Posts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.slug} className="group">
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="block text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                          {relatedPost.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {relatedPost.readingTime} min read
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Topics */}
              {post.tags && post.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-accent/10">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
