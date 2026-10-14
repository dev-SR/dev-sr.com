'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from './gsap-setup';
import { DemoStage } from './demo-stage';
import { Button } from '@/components/ui/button';

export function GsapTransportControls() {
  const scope = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      tweenRef.current = gsap.to('.gsap-hero', {
        x: 120,
        rotation: 360,
        duration: 2,
        ease: 'power2.inOut',
        paused: true,
      });
    },
    { scope }
  );

  return (
    <DemoStage className="p-6">
      <div ref={scope}>
        <div className="relative mb-4 h-16 rounded bg-muted/40">
          <div className="gsap-hero absolute left-2 top-2 size-12 rounded-lg bg-accent" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => tweenRef.current?.play()}>
            Play
          </Button>
          <Button size="sm" variant="outline" onClick={() => tweenRef.current?.pause()}>
            Pause
          </Button>
          <Button size="sm" variant="outline" onClick={() => tweenRef.current?.reverse()}>
            Reverse
          </Button>
          <Button size="sm" variant="outline" onClick={() => tweenRef.current?.progress(0.5)}>
            50%
          </Button>
        </div>
      </div>
    </DemoStage>
  );
}

export function GsapHoverReverse() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (context, contextSafe) => {
      if (!contextSafe) return;
      const onEnter = contextSafe(() => {
        gsap.to('.gsap-card-lift', { y: -6, scale: 1.02, duration: 0.2, ease: 'power2.out' });
      });
      const onLeave = contextSafe(() => {
        gsap.to('.gsap-card-lift', { y: 0, scale: 1, duration: 0.2, ease: 'power2.out' });
      });
      const el = scope.current?.querySelector('.gsap-card-lift');
      el?.addEventListener('mouseenter', onEnter);
      el?.addEventListener('mouseleave', onLeave);
      return () => {
        el?.removeEventListener('mouseenter', onEnter);
        el?.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-8">
      <div ref={scope}>
        <div className="gsap-card-lift w-48 cursor-pointer rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm font-medium">Hover me</p>
          <p className="text-xs text-muted-foreground">Reverses on leave</p>
        </div>
      </div>
    </DemoStage>
  );
}

export function GsapOverwriteAuto() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.gsap-toggle-box', { x: 80, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    },
    { scope }
  );

  const toggle = () => {
    gsap.to('.gsap-toggle-box', {
      x: gsap.getProperty('.gsap-toggle-box', 'x') === 80 ? 0 : 80,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  return (
    <DemoStage className="p-6">
      <div ref={scope}>
        <div className="relative mb-4 h-12 rounded bg-muted/40">
          <div className="gsap-toggle-box absolute left-2 top-2 size-8 rounded bg-primary" />
        </div>
        <Button size="sm" onClick={toggle}>
          Toggle position
        </Button>
      </div>
    </DemoStage>
  );
}
