'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Boxes,
  ChevronRight,
  Code2,
  Database,
  Layers3,
  MousePointer2,
  Network,
  Play,
  ScrollText,
  Search,
  Server,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { LearnCatalogCourse, LearnCatalogLesson } from '@/lib/learn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
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

function getIcon(name?: string) {
  if (!name) return BookOpen;
  return ICON_MAP[name] ?? BookOpen;
}

function matchesQuery(
  query: string,
  fields: Array<string | undefined>
) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => field?.toLowerCase().includes(q));
}

interface LearnHubProps {
  courses: LearnCatalogCourse[];
  lessons: LearnCatalogLesson[];
}

export function LearnHub({ courses, lessons }: LearnHubProps) {
  const [query, setQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (courseFilter !== 'all' && course.slug !== courseFilter) return false;
      if (!query.trim()) return true;
      return matchesQuery(query, [course.title, course.description, course.badge]);
    });
  }, [courses, courseFilter, query]);

  const matchedLessons = useMemo(() => {
    if (!query.trim()) return [];
    return lessons.filter((lesson) => {
      if (courseFilter !== 'all' && lesson.courseSlug !== courseFilter) return false;
      return matchesQuery(query, [
        lesson.title,
        lesson.description,
        lesson.courseTitle,
        lesson.badge,
      ]);
    });
  }, [lessons, courseFilter, query]);

  const resultLinks = useMemo(() => {
    if (!query.trim()) return [] as Array<{ href: string; key: string }>;
    const courseHits = filteredCourses.map((c) => ({ href: c.href, key: `course-${c.slug}` }));
    const lessonHits = matchedLessons.map((l) => ({ href: l.href, key: `lesson-${l.href}` }));
    return [...courseHits, ...lessonHits];
  }, [query, filteredCourses, matchedLessons]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, courseFilter]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isModK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isModK) {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (event.key === 'Escape' && document.activeElement === searchRef.current) {
        if (query) {
          setQuery('');
        } else {
          searchRef.current?.blur();
        }
        return;
      }

      if (!query.trim() || resultLinks.length === 0) return;
      if (document.activeElement !== searchRef.current) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, resultLinks.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === 'Enter') {
        const target = resultLinks[selectedIndex];
        if (target) {
          event.preventDefault();
          window.location.href = target.href;
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [query, resultLinks, selectedIndex]);

  const clearQuery = useCallback(() => setQuery(''), []);

  const showResults = Boolean(query.trim());
  const hasResults = filteredCourses.length > 0 || matchedLessons.length > 0;

  let resultCursor = -1;

  return (
    <div className="relative overflow-hidden">
      <div className="relative mx-auto mt-28 max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-medium tracking-wide text-accent uppercase">Study</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Learn</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            In-depth courses on APIs, .NET Aspire, GSAP animation, and more — search lessons or pick a
            track.
          </p>

          <div className="relative mt-8">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses and lessons…"
              className="h-12 border-border/80 bg-card/80 pr-24 pl-10 text-base shadow-sm backdrop-blur-sm"
              aria-label="Search learn catalog"
            />
            <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
              {query ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground"
                  onClick={clearQuery}
                  aria-label="Clear search">
                  <X className="size-4" />
                </Button>
              ) : (
                <kbd className="hidden rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>
        </section>

        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip
            active={courseFilter === 'all'}
            onClick={() => setCourseFilter('all')}
            label="All"
          />
          {courses.map((course) => (
            <FilterChip
              key={course.slug}
              active={courseFilter === course.slug}
              onClick={() => setCourseFilter(course.slug)}
              label={course.title}
            />
          ))}
        </div>

        {showResults && (
          <section className="mb-10 space-y-6" aria-live="polite">
            {!hasResults ? (
              <div className="rounded-xl border border-dashed border-border bg-card/40 px-6 py-10 text-center text-sm text-muted-foreground">
                No courses or lessons match &ldquo;{query.trim()}&rdquo;.
              </div>
            ) : (
              <>
                {filteredCourses.length > 0 && (
                  <div>
                    <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                      Courses
                    </h2>
                    <ul className="space-y-2">
                      {filteredCourses.map((course) => {
                        resultCursor += 1;
                        const index = resultCursor;
                        return (
                          <li key={course.slug}>
                            <ResultRow
                              href={course.href}
                              title={course.title}
                              meta={`${course.pageCount} lessons`}
                              description={course.description}
                              active={selectedIndex === index}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {matchedLessons.length > 0 && (
                  <div>
                    <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                      Lessons
                    </h2>
                    <ul className="space-y-2">
                      {matchedLessons.map((lesson) => {
                        resultCursor += 1;
                        const index = resultCursor;
                        return (
                          <li key={lesson.href}>
                            <ResultRow
                              href={lesson.href}
                              title={lesson.title}
                              meta={lesson.courseTitle}
                              description={lesson.description}
                              badge={lesson.badge}
                              active={selectedIndex === index}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {!showResults && (
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="text-xl font-semibold text-foreground">Courses</h2>
              <p className="text-sm text-muted-foreground">
                {filteredCourses.length} track{filteredCourses.length === 1 ? '' : 's'}
              </p>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/40 px-6 py-10 text-center text-sm text-muted-foreground">
                No courses in this filter.
              </div>
            ) : (
              <div className="reveal-stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => {
                  const Icon = getIcon(course.icon);
                  return (
                    <Link
                      key={course.slug}
                      href={course.href}
                      className="reveal-on-scroll group block h-full">
                      <Card className="h-full border-border/80 bg-card/80 transition-[box-shadow,border-color] group-hover:border-accent/40 group-hover:shadow-md">
                        <CardHeader>
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-muted/80 ring-1 ring-border/60">
                              <Icon className="size-5 text-accent" />
                            </div>
                            {course.badge && <Badge variant="secondary">{course.badge}</Badge>}
                          </div>
                          <CardTitle className="text-lg transition-colors group-hover:text-accent">
                            {course.title}
                          </CardTitle>
                          {course.description && (
                            <CardDescription className="line-clamp-3">
                              {course.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>
                            {course.pageCount} lessons
                            {course.chapterCount > 0 ? ` · ${course.chapterCount} chapters` : ''}
                          </span>
                          <span className="inline-flex items-center gap-1 font-medium text-foreground/80 group-hover:text-accent">
                            Start
                            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-accent/50 bg-accent/15 text-foreground'
          : 'border-border bg-card/60 text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground'
      )}>
      {label}
    </button>
  );
}

function ResultRow({
  href,
  title,
  meta,
  description,
  badge,
  active,
}: {
  href: string;
  title: string;
  meta: string;
  description?: string;
  badge?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'block rounded-xl border px-4 py-3 transition-colors',
        active
          ? 'border-accent/40 bg-accent/10'
          : 'border-border/70 bg-card/50 hover:border-border hover:bg-muted/40'
      )}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">{title}</span>
            {badge && (
              <Badge variant="secondary" className="text-[10px]">
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
        </div>
        <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
      </div>
    </Link>
  );
}
