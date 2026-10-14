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
import { MdxExcerpt } from '@/components/mdx/excerpt';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MdxContentSkeleton } from '@/components/loading-skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const MdxRenderer = dynamic(
  () => import('@/components/mdx/renderer').then((mod) => mod.MdxRenderer),
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
      <div className="mx-auto mt-28 max-w-[100rem] px-4 pb-20 sm:px-6 lg:px-10 xl:px-12">
        {/*
          Mobile: 1 col (article)
          lg: 2 col — article | TOC
          2xl: 3 col — chapters | article | TOC
          Hidden asides use display:none so they don't occupy tracks.
        */}
        <div className="grid items-start gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,1fr)_16rem] 2xl:grid-cols-[18rem_minmax(0,1fr)_18rem]">
          <aside className="sticky top-28 hidden self-start 2xl:block">
            {courseNav && <DocsSidebar course={courseNav} />}
          </aside>

          <article className="min-w-0">
            <header className="mb-10 border-b border-border/60 pb-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="min-w-0">
                  <ViewTransition name={`learn-title-${transitionSlug}`} share="post-title">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      {page.title}
                    </h1>
                  </ViewTransition>
                  {page.excerptMdxSource && (
                    <ViewTransition name={`learn-excerpt-${transitionSlug}`} share="post-excerpt">
                      <MdxExcerpt
                        mdxSource={page.excerptMdxSource}
                        className="mt-3 max-w-3xl text-md font-light leading-relaxed text-muted-foreground"
                      />
                    </ViewTransition>
                  )}
                </div>

                {(page.badge || (page.tags && page.tags.length > 0)) && (
                  <div className="flex flex-wrap gap-2 lg:justify-end lg:pb-1">
                    {page.badge && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {page.badge}
                      </Badge>
                    )}
                    {page.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </header>

            <div className="prose prose-lg max-w-none mdx-content learn-content">
              <MdxRenderer mdxSource={page.mdxSource} variant="learn" />
            </div>

            <div className="mt-12 grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2">
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
                <Card className="group hover:shadow-md sm:col-start-2">
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

          <aside className="sticky top-28 hidden self-start lg:block">
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
