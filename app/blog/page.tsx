import { getAllPosts, discoverMDXFiles } from '@/lib/mdx';
import { BlogTreeNavigation } from '@/components/blog-tree';
import { BlogTopicCard, PopularPostCard } from '@/components/ui/blog-index-cards';
import { Calendar, TrendingUp, Star } from 'lucide-react';
import Header from '@/components/Header';
import { BlogPostPreviewCard } from '@/components/blog-post-preview-card';

export default async function BlogPage() {
  const posts = await getAllPosts();
  const tree = await discoverMDXFiles();

  // Get recent posts (last 5)
  const recentPosts = posts.slice(0, 5);

  // Get popular posts (mock data - in real app this would come from analytics)
  const popularPosts = posts
    .map((post) => ({ ...post, views: Math.floor(Math.random() * 1000) + 100 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Get best topics (most posts per topic)
  const topicCounts = posts.reduce(
    (acc, post) => {
      post.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const bestTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <div className="bg-background">
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
              <BlogTreeNavigation tree={tree} />
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
