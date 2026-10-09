import Header from '@/components/Header';
import { HomeColumnMotion } from '@/components/home/home-column-motion';
import LetterGlitchLeftSide from '@/components/showcase/LetterGlitchLeftSide';
import LetterGlitchRightSide from '@/components/showcase/LetterGlitchRightSide';
import ParallaxWaves from '@/components/showcase/ParallaxWaveBackground';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogTopicCard, PopularPostCard } from '@/components/ui/blog-index-cards';
import { JsonLd } from '@/components/seo/json-ld';
import { getBestTopics, getPopularPosts } from '@/lib/home';
import { getLearnCatalog, type LearnCatalogCourse } from '@/lib/learn';
import { getAllPosts } from '@/lib/mdx';
import { homeStrengths, profile } from '@/lib/profile';
import { constructMetadata, getPersonSchema } from '@/lib/seo';
import {
  ArrowRight,
  Binary,
  BookOpen,
  Boxes,
  BrainCircuit,
  Code2,
  Database,
  Layers3,
  MousePointer2,
  Network,
  Play,
  ScrollText,
  Server,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

const strengthIcons = [BrainCircuit, Binary, Network, Workflow] as const;

const COURSE_ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Boxes,
  Code2,
  Database,
  Layers3,
  MousePointer2,
  Network,
  Play,
  ScrollText,
  Server,
  Sparkles,
};

function courseIcon(name?: string) {
  if (!name) return BookOpen;
  return COURSE_ICON_MAP[name] ?? BookOpen;
}

function featuredCourses(courses: LearnCatalogCourse[], limit = 4) {
  return [...courses].sort((a, b) => b.pageCount - a.pageCount).slice(0, limit);
}

export const metadata: Metadata = constructMetadata({
  path: '/',
});

export default async function App() {
  const [posts, catalog] = await Promise.all([getAllPosts(), getLearnCatalog()]);
  const popularPosts = getPopularPosts(posts, 5);
  const bestTopics = getBestTopics(posts, 6);
  const courses = featuredCourses(catalog.courses, 4);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={getPersonSchema()} />
      <Header />
      <ParallaxWaves />

      <main className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-12">
        <div className="hidden lg:contents">
          <LetterGlitchLeftSide />
        </div>

        <HomeColumnMotion className="relative z-30 w-full -mt-[60vh] lg:col-span-8">
          <section className="relative min-h-[80svh] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <div>
                <Badge
                  variant="outline"
                  className="mb-6 border-[#F08F87]/35 bg-[#F08F87]/10 text-[#F08F87]">
                  {profile.roleLine}
                </Badge>

                <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-4xl">
                  {profile.headline}
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  {profile.bio}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="group">
                    <Link href="/learn" transitionTypes={['nav-forward']}>
                      Learn with me
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-background/40">
                    <Link href="/blog" transitionTypes={['nav-forward']}>
                      Read my blog
                    </Link>
                  </Button>
                </div>
              </div>

              <div>
                <div className="hero-console">
                  <div className="hero-console__bar">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="space-y-5 p-5 sm:p-6">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#ACC5D3]">
                        currently exploring
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-foreground">
                        Applied ML, RAG systems, and production backends.
                      </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="hero-metric">
                        <span>{catalog.courses.length}</span>
                        <p>courses</p>
                      </div>
                      <div className="hero-metric">
                        <span>{catalog.lessons.length}</span>
                        <p>lessons</p>
                      </div>
                      <div className="hero-metric">
                        <span>{posts.length}</span>
                        <p>posts</p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-sm text-muted-foreground">
                      <p>
                        <span className="text-[#F08F87]">const</span> focus = [
                        {profile.focus.map((item, index) => (
                          <span key={item}>
                            {index > 0 ? ',' : ''}
                            <span className="text-[#ACC5D3]">
                              {index === 0 ? ' ' : ' '}&apos;{item}&apos;
                            </span>
                          </span>
                        ))}
                        ]
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>



          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div

                className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#F08F87]">
                    study paths
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                    Structured courses on Learn.
                  </h2>
                </div>
                <Button asChild variant="outline" className="bg-background/40">
                  <Link href="/learn" transitionTypes={['nav-forward']}>
                    All courses
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {courses.map((course) => {
                  const Icon = courseIcon(course.icon);
                  return (
                    <Link
                      key={course.slug}
                      href={course.href}
                      transitionTypes={['nav-forward']}
                      className="block transition-transform duration-150 ease-out active:scale-[0.98]">
                      <Card className="group h-full border-border bg-card/45 transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-[#F08F87]/30 hover:bg-card/70 hover:shadow-lg">
                        <CardHeader>
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F08F87]/10 text-[#F08F87]">
                              <Icon className="h-5 w-5" />
                            </div>
                            {course.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {course.badge}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl transition-colors group-hover:text-[#F08F87]">
                            {course.title}
                          </CardTitle>
                          {course.excerpt && (
                            <CardDescription className="line-clamp-2 leading-6">
                              {course.excerpt}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="font-mono text-xs text-muted-foreground">
                            {course.chapterCount} chapters · {course.pageCount} pages
                          </p>
                          {course.tags && course.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {course.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs capitalize">
                                  {tag.replace(/-/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div

                className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#ACC5D3]">
                    from the blog
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                    Popular posts and topics.
                  </h2>
                </div>
                <Button asChild variant="outline" className="bg-background/40">
                  <Link href="/blog" transitionTypes={['nav-forward']}>
                    Blog index
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Popular
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {popularPosts.map((post, index) => (
                      <PopularPostCard key={post.slug} post={post} rank={index + 1} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Best topics
                    </h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {bestTopics.map(([topic, count]) => (
                      <BlogTopicCard key={topic} topic={topic} count={count} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pb-24 pt-10 sm:px-6 lg:px-8">
            <div

              className="mx-auto flex max-w-6xl flex-col gap-6 rounded-lg border border-border bg-card/80 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
              <div>
                <BookOpen className="mb-4 h-6 w-6 text-[#F08F87]" />
                <h2 className="text-2xl font-bold text-foreground">Keep learning.</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Dive into interactive courses, skim the notes archive, or reach out about ML and
                  software roles.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild>
                  <Link href="/learn" transitionTypes={['nav-forward']}>
                    Learn
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/portfolio#contact" transitionTypes={['nav-forward']}>
                    Contact
                  </Link>
                </Button>
                <Link
                  href="/portfolio"
                  transitionTypes={['nav-forward']}
                  className="text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:text-left">
                  Portfolio
                </Link>
              </div>
            </div>
          </section>
        </HomeColumnMotion>

        <div className="hidden lg:contents">
          <LetterGlitchRightSide />
        </div>
      </main>
    </div>
  );
}
