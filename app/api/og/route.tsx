import { getLearnPage } from '@/lib/learn';
import { getPostBySlug } from '@/lib/mdx';
import { createOgImage } from '@/lib/og-card';
import { siteConfig } from '@/lib/seo';

export const runtime = 'nodejs';

function formatCourseLabel(courseSlug: string): string {
  return courseSlug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get('kind') ?? 'site';
  const slug = searchParams.get('slug') ?? '';

  if (kind === 'blog' && slug) {
    const post = await getPostBySlug(slug);
    if (!post) {
      return createOgImage({
        title: 'Post not found',
        description: siteConfig.description,
        eyebrow: 'Blog',
      });
    }

    const readingLabel = post.readingTime ? `${post.readingTime} min read` : undefined;
    const dateLabel = post.date
      ? new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : undefined;

    return createOgImage({
      title: post.title,
      description: post.excerpt,
      eyebrow: 'Blog',
      tags: post.tags,
      footerLeft: siteConfig.author,
      footerRight: [dateLabel, readingLabel].filter(Boolean).join(' · '),
    });
  }

  if (kind === 'learn' && slug) {
    const page = await getLearnPage(slug);
    if (!page) {
      return createOgImage({
        title: 'Lesson not found',
        description: siteConfig.description,
        eyebrow: 'Learn',
      });
    }

    const courseLabel = formatCourseLabel(page.courseSlug);

    return createOgImage({
      title: page.title,
      description: page.description,
      eyebrow: `Learn · ${courseLabel}`,
      tags: [page.badge, courseLabel].filter((value): value is string => Boolean(value)),
      footerLeft: siteConfig.author,
      footerRight: 'Interactive engineering notes',
    });
  }

  return createOgImage({
    title: siteConfig.title,
    description: siteConfig.description,
    eyebrow: 'Portfolio · Blog · Learn',
    tags: ['Data Science', 'Software Engineering', 'Applied ML', 'System Design'],
    footerLeft: siteConfig.author,
    footerRight: 'Open to ML / SWE roles',
  });
}
