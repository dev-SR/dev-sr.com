import Header from '@/components/Header';
import LetterGlitchLeftSide from '@/components/showcase/LetterGlitchLeftSide';
import LetterGlitchRightSide from '@/components/showcase/LetterGlitchRightSide';
import ParallaxWaves from '@/components/showcase/ParallaxWaveBackground';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllPosts } from '@/lib/mdx';
import {
  ArrowRight,
  BookOpen,
  Braces,
  CalendarDays,
  Code2,
  Layers3,
  MousePointer2,
  PenLine,
  Sparkles,
  Waves,
} from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';

const projectHighlights = [
  {
    title: 'Interactive MDX Knowledge Base',
    description:
      'A structured writing system for algorithms, math, React patterns, syntax-highlighted code, and reusable learning notes.',
    href: '/blog',
    icon: BookOpen,
    tags: ['MDX', 'Shiki', 'KaTeX'],
  },
  {
    title: 'Path Visualizer Lab',
    description:
      'A hands-on tool for exploring parsing and route/path behavior with immediate visual feedback.',
    href: '/tools/path-visualizer',
    icon: MousePointer2,
    tags: ['Next.js', 'Visualization', 'Tools'],
  },
  {
    title: 'Portfolio Motion System',
    description:
      'Native route transitions, scroll-driven reveals, responsive nav behavior, and lightweight interactive polish.',
    href: '/portfolio',
    icon: Sparkles,
    tags: ['View Transitions', 'CSS', 'GSAP'],
  },
];

const strengths = [
  { label: 'Frontend architecture', icon: Layers3 },
  { label: 'Technical writing', icon: PenLine },
  { label: 'Interactive tools', icon: Braces },
  { label: 'Motion systems', icon: Waves },
];

export default async function App() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 3);
  const topicCount = new Set(posts.flatMap((post) => post.tags ?? [])).size;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ParallaxWaves />

      <main className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-12">
        <div className="hidden lg:contents">
          <LetterGlitchLeftSide />
        </div>

        <div className="relative z-30 w-full -mt-[60vh] lg:col-span-8">
          <section className="relative min-h-[92svh] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="reveal-on-scroll">
                <Badge
                  variant="outline"
                  className="mb-6 border-[#F08F87]/35 bg-[#F08F87]/10 text-[#F08F87]">
                  Next.js portfolio, blog, and experiments
                </Badge>

                <h1 className="max-w-4xl text-5xl font-bold leading-tight text-foreground sm:text-6xl lg:text-7xl">
                  Building sharp web experiences with motion, writing, and useful tools.
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  I use this space to collect production-minded frontend work, interactive
                  experiments, and technical notes across React, algorithms, math, and modern web
                  platform APIs.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="group">
                    <Link href="/portfolio" transitionTypes={['nav-forward']}>
                      View Portfolio
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-background/40">
                    <Link href="/blog" transitionTypes={['nav-forward']}>
                      Read Latest Posts
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="reveal-on-scroll reveal-delay-2">
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
                        Native view transitions, MDX systems, and smooth interaction design.
                      </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="hero-metric">
                        <span>{posts.length}</span>
                        <p>posts</p>
                      </div>
                      <div className="hero-metric">
                        <span>{topicCount || 1}</span>
                        <p>topics</p>
                      </div>
                      <div className="hero-metric">
                        <span>3</span>
                        <p>labs</p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/20 p-4 font-mono text-sm text-muted-foreground">
                      <p>
                        <span className="text-[#F08F87]">const</span> focus = [
                        <span className="text-[#ACC5D3]">&apos;Next.js&apos;</span>,
                        <span className="text-[#ACC5D3]"> &apos;MDX&apos;</span>,
                        <span className="text-[#ACC5D3]"> &apos;Animation&apos;</span>]
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="reveal-stagger mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {strengths.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="reveal-on-scroll rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur">
                    <Icon className="mb-4 h-5 w-5 text-[#ACC5D3]" />
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="reveal-on-scroll mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#F08F87]">
                    portfolio signals
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                    Useful projects with visible intent.
                  </h2>
                </div>
                <Button asChild variant="outline" className="bg-background/40">
                  <Link href="/portfolio" transitionTypes={['nav-forward']}>
                    All Work
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="reveal-stagger grid gap-5 lg:grid-cols-3">
                {projectHighlights.map((project, index) => {
                  const Icon = project.icon;
                  return (
                    <ViewTransition key={project.title} name={`project-${index}`} share="morph">
                      <Card className="reveal-on-scroll group h-full overflow-hidden border-white/10 bg-card/55 transition-all duration-300 hover:-translate-y-1 hover:border-[#ACC5D3]/35 hover:shadow-2xl">
                        <CardHeader>
                          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#ACC5D3]/10 text-[#ACC5D3]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-xl transition-colors group-hover:text-[#ACC5D3]">
                            <Link href={project.href} transitionTypes={['nav-forward']}>
                              {project.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="leading-6">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </ViewTransition>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className="reveal-on-scroll mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#ACC5D3]">
                    latest writing
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
                    Notes worth opening twice.
                  </h2>
                </div>
                <Button asChild variant="outline" className="bg-background/40">
                  <Link href="/blog" transitionTypes={['nav-forward']}>
                    Blog Index
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="reveal-stagger grid gap-5">
                {recentPosts.map((post) => (
                  <ViewTransition key={post.slug} name={`post-${post.slug}`} share="morph">
                    <Link href={`/blog/${post.slug}`} transitionTypes={['nav-forward']}>
                      <article className="reveal-on-scroll group grid gap-5 rounded-lg border border-white/10 bg-card/45 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#F08F87]/35 hover:bg-card/70 md:grid-cols-[1fr_auto]">
                        <div>
                          <div className="mb-3 flex flex-wrap gap-2">
                            {post.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="text-2xl font-semibold text-foreground transition-colors group-hover:text-[#F08F87]">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground md:flex-col md:items-end md:justify-center">
                          <span className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                          <span>{post.readingTime} min read</span>
                        </div>
                      </article>
                    </Link>
                  </ViewTransition>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 pb-24 pt-10 sm:px-6 lg:px-8">
            <div className="reveal-on-scroll mx-auto flex max-w-6xl flex-col gap-6 rounded-lg border border-white/10 bg-[#101720]/80 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
              <div>
                <Code2 className="mb-4 h-6 w-6 text-[#F08F87]" />
                <h2 className="text-2xl font-bold text-foreground">Want the practical tour?</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Explore the portfolio for project context, or open the blog for the thinking and
                  implementation notes behind the work.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/portfolio" transitionTypes={['nav-forward']}>
                    Portfolio
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/blog" transitionTypes={['nav-forward']}>
                    Writing
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>

        <div className="hidden lg:contents">
          <LetterGlitchRightSide />
        </div>
      </main>
    </div>
  );
}
