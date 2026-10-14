'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from './gsap-setup';
import { motionVars } from './context-safe';
import { DemoStage } from './demo-stage';
import { DemoAvatarRow, DemoEmptyState, DemoToast } from './ui';

export function GsapToastEnter() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.gsap-toast', motionVars({ y: 24, autoAlpha: 0, duration: 0.35, ease: 'power2.out' }));
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-6">
      <div ref={scope} className="w-full max-w-sm">
        <DemoToast />
      </div>
    </DemoStage>
  );
}

export function GsapEmptyStateEnter() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(
        '.gsap-empty',
        motionVars({ scale: 0.95, autoAlpha: 0, duration: 0.4, ease: 'power2.out' })
      );
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-6">
      <div ref={scope}>
        <DemoEmptyState />
      </div>
    </DemoStage>
  );
}

export function GsapSkeletonToContent() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.gsap-content',
        { autoAlpha: 0, y: 8 },
        motionVars({ autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', delay: 0.4 })
      );
      gsap.to('.gsap-skeleton', { autoAlpha: 0, duration: 0.2, delay: 0.3 });
    },
    { scope }
  );

  return (
    <DemoStage className="p-6">
      <div ref={scope} className="mx-auto w-full max-w-xs space-y-3">
        <div className="gsap-skeleton h-4 w-3/4 rounded bg-muted" />
        <div className="gsap-skeleton h-4 w-full rounded bg-muted" />
        <div className="gsap-skeleton h-4 w-5/6 rounded bg-muted" />
        <div className="gsap-content space-y-2 pt-2">
          <p className="text-sm font-medium text-foreground">Dashboard loaded</p>
          <p className="text-xs text-muted-foreground">12 active users · 98% uptime</p>
        </div>
      </div>
    </DemoStage>
  );
}

export function GsapSetBeforeSequence() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set('.gsap-dot', { scale: 0, autoAlpha: 0 });
      gsap.to('.gsap-dot', {
        scale: 1,
        autoAlpha: 1,
        stagger: 0.08,
        duration: 0.25,
        ease: 'back.out(1.4)',
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center gap-3 p-6">
      <div ref={scope} className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="gsap-dot size-3 rounded-full bg-accent" />
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapAvatarRow() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.gsap-avatar', {
        x: (i) => i * 48,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.06,
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center overflow-x-auto p-8">
      <div ref={scope} className="relative min-w-[280px]">
        <DemoAvatarRow />
      </div>
    </DemoStage>
  );
}
