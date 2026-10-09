import type { BlogPost } from '@/lib/mdx';

/** Prefer cover images, then longer reads, then newer dates — stable across SSR. */
export function getPopularPosts(posts: BlogPost[], limit = 5): BlogPost[] {
  return [...posts]
    .sort((a, b) => {
      const coverDiff = Number(Boolean(b.coverImage)) - Number(Boolean(a.coverImage));
      if (coverDiff !== 0) return coverDiff;

      const readDiff = (b.readingTime ?? 0) - (a.readingTime ?? 0);
      if (readDiff !== 0) return readDiff;

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

export function getBestTopics(
  posts: BlogPost[],
  limit = 6
): Array<[topic: string, count: number]> {
  const topicCounts = posts.reduce(
    (acc, post) => {
      post.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);
}
