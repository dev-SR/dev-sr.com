'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Menu } from 'lucide-react';
import type { LearnNavNode, LearnNeighbor, LearnPage } from '@/lib/learn';
import Header from '@/components/Header';
import { PageTopGlow } from '@/components/page-top-glow';
import { TableOfContents } from '@/components/table-of-contents';
import { DocsSidebar } from '@/components/learn/docs-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MdxContentSkeleton } from '@/components/loading-skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
  return (
    <div className="relative bg-background">
      <PageTopGlow />
      <Header />
      <div className="mx-auto mt-28 max-w-420 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <Link href="/learn" className="text-sm text-muted-foreground hover:text-foreground">
            All courses
          </Link>
          {courseNav && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Menu className="size-4" />
                  Chapters
                </Button>
              </SheetTrigger>
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
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[18rem_minmax(0,1fr)_22rem]">
          <div className="sticky top-28 hidden lg:block">
            {courseNav && <DocsSidebar course={courseNav} />}
          </div>

          <article className="min-w-0">
            <header className="mb-8 border-b border-border/60 pb-6">
              <p className="mb-2 text-sm text-muted-foreground">
                <Link href="/learn" className="hover:text-foreground">
                  Learn
                </Link>
                <span className="mx-2">/</span>
                <Link href={`/learn/${page.courseSlug}`} className="hover:text-foreground">
                  {page.courseSlug.replace(/-/g, ' ')}
                </Link>
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {page.title}
              </h1>
              {page.description && (
                <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  {page.description}
                </p>
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
                    <Link href={previous.href} className="font-medium group-hover:text-accent">
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
                      className="block text-right font-medium group-hover:text-accent">
                      {next.title}
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </article>

          <aside className="sticky top-28 hidden lg:block">
            <TableOfContents className="mb-0" />
          </aside>
        </div>
      </div>
    </div>
  );
}
