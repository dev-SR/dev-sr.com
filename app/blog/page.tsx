import { getAllPosts, discoverMDXFiles, toBlogNavTree } from '@/lib/mdx';
import { getBestTopics, getPopularPosts } from '@/lib/home';
import { BlogTreeNavigation } from '@/components/blog-tree';
import { BlogTopicCard, PopularPostCard } from '@/components/ui/blog-index-cards';
import { Calendar, TrendingUp, Star } from 'lucide-react';
import Header from '@/components/Header';
import { PageTopGlow } from '@/components/page-top-glow';
import { BlogPostPreviewCard } from '@/components/blog-post-preview-card';
import { JsonLd } from '@/components/seo/json-ld';
import { constructMetadata, getCollectionPageSchema } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = constructMetadata({
  title: 'Technical Blog & Engineering Notes',
  description:
    'Explore technical articles, mathematical concepts, and development insights through interactive MDX content by Sharukh Rahman.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getAllPosts();
  const tree = await discoverMDXFiles();

  const recentPosts = posts.slice(0, 5);
  const popularPosts = getPopularPosts(posts, 5);
  const bestTopics = getBestTopics(posts, 6);

  return (
    <div className="relative bg-background">
      <JsonLd
        data={getCollectionPageSchema({
          title: 'Technical Blog & Engineering Notes',
          description:
            'Explore technical articles, mathematical concepts, and development insights through interactive MDX content by Sharukh Rahman.',
          path: '/blog',
        })}
      />
      <PageTopGlow />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-28">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore technical articles, mathematical concepts, and development insights through
            interactive content with advanced MDX features.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Tree Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BlogTreeNavigation tree={toBlogNavTree(tree)} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Recent Posts */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Recent Posts</h2>
              </div>
              <div className="reveal-stagger grid gap-6 md:grid-cols-2">
                {recentPosts.map((post, index) => (
                  <BlogPostPreviewCard key={post.slug} post={post} priority={index === 0} />
                ))}
              </div>
            </section>

            {/* Popular Posts */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Popular Posts</h2>
              </div>
              <div className="reveal-stagger space-y-4">
                {popularPosts.map((post, index) => (
                  <PopularPostCard key={post.slug} post={post} rank={index + 1} />
                ))}
              </div>
            </section>

            {/* Best Topics */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Best Topics</h2>
              </div>
              <div className="reveal-stagger grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bestTopics.map(([topic, count]) => (
                  <BlogTopicCard key={topic} topic={topic} count={count} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
