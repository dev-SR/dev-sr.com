import type { BlogPost } from '@/lib/mdx';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Clock, Eye, Hash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PopularPostCardProps {
  post: BlogPost & { views: number };
  rank: number;
}

export function PopularPostCard({ post, rank }: PopularPostCardProps) {
  return (
    <Card className="reveal-on-scroll group gap-0 overflow-hidden border-white/10 bg-card/45 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ACC5D3]/35 hover:bg-card/70 hover:shadow-lg">
      <Link
        href={`/blog/${post.slug}`}
        transitionTypes={['post-open']}
        className="flex min-h-24 items-stretch">
        {post.coverImage && (
          <div className="relative hidden w-28 shrink-0 overflow-hidden sm:block">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt ?? post.title}
              fill
              sizes="7rem"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent to-card/75" />
          </div>
        )}

        <CardContent className="flex min-w-0 flex-1 items-center gap-4 p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[#F08F87]/25 bg-[#F08F87]/10 font-mono text-xs font-bold text-[#F08F87]">
            {String(rank).padStart(2, '0')}
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-[#ACC5D3]">
              {post.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Eye className="size-3.5" />
                {post.views.toLocaleString()} views
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {post.readingTime} min read
              </span>
            </div>
          </div>

          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ACC5D3]" />
        </CardContent>
      </Link>
    </Card>
  );
}

interface BlogTopicCardProps {
  topic: string;
  count: number;
}

export function BlogTopicCard({ topic, count }: BlogTopicCardProps) {
  return (
    <Card className="reveal-on-scroll group gap-0 border-white/10 bg-card/45 py-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F08F87]/30 hover:bg-card/70 hover:shadow-md">
      <CardContent className="flex min-h-24 items-center gap-3 p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[#ACC5D3]/25 bg-[#ACC5D3]/10 text-[#ACC5D3]">
          <Hash className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-semibold capitalize leading-snug text-foreground transition-colors group-hover:text-[#F08F87]">
            {topic.replace(/-/g, ' ')}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">Topic collection</p>
        </div>
        <Badge variant="outline" className="shrink-0 border-white/10 bg-background/20 text-xs">
          {count}
        </Badge>
      </CardContent>
    </Card>
  );
}
