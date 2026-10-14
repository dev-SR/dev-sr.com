'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from './gsap-setup';
import { DemoStage } from './demo-stage';

export function GsapQuickToFollower() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (context, contextSafe) => {
      if (!contextSafe) return;
      const xTo = gsap.quickTo('.gsap-follower', 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo('.gsap-follower', 'y', { duration: 0.4, ease: 'power3' });
      const onMove = contextSafe((e: MouseEvent) => {
        const rect = scope.current?.getBoundingClientRect();
        if (!rect) return;
        const x = gsap.utils.clamp(0, rect.width - 32, e.clientX - rect.left - 16);
        const y = gsap.utils.clamp(0, rect.height - 32, e.clientY - rect.top - 16);
        xTo(x);
        yTo(y);
      });
      scope.current?.addEventListener('mousemove', onMove);
      return () => scope.current?.removeEventListener('mousemove', onMove);
    },
    { scope }
  );

  return (
    <DemoStage className="relative h-40 cursor-crosshair">
      <div ref={scope} className="absolute inset-0">
        <div className="gsap-follower absolute left-0 top-0 size-8 rounded-full bg-accent/80" />
      </div>
    </DemoStage>
  );
}

export function GsapMapRangeProgress() {
  const scope = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mapRot = gsap.utils.mapRange(0, 1, 0, 360);
      stageRef.current?.addEventListener('scroll', () => {
        if (!stageRef.current) return;
        const progress = gsap.utils.normalize(
          0,
          stageRef.current.scrollHeight - stageRef.current.clientHeight,
          stageRef.current.scrollTop
        );
        gsap.to('.gsap-dial', { rotation: mapRot(progress), duration: 0.1, overwrite: true });
      });
    },
    { scope }
  );

  return (
    <DemoStage ref={stageRef} scroll height={200} className="p-4">
      <div ref={scope} className="sticky top-4 flex justify-center">
        <div className="gsap-dial size-12 rounded-full border-4 border-accent border-t-transparent" />
      </div>
      <div className="h-[400px]" />
    </DemoStage>
  );
}

export function GsapDistributeScale() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.gsap-dist-item', {
        scale: gsap.utils.distribute({ base: 0.7, amount: 0.6, from: 'center', ease: 'power1.inOut' }),
        duration: 0.5,
        ease: 'power2.out',
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex justify-center gap-2 p-6">
      <div ref={scope} className="flex gap-2">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="gsap-dist-item size-8 rounded bg-accent/70" />
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapSnapGrid() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const snap = gsap.utils.snap(40);
      scope.current?.addEventListener('click', (e) => {
        const rect = scope.current!.getBoundingClientRect();
        const x = snap(e.clientX - rect.left - 16);
        const y = snap(e.clientY - rect.top - 16);
        gsap.to('.gsap-snap-block', { x, y, duration: 0.25, ease: 'power2.out' });
      });
    },
    { scope }
  );

  return (
    <DemoStage className="relative h-44 cursor-pointer bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px]">
      <div ref={scope} className="absolute inset-0">
        <div className="gsap-snap-block absolute left-0 top-0 size-8 rounded bg-primary" />
      </div>
      <p className="absolute bottom-2 left-2 text-[0.65rem] text-muted-foreground">
        Click to snap to 40px grid
      </p>
    </DemoStage>
  );
}

export function GsapRandomStagger() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.gsap-rand-dot', {
        x: 'random(-40, 40, 5)',
        y: 'random(-20, 20, 5)',
        duration: 0.6,
        stagger: { amount: 0.3, from: 'random' },
        ease: 'power2.out',
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-8">
      <div ref={scope} className="relative h-16 w-48">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="gsap-rand-dot absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          />
        ))}
      </div>
    </DemoStage>
  );
}
