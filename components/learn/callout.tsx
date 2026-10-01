import { AlertCircle, Ban, Info, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

type CalloutVariant = 'note' | 'tip' | 'warning' | 'dont';

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const VARIANTS: Record<
  CalloutVariant,
  { icon: typeof Info; border: string; bg: string; iconColor: string }
> = {
  note: {
    icon: Info,
    border: 'border-border',
    bg: 'bg-muted/30',
    iconColor: 'text-muted-foreground',
  },
  tip: {
    icon: Lightbulb,
    border: 'border-accent/40',
    bg: 'bg-accent/5',
    iconColor: 'text-accent',
  },
  warning: {
    icon: AlertCircle,
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/5',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  dont: {
    icon: Ban,
    border: 'border-destructive/40',
    bg: 'bg-destructive/5',
    iconColor: 'text-destructive',
  },
};

export function Callout({ variant = 'note', title, children, className }: CalloutProps) {
  const config = VARIANTS[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'not-prose my-6 flex gap-3 rounded-lg border px-4 py-3 text-sm',
        config.border,
        config.bg,
        className
      )}>
      <Icon className={cn('mt-0.5 size-4 shrink-0', config.iconColor)} aria-hidden />
      <div className="min-w-0 flex-1 text-muted-foreground [&>p]:m-0 [&>p+p]:mt-2">
        {title && <p className="mb-1 text-foreground font-bold">{title}</p>}
        {children}
      </div>
    </div>
  );
}
