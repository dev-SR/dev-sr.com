'use client';

import { resolveLearnIcon } from '@/lib/content-icons';
import { cn } from '@/lib/utils';

export function CourseIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  const Icon = resolveLearnIcon(name);
  return <Icon className={cn(className)} aria-hidden strokeWidth={1.8} />;
}
