import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllLearnPages,
  getLearnCourseNav,
  getLearnNeighbors,
  getLearnPage,
} from '@/lib/learn';
import { LearnArticleClient } from './LearnArticleClient';

interface LearnSlugPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const pages = await getAllLearnPages();
  return pages.map((page) => ({
    slug: page.slug.split('/'),
  }));
}

export async function generateMetadata(props: LearnSlugPageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = (params.slug ?? []).join('/');
  const page = await getLearnPage(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: `${page.title} | Learn`,
    description: page.description,
  };
}

export default async function LearnSlugPage(props: LearnSlugPageProps) {
  const params = await props.params;
  const slug = (params.slug ?? []).join('/');

  if (!slug) {
    notFound();
  }

  const page = await getLearnPage(slug);
  if (!page) {
    notFound();
  }

  const [courseNav, neighbors] = await Promise.all([
    getLearnCourseNav(page.courseSlug),
    getLearnNeighbors(slug),
  ]);

  return (
    <LearnArticleClient
      page={{
        slug: page.slug,
        title: page.title,
        description: page.description,
        icon: page.icon,
        order: page.order,
        badge: page.badge,
        content: page.content,
        mdxSource: page.mdxSource,
        path: page.path,
        courseSlug: page.courseSlug,
      }}
      courseNav={courseNav}
      previous={neighbors.previous}
      next={neighbors.next}
    />
  );
}
