'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DemoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

export function DemoToast({
  className,
  title = 'Changes saved',
  description = 'Your settings were updated.',
}: {
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div
      className={cn(
        'gsap-toast w-full max-w-sm rounded-lg border border-border bg-card px-4 py-3 shadow-md',
        className
      )}>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function DemoEmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'gsap-empty flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-8 py-10 text-center',
        className
      )}>
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-lg">
        ✦
      </div>
      <p className="text-sm font-medium text-foreground">No projects yet</p>
      <p className="max-w-[200px] text-xs text-muted-foreground">
        Create your first project to get started.
      </p>
      <Button size="sm" className="mt-1">
        New project
      </Button>
    </div>
  );
}

export function DemoCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="gsap-card-grid grid w-full max-w-md grid-cols-3 gap-2">
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} className="gsap-card border-border/60 bg-card/80 shadow-none">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-xs font-medium">Metric {i + 1}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-lg font-semibold tabular-nums text-foreground">
              {(i + 1) * 127}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DemoNavItems() {
  const items = ['Overview', 'Analytics', 'Team', 'Settings', 'Billing'];
  return (
    <nav className="gsap-nav flex w-full max-w-xs flex-col gap-1">
      {items.map((label) => (
        <span
          key={label}
          className="gsap-nav-item rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50">
          {label}
        </span>
      ))}
    </nav>
  );
}

export function DemoAvatarRow({ count = 5 }: { count?: number }) {
  const colors = ['bg-rose-400', 'bg-sky-400', 'bg-amber-400', 'bg-emerald-400', 'bg-violet-400'];
  return (
    <div className="gsap-avatars flex gap-2">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={cn(
            'gsap-avatar size-10 rounded-full border-2 border-background',
            colors[i % colors.length]
          )}
        />
      ))}
    </div>
  );
}

export function DemoPressButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        'demo-press-btn rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform duration-150 ease-out active:scale-[0.97]',
        className
      )}>
      Save changes
    </button>
  );
}

export function DemoBadgeRow() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">React</Badge>
      <Badge variant="secondary">GSAP</Badge>
      <Badge variant="secondary">TypeScript</Badge>
    </div>
  );
}
