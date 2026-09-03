'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from './gsap-setup';
import { DemoStage } from './demo-stage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function GsapScopeIsolation() {
  return (
    <DemoStage className="flex flex-wrap gap-6 p-6">
      <ScopedBox label="Scope A" color="bg-sky-500" />
      <ScopedBox label="Scope B" color="bg-amber-500" />
    </DemoStage>
  );
}

function ScopedBox({ label, color }: { label: string; color: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.box', { x: 40, duration: 0.5, ease: 'power2.out' });
    },
    { scope }
  );

  return (
    <div ref={scope} className="flex flex-col items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="relative h-12 w-32 rounded bg-muted/40">
        <div className={`box absolute left-1 top-1 size-10 rounded ${color}`} />
      </div>
    </div>
  );
}

export function GsapRevertOnUpdate() {
  const scope = useRef<HTMLDivElement>(null);
  const [targetX, setTargetX] = useState(0);

  useGSAP(
    () => {
      gsap.to('.gsap-target', { x: targetX, duration: 0.4, ease: 'power2.out' });
    },
    { scope, dependencies: [targetX], revertOnUpdate: true }
  );

  return (
    <DemoStage className="space-y-4 p-6">
      <div ref={scope} className="relative h-14 rounded bg-muted/40">
        <div className="gsap-target absolute left-2 top-2 size-10 rounded-lg bg-accent" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="range"
          min={0}
          max={120}
          value={targetX}
          onChange={(e) => setTargetX(Number(e.target.value))}
          className="max-w-[200px]"
        />
        <span className="text-xs tabular-nums text-muted-foreground">{targetX}px</span>
      </div>
    </DemoStage>
  );
}

export function GsapContextSafeClick() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (context, contextSafe) => {
      if (!contextSafe) return;
      const onClick = contextSafe(() => {
        gsap.fromTo(
          '.gsap-bounce',
          { scale: 1 },
          { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.out' }
        );
      });
      scope.current?.querySelector('.gsap-bounce')?.addEventListener('click', onClick);
      return () => {
        scope.current?.querySelector('.gsap-bounce')?.removeEventListener('click', onClick);
      };
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-8">
      <div ref={scope}>
        <Button className="gsap-bounce">Click for feedback</Button>
      </div>
    </DemoStage>
  );
}

export function GsapMatchMediaReduced() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.gsap-banner', { y: 24, autoAlpha: 0, duration: 0.4, ease: 'power2.out' });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from('.gsap-banner', { autoAlpha: 0, duration: 0.15, ease: 'power1.out' });
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <DemoStage className="p-6">
      <div ref={scope}>
        <div className="gsap-banner rounded-lg border border-border bg-card px-4 py-3 text-sm">
          Respects <code className="text-xs">prefers-reduced-motion</code> — fade only when reduced.
        </div>
      </div>
    </DemoStage>
  );
}
