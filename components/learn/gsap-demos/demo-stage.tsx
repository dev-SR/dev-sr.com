'use client';

import { forwardRef, useRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

export interface DemoStageProps {
  children: React.ReactNode;
  className?: string;
  scroll?: boolean;
  height?: string | number;
  id?: string;
}

export const DemoStage = forwardRef<HTMLDivElement, DemoStageProps>(function DemoStage(
  { children, className, scroll = false, height, id },
  ref
) {
  const innerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

  return (
    <div
      ref={innerRef}
      id={id}
      className={cn(
        'relative w-full rounded-lg border border-border/60 bg-muted/20',
        scroll ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden',
        className
      )}
      style={height ? { height: typeof height === 'number' ? `${height}px` : height } : undefined}>
      {children}
    </div>
  );
});
