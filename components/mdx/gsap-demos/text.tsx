'use client';

import { useRef } from 'react';
import { gsap, useGSAP, SplitText } from './gsap-setup';
import { motionVars } from './context-safe';
import { DemoStage } from './demo-stage';

export function GsapSplitTextHeadline() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create('.gsap-headline', { type: 'words,chars' });
      gsap.from(
        split.chars,
        motionVars({
          y: 20,
          autoAlpha: 0,
          stagger: 0.02,
          duration: 0.35,
          ease: 'power2.out',
        })
      );
      return () => split.revert();
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-8">
      <div ref={scope}>
        <h3 className="gsap-headline text-xl font-bold tracking-tight text-foreground">
          Ship motion that feels right
        </h3>
      </div>
    </DemoStage>
  );
}

export function GsapScrambleLabel() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.gsap-scramble', {
        duration: 1.2,
        scrambleText: {
          text: 'Deployment complete',
          chars: '01',
          revealDelay: 0.4,
        },
        ease: 'none',
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-8">
      <div ref={scope}>
        <p className="gsap-scramble font-mono text-sm text-foreground">Loading........</p>
      </div>
    </DemoStage>
  );
}

export function GsapNumberTicker() {
  const scope = useRef<HTMLDivElement>(null);
  const obj = { value: 0 };

  useGSAP(
    () => {
      gsap.to(obj, {
        value: 2847,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          const el = scope.current?.querySelector('.gsap-ticker');
          if (el) el.textContent = Math.round(obj.value).toLocaleString();
        },
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-8">
      <div ref={scope} className="text-center">
        <p className="text-xs text-muted-foreground">Active users</p>
        <p className="gsap-ticker text-3xl font-bold tabular-nums text-foreground">0</p>
      </div>
    </DemoStage>
  );
}
