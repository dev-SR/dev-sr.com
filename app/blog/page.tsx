import { getAllPosts, discoverMDXFiles } from '@/lib/mdx';
import { BlogTreeNavigation } from '@/components/blog-tree';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

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
              <div className="grid md:grid-cols-2 gap-6">
                {recentPosts.map((post) => (
                  <Card key={post.slug} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="group-hover:text-accent transition-colors">
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </CardTitle>
                          <CardDescription className="mt-2">{post.excerpt}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readingTime} min
                          </div>
                          <time>{new Date(post.date).toLocaleDateString()}</time>
                        </div>
                        <div className="flex gap-1">
                          {post.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Popular Posts */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Popular Posts</h2>
              </div>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <Card key={post.slug} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-accent">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{post.views} views</span>
                            <span>{post.readingTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Best Topics */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Best Topics</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bestTopics.map(([topic, count]) => (
                  <Card
                    key={topic}
                    className="group hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground group-hover:text-accent transition-colors capitalize">
                          {topic.replace(/-/g, ' ')}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {count} post{count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
