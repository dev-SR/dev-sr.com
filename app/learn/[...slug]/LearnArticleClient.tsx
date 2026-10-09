'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { ArrowLeft, ArrowRight, FileCode2 } from 'lucide-react';
import type { LearnNavNode, LearnNeighbor, LearnPage } from '@/lib/learn';
import Header from '@/components/Header';
import { PageTopGlow } from '@/components/page-top-glow';
import { CompactTableOfContents, TableOfContents } from '@/components/table-of-contents';
import { DocsSidebar } from '@/components/learn/docs-sidebar';
import { LearnFloatingNav } from '@/components/learn/learn-floating-nav';
import { Card, CardContent } from '@/components/ui/card';
import { MdxContentSkeleton } from '@/components/loading-skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const LearnMdxRenderer = dynamic(
  () => import('@/components/learn/learn-mdx-renderer').then((mod) => mod.LearnMdxRenderer),
  {
    ssr: false,
    loading: () => <MdxContentSkeleton />,
  }
);

interface LearnArticleClientProps {
  page: LearnPage;
  courseNav: LearnNavNode | null;
  previous: LearnNeighbor | null;
  next: LearnNeighbor | null;
}

export function LearnArticleClient({
  page,
  courseNav,
  previous,
  next,
}: LearnArticleClientProps) {
  const transitionSlug = page.slug.replace(/[^a-zA-Z0-9_-]/g, '-');
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="relative bg-background">
      <PageTopGlow />
      <Header />
      <div className="mx-auto mt-28 px-4 pb-16 sm:px-6 lg:px-16">
        <div className="grid items-start gap-8 2xl:grid-cols-[20rem_minmax(0,1fr)_22rem]">
          <div className="sticky top-28 hidden 2xl:block">
            {courseNav && <DocsSidebar course={courseNav} />}
          </div>

          <article className="min-w-0">
            <header className="mb-8 border-b border-border/60 pb-6">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  <Link
                    href="/learn"
                    transitionTypes={['nav-back']}
                    className="hover:text-foreground">
                    Learn
                  </Link>
                  <span className="mx-2">/</span>
                  <Link
                    href={`/learn/${page.courseSlug}`}
                    transitionTypes={['nav-back']}
                    className="hover:text-foreground">
                    {page.courseSlug.replace(/-/g, ' ')}
                  </Link>
                </p>
                <Link
                  href={`/raw/learn/${page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <FileCode2 className="size-3.5" />
                  Raw
                </Link>
              </div>
              <ViewTransition name={`learn-title-${transitionSlug}`} share="post-title">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {page.title}
                </h1>
              </ViewTransition>
              {page.excerpt && (
                <ViewTransition name={`learn-excerpt-${transitionSlug}`} share="post-excerpt">
                  <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                    {page.excerpt}
                  </p>
                </ViewTransition>
              )}
            </header>

            <div className="prose prose-lg max-w-none mdx-content learn-content">
              <LearnMdxRenderer mdxSource={page.mdxSource} />
            </div>

            <div className="mt-12 grid gap-4 border-t border-border/60 pt-8 md:grid-cols-2">
              {previous ? (
                <Card className="group hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowLeft className="size-4" />
                      Previous
                    </div>
                    <Link
                      href={previous.href}
                      transitionTypes={['nav-back']}
                      className="font-medium group-hover:text-accent">
                      {previous.title}
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div />
              )}
              {next && (
                <Card className="group hover:shadow-md md:col-start-2">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-end gap-2 text-sm text-muted-foreground">
                      Next
                      <ArrowRight className="size-4" />
                    </div>
                    <Link
                      href={next.href}
                      transitionTypes={['nav-forward']}
                      className="block text-right font-medium group-hover:text-accent">
                      {next.title}
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </article>

          <aside className="sticky top-28 hidden 2xl:block">
            <TableOfContents className="mb-0" />
          </aside>
        </div>
      </div>

      {courseNav && (
        <Sheet open={chaptersOpen} onOpenChange={setChaptersOpen}>
          <SheetContent side="left" className="w-[min(100vw-2rem,20rem)] p-0">
            <SheetHeader className="border-b border-border px-4 py-3 text-left">
              <SheetTitle className="text-base">{courseNav.title}</SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100vh-4rem)] p-3">
              <DocsSidebar course={courseNav} />
            </div>
          </SheetContent>
        </Sheet>
      )}

      <Sheet open={tocOpen} onOpenChange={setTocOpen}>
        <SheetContent side="right" className="w-[min(100vw-2rem,20rem)] p-0">
          <SheetHeader className="border-b border-border px-4 py-3 text-left">
            <SheetTitle className="text-base">On this page</SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4" data-lenis-prevent>
            <CompactTableOfContents
              className="mb-0 [&_h3]:hidden [&_[role=navigation]]:max-h-[calc(100vh-8rem)]"
              onNavigate={() => setTocOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <LearnFloatingNav
        hasCourseNav={Boolean(courseNav)}
        onOpenChapters={() => setChaptersOpen(true)}
        onOpenToc={() => setTocOpen(true)}
      />
    </div>
  );
}
