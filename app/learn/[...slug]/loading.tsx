import Header from '@/components/Header';
import { MdxContentSkeleton } from '@/components/loading-skeleton';
import { ViewTransition } from 'react';

export default function Loading() {
  return (
    <div className="relative bg-background">
      <Header />
      <div className="mx-auto mt-28 px-4 pb-16 sm:px-6 lg:px-16">
        <ViewTransition enter="post-loader-in" exit="post-loader-out" default="none">
          <div className="grid items-start gap-8 lg:grid-cols-[20rem_minmax(0,1fr)_22rem]">
            <div className="hidden space-y-3 lg:block">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>

            <div className="min-w-0">
              <div className="mb-8 animate-pulse border-b border-border/60 pb-6">
                <div className="mb-3 h-4 w-40 rounded bg-muted" />
                <div className="mb-3 h-10 w-3/4 rounded bg-muted" />
                <div className="h-5 w-full max-w-xl rounded bg-muted" />
              </div>
              <MdxContentSkeleton />
            </div>

            <div className="hidden space-y-2 lg:block">
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}
