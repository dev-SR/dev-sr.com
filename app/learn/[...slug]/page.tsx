import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllLearnSlugs,
  getLearnCourseNav,
  getLearnNeighbors,
  getLearnPage,
} from '@/lib/learn';
import { JsonLd } from '@/components/seo/json-ld';
import {
  constructMetadata,
  getBreadcrumbSchema,
  getCourseLessonSchema,
} from '@/lib/seo';
import { LearnArticleClient } from './LearnArticleClient';

interface LearnSlugPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllLearnSlugs();
  return slugs.map((slug) => ({
    slug: slug.split('/'),
  }));
}

export async function generateMetadata(props: LearnSlugPageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = (params.slug ?? []).join('/');
  const page = await getLearnPage(slug);

  if (!page) {
    return { title: 'Page Not Found' };
  }

  const path = `/learn/${page.slug}`;
  const courseLabel = page.courseSlug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return constructMetadata({
    title: page.title,
    description:
      page.description ||
      `${page.title} — part of the ${courseLabel} course on Sharukh Rahman's Learn hub.`,
    path,
    tags: [courseLabel, page.badge].filter((value): value is string => Boolean(value)),
  });
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

  const path = `/learn/${page.slug}`;
  const courseTitle = courseNav?.title;
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Learn', href: '/learn' },
    {
      name: courseTitle ?? page.courseSlug,
      href: courseNav?.href ?? `/learn/${page.courseSlug}`,
    },
  ];

  if (page.slug !== page.courseSlug) {
    crumbs.push({ name: page.title, href: path });
  }

  return (
    <>
      <JsonLd
        data={[
          getCourseLessonSchema({
            title: page.title,
            description: page.description,
            path,
            courseSlug: page.courseSlug,
            courseTitle,
            badge: page.badge,
          }),
          getBreadcrumbSchema(crumbs),
        ]}
      />
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
    </>
  );
}
