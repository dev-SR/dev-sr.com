import Header from '@/components/Header';
import { MdxContentSkeleton } from '@/components/loading-skeleton';
import { ViewTransition } from 'react';

export default function Loading() {
  return (
    <div className="relative bg-background">
      <Header />
      <div className="mx-auto mt-28 max-w-[100rem] px-4 pb-20 sm:px-6 lg:px-10 xl:px-12">
        <ViewTransition enter="post-loader-in" exit="post-loader-out" default="none">
          <div className="grid items-start gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,1fr)_16rem] 2xl:grid-cols-[18rem_minmax(0,1fr)_18rem]">
            <div className="hidden space-y-3 2xl:block">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>

            <div className="min-w-0">
              <div className="mb-10 animate-pulse border-b border-border/60 pb-8">
                <div className="mb-4 h-4 w-40 rounded bg-muted" />
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
                  <div>
                    <div className="mb-3 h-10 w-3/4 rounded bg-muted" />
                    <div className="h-5 w-full max-w-xl rounded bg-muted" />
                  </div>
                  <div className="flex gap-2 lg:justify-end">
                    <div className="h-6 w-16 rounded-full bg-muted" />
                    <div className="h-6 w-14 rounded-full bg-muted" />
                  </div>
                </div>
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
