import Header from '@/components/Header';
import { BlogCardSkeleton } from '@/components/loading-skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-28">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-10 w-32 bg-muted rounded mb-4" />
          <div className="h-6 bg-muted rounded w-2/3 max-w-2xl" />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tree Navigation Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="pl-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Recent Posts Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-5 bg-muted rounded" />
                <div className="h-8 bg-muted rounded w-48" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            </section>

            {/* Popular Posts Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-5 bg-muted rounded" />
                <div className="h-8 bg-muted rounded w-48" />
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-muted rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-muted rounded w-3/4" />
                          <div className="flex items-center gap-4">
                            <div className="h-4 bg-muted rounded w-20" />
                            <div className="h-4 bg-muted rounded w-24" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Best Topics Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-5 w-5 bg-muted rounded" />
                <div className="h-8 bg-muted rounded w-48" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="h-5 bg-muted rounded w-24" />
                        <div className="h-5 bg-muted rounded w-16" />
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
