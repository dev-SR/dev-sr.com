'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, Flip, Draggable, Observer } from './gsap-setup';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { DemoStage } from './demo-stage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function GsapFlipGrid() {
  const scope = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState(true);

  const toggle = () => {
    if (!scope.current) return;
    const state = Flip.getState('.gsap-flip-item');
    setGrid((g) => !g);
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.5, ease: 'power2.inOut', absolute: true });
    });
  };

  return (
    <DemoStage className="p-4">
      <Button size="sm" className="mb-3" onClick={toggle}>
        Toggle layout
      </Button>
      <div
        ref={scope}
        className={cn(
          'gap-2',
          grid ? 'grid grid-cols-3' : 'flex flex-col'
        )}>
        {['Alpha', 'Beta', 'Gamma', 'Delta'].map((label) => (
          <div
            key={label}
            className="gsap-flip-item rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium">
            {label}
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapDraggableCard() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(Draggable, InertiaPlugin);
      Draggable.create('.gsap-drag-card', {
        type: 'x,y',
        bounds: scope.current,
        inertia: true,
        edgeResistance: 0.65,
      });
    },
    { scope }
  );

  return (
    <DemoStage className="relative h-48">
      <div ref={scope} className="absolute inset-2 rounded-lg border border-dashed border-border/60">
        <div className="gsap-drag-card absolute left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-lg border border-border bg-card p-3 text-xs shadow-md active:cursor-grabbing">
          Drag me
        </div>
      </div>
    </DemoStage>
  );
}

export function GsapObserverSwipe() {
  const scope = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const slides = ['Intro', 'Features', 'Pricing'];

  useGSAP(
    () => {
      Observer.create({
        target: scope.current,
        type: 'touch,pointer',
        onLeft: () => setIndex((i) => Math.min(i + 1, slides.length - 1)),
        onRight: () => setIndex((i) => Math.max(i - 1, 0)),
        tolerance: 20,
      });
    },
    { scope }
  );

  useGSAP(
    () => {
      gsap.to('.gsap-slide-track', { xPercent: -index * 100, duration: 0.35, ease: 'power2.out' });
    },
    { scope, dependencies: [index] }
  );

  return (
    <DemoStage className="overflow-hidden p-4">
      <div ref={scope} className="relative touch-pan-y">
        <div className="gsap-slide-track flex w-[300%]">
          {slides.map((s) => (
            <div
              key={s}
              className="flex min-w-full items-center justify-center rounded-lg border border-border bg-card py-10 text-sm font-medium">
              {s}
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">Swipe left / right</p>
      </div>
    </DemoStage>
  );
}

export function GsapDrawSvgLogo() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.gsap-draw-path', { drawSVG: 0, duration: 1.2, ease: 'power2.inOut' });
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-8">
      <div ref={scope}>
        <svg viewBox="0 0 120 40" className="h-12 w-36">
          <path
            className="gsap-draw-path"
            d="M10,30 L30,10 L50,30 L70,10 L90,30 L110,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </DemoStage>
  );
}

export function GsapMorphIcon() {
  const scope = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);

  useGSAP(
    () => {
      gsap.to('.gsap-morph-path', {
        morphSVG: playing ? '#pause-shape' : '#play-shape',
        duration: 0.4,
        ease: 'power2.inOut',
      });
    },
    { scope, dependencies: [playing] }
  );

  return (
    <DemoStage className="flex flex-col items-center gap-3 p-8">
      <div ref={scope}>
        <svg viewBox="0 0 24 24" className="size-10 text-foreground">
          <path
            id="play-shape"
            className="gsap-morph-path"
            d="M8,5 L19,12 L8,19 Z"
            fill="currentColor"
          />
          <path id="pause-shape" d="M7,5 H10 V19 H7 Z M14,5 H17 V19 H14 Z" fill="currentColor" />
        </svg>
      </div>
      <Button size="sm" variant="outline" onClick={() => setPlaying(!playing)}>
        Toggle play / pause
      </Button>
    </DemoStage>
  );
}

export function GsapMotionPathDot() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.gsap-dot-path', {
        duration: 3,
        repeat: -1,
        ease: 'none',
        motionPath: {
          path: '#route-path',
          align: '#route-path',
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-6">
      <div ref={scope} className="relative">
        <svg viewBox="0 0 200 80" className="h-20 w-48">
          <path
            id="route-path"
            d="M10,40 Q60,10 100,40 T190,40"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          <circle className="gsap-dot-path fill-accent" r="6" cx="10" cy="40" />
        </svg>
      </div>
    </DemoStage>
  );
}

export function GsapPhysics2D() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.gsap-ball', {
        duration: 2,
        physics2D: { velocity: 280, angle: -75, gravity: 600 },
        ease: 'none',
      });
    },
    { scope }
  );

  return (
    <DemoStage className="relative h-44 overflow-hidden">
      <div ref={scope} className="absolute inset-0">
        <div className="gsap-ball absolute bottom-4 left-1/2 size-8 -translate-x-1/2 rounded-full bg-amber-400" />
      </div>
    </DemoStage>
  );
}

export function GsapPhysicsProps() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.gsap-glide', {
        duration: 2,
        physicsProps: {
          x: { velocity: 120 },
          y: { velocity: -80, acceleration: 200 },
        },
      });
    },
    { scope }
  );

  return (
    <DemoStage className="relative h-40">
      <div ref={scope} className="absolute inset-4 rounded bg-muted/30">
        <div className="gsap-glide absolute left-4 top-4 size-8 rounded bg-sky-500" />
      </div>
    </DemoStage>
  );
}

export function GsapCustomWiggleDemo() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      import('gsap/CustomWiggle').then(({ CustomWiggle }) => {
        gsap.registerPlugin(CustomWiggle);
        CustomWiggle.create('myWiggle', { wiggles: 12, type: 'easeOut' });
        gsap.to('.gsap-wiggle-box', {
          duration: 2,
          wiggleY: 20,
          ease: 'myWiggle',
        });
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-8">
      <div ref={scope}>
        <div className="gsap-wiggle-box size-16 rounded-lg bg-violet-500/80" />
      </div>
    </DemoStage>
  );
}
