import Link from 'next/link';
import {
  BookOpen,
  Boxes,
  ChevronRight,
  Code2,
  Database,
  Layers3,
  Network,
  Server,
  type LucideIcon,
} from 'lucide-react';
import Header from '@/components/Header';
import { getLearnCourses } from '@/lib/learn';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Boxes,
  Code2,
  Database,
  Layers3,
  Network,
  Server,
};

function getIcon(name?: string) {
  if (!name) return BookOpen;
  return ICON_MAP[name] ?? BookOpen;
}

export default async function LearnPage() {
  const courses = await getLearnCourses();

  return (
    <div className="bg-background">
      <Header />
      <div className="mx-auto mt-28 max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Learn</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            In-depth study materials for backend architecture, .NET Aspire, APIs, and system design.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => {
            const Icon = getIcon(course.icon);
            return (
              <Link key={course.slug} href={`/learn/${course.slug}`}>
                <Card className="group h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Icon className="size-5 text-accent" />
                      </div>
                      {course.badge && <Badge variant="secondary">{course.badge}</Badge>}
                    </div>
                    <CardTitle className="group-hover:text-accent">{course.title}</CardTitle>
                    {course.description && <CardDescription>{course.description}</CardDescription>}
                  </CardHeader>
                  <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{course.pageCount} lessons</span>
                    <span className="inline-flex items-center gap-1 group-hover:text-accent">
                      Start
                      <ChevronRight className="size-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
