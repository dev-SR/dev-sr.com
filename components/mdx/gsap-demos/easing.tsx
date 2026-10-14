'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from './gsap-setup';
import { DemoStage } from './demo-stage';
import { DemoToast } from './ui';
import { Button } from '@/components/ui/button';

function EaseCompare({ ease, label }: { ease: string; label: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.gsap-toast',
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease }
      );
    },
    { scope }
  );

  return (
    <div ref={scope} className="flex flex-1 flex-col items-center gap-2">
      <span className="text-[0.65rem] font-medium text-muted-foreground">{label}</span>
      <DemoToast title={label} description={ease} />
    </div>
  );
}

export function GsapEaseCompare() {
  return (
    <DemoStage className="flex flex-wrap items-end justify-center gap-4 p-6">
      <EaseCompare ease="power2.out" label="power2.out" />
      <EaseCompare ease="back.out(1.7)" label="back.out" />
      <EaseCompare ease="elastic.out(1, 0.4)" label="elastic.out" />
    </DemoStage>
  );
}

export function GsapEaseInVsOut() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.gsap-dropdown-out',
        { y: -8, autoAlpha: 0, scale: 0.97 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.25, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.gsap-dropdown-in',
        { y: -8, autoAlpha: 0, scale: 0.97 },
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.25, ease: 'power2.in' }
      );
    },
    { scope }
  );

  return (
    <DemoStage className="flex flex-wrap justify-center gap-8 p-8">
      <div ref={scope} className="flex gap-8">
        <div className="text-center">
          <p className="mb-2 text-xs text-emerald-600 dark:text-emerald-400">power2.out ✓</p>
          <div className="gsap-dropdown-out w-36 rounded-lg border border-border bg-card p-3 text-xs shadow-sm">
            Feels responsive
          </div>
        </div>
        <div className="text-center">
          <p className="mb-2 text-xs text-destructive">power2.in ✗</p>
          <div className="gsap-dropdown-in w-36 rounded-lg border border-border bg-card p-3 text-xs shadow-sm">
            Feels sluggish
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

export function GsapCustomEaseTeaser() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const drawerEase = gsap.parseEase('power2.out');
      gsap.fromTo(
        '.gsap-panel',
        { xPercent: 100 },
        { xPercent: 0, duration: 0.45, ease: drawerEase }
      );
    },
    { scope }
  );

  return (
    <DemoStage className="relative h-36 overflow-hidden">
      <div ref={scope} className="h-full">
        <div className="gsap-panel absolute right-0 top-0 h-full w-1/2 border-l border-border bg-card p-4">
          <p className="text-sm font-medium">Custom curves</p>
          <p className="text-xs text-muted-foreground">CustomEase on the plugins page.</p>
        </div>
      </div>
    </DemoStage>
  );
}
