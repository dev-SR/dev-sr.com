'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger, ScrollToPlugin } from './gsap-setup';
import { motionVars } from './context-safe';
import { DemoStage } from './demo-stage';
import { Button } from '@/components/ui/button';

function useScrollStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  return stageRef;
}

export function GsapScrollReveal() {
  const stageRef = useScrollStage();

  useGSAP(
    () => {
      if (!stageRef.current) return;
      gsap.utils.toArray<HTMLElement>('.gsap-reveal', stageRef.current).forEach((el) => {
        gsap.from(el, {
          ...motionVars({ y: 40, autoAlpha: 0, duration: 0.6, ease: 'power2.out' }),
          scrollTrigger: {
            trigger: el,
            scroller: stageRef.current!,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    },
    { scope: stageRef }
  );

  return (
    <DemoStage ref={stageRef} scroll height={280} className="p-4">
      <div className="space-y-24 pb-8 pt-16">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="gsap-reveal rounded-lg border border-border bg-card p-4 text-sm">
            Section {n} — scroll to reveal
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapScrollScrub() {
  const stageRef = useScrollStage();

  useGSAP(
    () => {
      if (!stageRef.current) return;
      gsap.to('.gsap-scrub-bar', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: stageRef.current,
          scroller: stageRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    },
    { scope: stageRef }
  );

  return (
    <DemoStage ref={stageRef} scroll height={280} className="p-4">
      <div className="sticky top-0 z-10 mb-4 h-1 overflow-hidden rounded-full bg-muted">
        <div className="gsap-scrub-bar h-full w-full origin-left scale-x-0 bg-accent" />
      </div>
      <div className="space-y-32 pb-16 pt-8">
        {[1, 2, 3, 4].map((n) => (
          <p key={n} className="text-sm text-muted-foreground">
            Scroll progress drives the bar — block {n}
          </p>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapScrollPin() {
  const stageRef = useScrollStage();

  useGSAP(
    () => {
      if (!stageRef.current) return;
      const panels = gsap.utils.toArray<HTMLElement>('.gsap-pin-panel', stageRef.current);
      panels.forEach((panel, i) => {
        const inner = panel.querySelector('.gsap-pin-inner');
        if (!inner) return;
        gsap.to(inner, {
          autoAlpha: i === 0 ? 1 : 0,
          scrollTrigger: {
            trigger: panel,
            scroller: stageRef.current!,
            start: 'top top',
            end: '+=200',
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            onEnter: () => gsap.to(inner, { autoAlpha: 1, duration: 0.2 }),
          },
        });
      });
    },
    { scope: stageRef }
  );

  return (
    <DemoStage ref={stageRef} scroll height={320} className="p-2">
      <div className="space-y-0 pb-[400px]">
        {['Analytics', 'Automation', 'Integrations'].map((title) => (
          <section key={title} className="gsap-pin-panel h-[200px]">
            <div className="gsap-pin-inner flex h-full flex-col items-center justify-center rounded-lg border border-border bg-card">
              <p className="text-lg font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">Pinned while scrolling</p>
            </div>
          </section>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapScrollBatch() {
  const stageRef = useScrollStage();

  useGSAP(
    () => {
      if (!stageRef.current) return;
      gsap.set('.gsap-batch-card', { autoAlpha: 0, y: 30 });
      ScrollTrigger.batch('.gsap-batch-card', {
        scroller: stageRef.current!,
        start: 'top 90%',
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out', overwrite: true }),
        onLeaveBack: (batch) =>
          gsap.set(batch, { autoAlpha: 0, y: 30, overwrite: true }),
      });
    },
    { scope: stageRef }
  );

  return (
    <DemoStage ref={stageRef} scroll height={300} className="p-4">
      <div className="grid grid-cols-2 gap-2 pb-16 pt-8">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="gsap-batch-card rounded-lg border border-border bg-card p-3 text-xs">
            Card {i + 1}
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapScrollToSection() {
  const stageRef = useScrollStage();

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollToPlugin);
    },
    { scope: stageRef }
  );

  const scrollTo = (id: string) => {
    if (!stageRef.current) return;
    gsap.to(stageRef.current, {
      duration: 0.8,
      scrollTo: { y: `#${id}`, offsetY: 8 },
      ease: 'power2.inOut',
    });
  };

  return (
    <DemoStage ref={stageRef} scroll height={280} className="p-4">
      <div className="sticky top-0 z-10 mb-4 flex gap-2 bg-muted/80 pb-2 backdrop-blur-sm">
        <Button size="sm" variant="outline" onClick={() => scrollTo('sec-a')}>
          Section A
        </Button>
        <Button size="sm" variant="outline" onClick={() => scrollTo('sec-b')}>
          Section B
        </Button>
      </div>
      <div id="sec-a" className="mb-32 rounded-lg border border-border bg-card p-6 text-sm">
        Section A
      </div>
      <div id="sec-b" className="rounded-lg border border-border bg-card p-6 text-sm">
        Section B
      </div>
    </DemoStage>
  );
}

export function GsapHorizontalGallery() {
  const stageRef = useScrollStage();
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stageRef.current || !wrapRef.current) return;
      const panels = gsap.utils.toArray<HTMLElement>('.gsap-h-panel', wrapRef.current);
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          scroller: stageRef.current,
          pin: true,
          scrub: true,
          end: () => `+=${wrapRef.current!.offsetWidth}`,
        },
      });
    },
    { scope: stageRef }
  );

  return (
    <DemoStage ref={stageRef} scroll height={200} className="overflow-hidden">
      <div ref={wrapRef} className="relative h-full">
        <div className="flex h-full w-[300%]">
          {['Design', 'Build', 'Ship'].map((label) => (
            <div
              key={label}
              className="gsap-h-panel flex h-full min-w-full items-center justify-center border-r border-border bg-card text-lg font-semibold">
              {label}
            </div>
          ))}
        </div>
      </div>
    </DemoStage>
  );
}
