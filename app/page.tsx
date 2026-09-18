import Header from '@/components/Header';
import { BlogPostPreviewCard } from '@/components/blog-post-preview-card';
import LetterGlitchLeftSide from '@/components/showcase/LetterGlitchLeftSide';
import LetterGlitchRightSide from '@/components/showcase/LetterGlitchRightSide';
import ParallaxWaves from '@/components/showcase/ParallaxWaveBackground';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JsonLd } from '@/components/seo/json-ld';
import { getAllPosts } from '@/lib/mdx';
import { homeStrengths, profile, projects, publications } from '@/lib/profile';
import { constructMetadata, getPersonSchema } from '@/lib/seo';
import {
  ArrowRight,
  Binary,
  BrainCircuit,
  Code2,
  Database,
  Network,
  Workflow,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ViewTransition } from 'react';

const strengthIcons = [BrainCircuit, Binary, Network, Workflow] as const;

const projectIcons = [BrainCircuit, Database, Code2] as const;

export const metadata: Metadata = constructMetadata({
  path: '/',
});

export default async function App() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={getPersonSchema()} />
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
                        Applied ML, RAG systems, and production backends.
                      </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="hero-metric">
                        <span>{projects.length}</span>
                        <p>projects</p>
                      </div>
                      <div className="hero-metric">
                        <span>{publications.length}</span>
                        <p>pubs</p>
                      </div>
                      <div className="hero-metric">
                        <span>{posts.length}</span>
                        <p>posts</p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/20 p-4 font-mono text-sm text-muted-foreground">
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

          <section className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="reveal-stagger mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {homeStrengths.map((label, index) => {
                const Icon = strengthIcons[index] ?? BrainCircuit;
                return (
                  <div
                    key={label}
                    className="reveal-on-scroll rounded-lg border border-white/10 bg-card/45 p-5 backdrop-blur">
                    <Icon className="mb-4 h-5 w-5 text-[#ACC5D3]" />
                    <p className="text-sm font-medium text-foreground">{label}</p>
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
                    Selected work from the resume.
                  </h2>
                </div>
                <Button asChild variant="outline" className="bg-background/40">
                  <Link href="/portfolio#projects" transitionTypes={['nav-forward']}>
                    All Work
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="reveal-stagger grid gap-5 lg:grid-cols-3">
                {projects.map((project, index) => {
                  const Icon = projectIcons[index] ?? Code2;
                  return (
                    <ViewTransition key={project.id} name={`project-${index}`} share="morph">
                      <Card className="reveal-on-scroll group h-full overflow-hidden border-white/10 bg-card/55 transition-all duration-300 hover:-translate-y-1 hover:border-[#ACC5D3]/35 hover:shadow-2xl">
                        <CardHeader>
                          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#ACC5D3]/10 text-[#ACC5D3]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-xl transition-colors group-hover:text-[#ACC5D3]">
                            <Link href={project.href} target="_blank" rel="noopener noreferrer">
                              {project.shortTitle}
                            </Link>
                          </CardTitle>
                          <CardDescription className="leading-6">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 4).map((tag) => (
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
                  <BlogPostPreviewCard key={post.slug} post={post} variant="landing" />
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 pb-24 pt-10 sm:px-6 lg:px-8">
            <div className="reveal-on-scroll mx-auto flex max-w-6xl flex-col gap-6 rounded-lg border border-white/10 bg-[#101720]/80 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
              <div>
                <Code2 className="mb-4 h-6 w-6 text-[#F08F87]" />
                <h2 className="text-2xl font-bold text-foreground">Looking for project context?</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  See experience, skills, and GitHub-linked work on the portfolio — or reach out
                  about ML and software roles.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/portfolio" transitionTypes={['nav-forward']}>
                    Portfolio
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href="/portfolio#contact" transitionTypes={['nav-forward']}>
                    Contact
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
