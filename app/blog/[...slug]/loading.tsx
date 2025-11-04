import Header from '@/components/Header';
import { BlogPostSkeleton } from '@/components/loading-skeleton';

export default function Loading() {
  return (
    <div className="bg-background">
      <Header />
      <div className="bg-card/50 border-b border-border mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl">
            <div className="h-4 w-24 bg-muted rounded mb-4" />
            <div className="h-12 bg-muted rounded w-3/4 mb-4" />
            <div className="h-6 bg-muted rounded w-full mb-6" />
            <div className="flex flex-wrap items-center gap-6">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-16 bg-muted rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <BlogPostSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
