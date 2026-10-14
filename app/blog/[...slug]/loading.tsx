import Header from '@/components/Header';
import { BlogPostSkeleton } from '@/components/loading-skeleton';
import { ViewTransition } from 'react';

export default function Loading() {
  return (
    <div className="bg-background">
      <Header />
      <ViewTransition enter="post-loader-in" exit="post-loader-out" default="none">
        <section className="relative -mt-14 min-h-[38rem] overflow-hidden border-b border-border bg-card/50 sm:min-h-[42rem]">
          <div className="absolute inset-0 animate-pulse bg-linear-to-b from-muted/55 via-card/40 to-background" />
          <div className="absolute inset-x-0 bottom-0 h-72 bg-linear-to-t from-background via-background/90 to-transparent" />
          <div className="relative z-10 mx-auto flex min-h-[38rem] max-w-7xl items-end px-4 pb-12 pt-40 sm:min-h-[42rem] sm:px-6 sm:pb-16 lg:px-8">
            <div className="w-full max-w-4xl animate-pulse">
              <div className="mb-4 h-4 w-24 rounded bg-muted" />
              <div className="mb-4 h-12 w-3/4 rounded bg-muted" />
              <div className="mb-6 h-6 w-full rounded bg-muted" />
              <div className="flex flex-wrap items-center gap-6">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-4 w-32 rounded bg-muted" />
              </div>
            </div>
          </div>
        </section>
      </ViewTransition>

      <div className="mx-auto max-w-420 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 2xl:grid-cols-[20rem_minmax(0,1fr)_8rem]">
          <aside className="2xl:sticky 2xl:top-28 2xl:self-start">
            <div className="mb-0 space-y-2 2xl:-ml-3">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          </aside>
          <div className="min-w-0">
            <BlogPostSkeleton />
          </div>
          <div className="hidden 2xl:block" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
