'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from './gsap-setup';
import { motionVars } from './context-safe';
import { DemoStage } from './demo-stage';
import { DemoCardGrid, DemoNavItems } from './ui';

export function GsapStaggerGrid() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(
        '.gsap-card',
        motionVars({
          y: 20,
          autoAlpha: 0,
          duration: 0.35,
          ease: 'power2.out',
          stagger: 0.06,
        })
      );
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-6">
      <div ref={scope}>
        <DemoCardGrid />
      </div>
    </DemoStage>
  );
}

export function GsapStaggerNav() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.gsap-nav-item', {
        x: -16,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.out',
        stagger: { amount: 0.4, from: 'start' },
      });
    },
    { scope }
  );

  return (
    <DemoStage className="p-4">
      <div ref={scope}>
        <DemoNavItems />
      </div>
    </DemoStage>
  );
}

export function GsapStaggerCenter() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.gsap-pill', {
        scale: 0.9,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.out',
        stagger: { amount: 0.35, from: 'center' },
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex flex-wrap justify-center gap-2 p-6">
      <div ref={scope} className="flex flex-wrap justify-center gap-2">
        {['Design', 'Engineering', 'Product', 'Marketing', 'Sales'].map((t) => (
          <span
            key={t}
            className="gsap-pill rounded-full border border-border bg-muted/50 px-3 py-1 text-xs">
            {t}
          </span>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapStaggerChat() {
  const scope = useRef<HTMLDivElement>(null);
  const messages = ['Hey, ship today?', 'Almost — running tests.', 'Nice. Ping me when green.'];

  useGSAP(
    () => {
      gsap.from('.gsap-msg', {
        y: 12,
        autoAlpha: 0,
        duration: 0.28,
        ease: 'power2.out',
        stagger: 0.12,
      });
    },
    { scope }
  );

  return (
    <DemoStage className="p-4">
      <div ref={scope} className="mx-auto flex w-full max-w-xs flex-col gap-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`gsap-msg max-w-[85%] rounded-lg px-3 py-2 text-xs ${
              i % 2 === 0
                ? 'self-start bg-muted text-foreground'
                : 'self-end bg-primary text-primary-foreground'
            }`}>
            {msg}
          </div>
        ))}
      </div>
    </DemoStage>
  );
}
