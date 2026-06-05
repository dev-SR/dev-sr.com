import type { BlogPost } from '@/lib/mdx';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition } from 'react';

interface BlogPostPreviewCardProps {
  post: BlogPost;
  variant?: 'index' | 'landing';
  priority?: boolean;
}

export function BlogPostPreviewCard({
  post,
  variant = 'index',
  priority = false,
}: BlogPostPreviewCardProps) {
  const isLanding = variant === 'landing';
  const postHref = `/blog/${post.slug}`;
  const transitionSlug = post.slug.replace(/[^a-zA-Z0-9_-]/g, '-');
  const transitionPrefix = isLanding ? 'landing-post' : 'post';

  return (
    <Card
      className={`reveal-on-scroll group h-full gap-0 overflow-hidden py-0 border-white/10 bg-card/55 transition-all duration-500 hover:-translate-y-1 hover:border-[#F08F87]/35 hover:bg-card/75 hover:shadow-2xl ${
        isLanding ? 'md:grid md:grid-cols-[15rem_minmax(0,1fr)]' : ''
      }`}>
      {post.coverImage ? (
        <Link
          href={postHref}
          transitionTypes={['post-open']}
          className={`relative block w-full overflow-hidden ${
            isLanding ? 'min-h-44 md:h-full md:min-h-full' : 'h-44 shrink-0'
          }`}>
          <ViewTransition name={`${transitionPrefix}-cover-${transitionSlug}`} share="post-cover">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt ?? post.title}
              fill
              priority={priority}
              sizes={
                isLanding ? '(min-width: 768px) 15rem, 100vw' : '(min-width: 768px) 34vw, 100vw'
              }
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </ViewTransition>
          <div className="pointer-events-none absolute inset-0 bg-black/10" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-card/75" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card via-card/65 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 shadow-[inset_0_-22px_24px_-18px_rgba(0,0,0,0.7)]" />
        </Link>
      ) : (
        <div
          className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-[#121923] ${
            isLanding
              ? 'min-h-44 border-b border-white/5 md:h-full md:min-h-full md:border-b-0 md:border-r'
              : 'h-44 border-b border-white/5'
          }`}>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(172,197,211,0.08),transparent_45%,rgba(240,143,135,0.08))]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-card via-card/65 to-transparent" />
          <span className="relative flex size-12 items-center justify-center rounded-md border border-white/10 bg-background/25 text-[#ACC5D3]">
            <ImageIcon className="size-5" />
          </span>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col py-6">
        <CardHeader className={isLanding ? 'pb-3' : undefined}>
          <ViewTransition name={`${transitionPrefix}-title-${transitionSlug}`} share="post-title">
            <CardTitle
              className={`${isLanding ? 'text-2xl' : 'text-xl'} leading-tight transition-colors group-hover:text-[#F08F87]`}>
              <Link href={postHref} transitionTypes={['post-open']}>
                {post.title}
              </Link>
            </CardTitle>
          </ViewTransition>
          {post.excerpt && (
            <ViewTransition
              name={`${transitionPrefix}-excerpt-${transitionSlug}`}
              share="post-excerpt">
              <CardDescription className="mt-2 line-clamp-3 leading-6">
                {post.excerpt}
              </CardDescription>
            </ViewTransition>
          )}
          <ViewTransition name={`${transitionPrefix}-meta-${transitionSlug}`} share="post-meta">
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
            </div>
          </ViewTransition>
        </CardHeader>

        <CardContent className="mt-auto">
          <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
            {post.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="bg-background/15 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
