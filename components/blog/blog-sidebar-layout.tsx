'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import type { LearnNavNode } from '@/lib/learn';
import { DocsSidebar } from '@/components/learn/docs-sidebar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface BlogSidebarLayoutProps {
  nav: LearnNavNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
  showAside?: boolean;
  className?: string;
}

export function BlogSidebarLayout({
  nav,
  children,
  aside,
  showAside = false,
  className,
}: BlogSidebarLayoutProps) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
          All posts
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Menu className="size-4" />
              Topics
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100vw-2rem,20rem)] p-0">
            <SheetHeader className="border-b border-border px-4 py-3 text-left">
              <SheetTitle className="text-base">{nav.title}</SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100vh-4rem)] p-3">
              <DocsSidebar course={nav} rootLabel="Blog" />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div
        className={cn(
          'grid gap-8',
          showAside
            ? 'lg:grid-cols-[16rem_minmax(0,1fr)_12rem] xl:grid-cols-[17rem_minmax(0,1fr)_13rem]'
            : 'lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]'
        )}>
        <div className="hidden lg:block">
          <div className="sticky top-28 h-[calc(100vh-8rem)]">
            <DocsSidebar course={nav} rootLabel="Blog" />
          </div>
        </div>

        {children}

        {showAside && aside ? (
          <aside className="hidden lg:block">
            <div className="sticky top-28">{aside}</div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
