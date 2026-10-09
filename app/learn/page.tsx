import Header from '@/components/Header';
import { PageTopGlow } from '@/components/page-top-glow';
import { LearnHub } from '@/components/learn/learn-hub';
import { JsonLd } from '@/components/seo/json-ld';
import { getLearnCatalog } from '@/lib/learn';
import { constructMetadata, getCourseCatalogSchema } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = constructMetadata({
  title: 'Interactive System Design & Engineering Guides',
  description:
    'Hands-on courses on Domain-Driven Design, .NET Aspire, Minimal APIs, GSAP with React, and more — interactive engineering notes by Sharukh Rahman.',
  path: '/learn',
});

export default async function LearnPage() {
  const catalog = await getLearnCatalog();

  return (
    <div className="relative bg-background">
      <JsonLd
        data={getCourseCatalogSchema(
          catalog.courses.map((course) => ({
            title: course.title,
            description: course.excerpt,
            href: course.href,
          }))
        )}
      />
      <PageTopGlow />
      <Header />
      <LearnHub courses={catalog.courses} lessons={catalog.lessons} />
    </div>
  );
}
