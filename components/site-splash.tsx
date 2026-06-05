'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const SPLASH_KEY = 'devsr:splash:v4';
type SplashState = 'pending' | 'playing' | 'hidden';

function SplashWord({ text, side }: { text: string; side: 'left' | 'right' }) {
  return (
    <span
      className={`site-splash__name site-splash__name--${side} inline-flex overflow-visible whitespace-nowrap ${
        side === 'left' ? 'origin-right text-[#F08F87]' : 'origin-left text-[#ACC5D3]'
      }`}
      aria-hidden="true">
      {text.split('').map((letter, index) => (
        <span className="site-splash__letter inline-block will-change-[transform,opacity,filter]" key={`${letter}-${index}`}>
          {letter}
        </span>
      ))}
    </span>
  );
}

export default function SiteSplash() {
  const [state, setState] = useState<SplashState>('pending');
  const container = useRef<HTMLDivElement>(null);
  const originalOverflow = useRef('');

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenSplash = window.localStorage.getItem(SPLASH_KEY);

    if (reduceMotion || hasSeenSplash) {
      window.localStorage.setItem(SPLASH_KEY, 'seen');
      setState('hidden');
      return;
    }

    window.localStorage.setItem(SPLASH_KEY, 'seen');
    originalOverflow.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    setState('playing');

    return () => {
      document.documentElement.style.overflow = originalOverflow.current;
    };
  }, []);

  useGSAP(
    () => {
      if (state !== 'playing' || !container.current) return;

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          document.documentElement.style.overflow = originalOverflow.current;
          setState('hidden');
        },
      });

      timeline
        .set(container.current, { autoAlpha: 1 })
        .set('.site-splash__stage', { autoAlpha: 1 })
        .fromTo(
          '.site-splash__grid',
          { autoAlpha: 0, scale: 1.08, rotation: 1.4 },
          { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.8 },
          0
        )
        .fromTo(
          '.site-splash__panel--top',
          { yPercent: -18 },
          { yPercent: 0, duration: 0.72, ease: 'power2.out' },
          0
        )
        .fromTo(
          '.site-splash__panel--bottom',
          { yPercent: 18 },
          { yPercent: 0, duration: 0.72, ease: 'power2.out' },
          0
        )
        .fromTo(
          '.site-splash__halo',
          { autoAlpha: 0, scale: 0.74 },
          { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' },
          0.08
        )
        .fromTo(
          '.site-splash__guide',
          { autoAlpha: 0, scaleX: 0, transformOrigin: 'center' },
          { autoAlpha: 1, scaleX: 1, duration: 0.72, stagger: 0.08, ease: 'power3.out' },
          0.12
        )
        .fromTo(
          '.site-splash__lockup',
          { autoAlpha: 0, y: 24, scale: 0.98, filter: 'blur(10px)' },
          { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.72 },
          0.18
        )
        .fromTo(
          '.site-splash__mark',
          { autoAlpha: 0, scale: 0.72, rotation: -18, filter: 'blur(12px)' },
          { autoAlpha: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.76 },
          0.24
        )
        .fromTo(
          '.site-splash__letter',
          { autoAlpha: 0, y: 18, scale: 0.92, filter: 'blur(9px)' },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.54,
            stagger: { each: 0.028, from: 'center' },
          },
          0.34
        )
        .fromTo(
          '.site-splash__scan',
          { xPercent: -280, autoAlpha: 0, scaleX: 0.7 },
          { xPercent: 280, autoAlpha: 1, scaleX: 1, duration: 0.98, ease: 'power2.inOut' },
          0.58
        )
        .to(
          '.site-splash__name--left',
          {
            autoAlpha: 0,
            x: -34,
            scale: 0.92,
            filter: 'blur(6px)',
            duration: 0.48,
            ease: 'power2.inOut',
          },
          1.6
        )
        .to(
          '.site-splash__name--right',
          {
            autoAlpha: 0,
            x: 34,
            scale: 0.92,
            filter: 'blur(6px)',
            duration: 0.48,
            ease: 'power2.inOut',
          },
          1.6
        )
        .to('.site-splash__logo', { gap: 0, duration: 0.46, ease: 'power2.inOut' }, 1.64)
        .to(
          '.site-splash__mark',
          { scale: 0.92, rotation: 8, duration: 0.5, ease: 'power2.inOut' },
          1.64
        )
        .to('.site-splash__name', { width: 0, duration: 0.46, ease: 'power2.inOut' }, 1.72)
        .to(
          '.site-splash__guide',
          { autoAlpha: 0, scaleX: 0.24, duration: 0.46, ease: 'power2.inOut' },
          1.82
        )
        .to(
          '.site-splash__scan',
          { autoAlpha: 0, scaleX: 0.2, duration: 0.34, ease: 'power2.inOut' },
          1.86
        )
        .to(
          '.site-splash__stage',
          { y: -34, scale: 0.82, autoAlpha: 0, filter: 'blur(8px)', duration: 0.44, ease: 'power2.in' },
          2.1
        )
        .to(
          '.site-splash__panel--top',
          { yPercent: -101, duration: 0.72, ease: 'power4.inOut' },
          2.22
        )
        .to(
          '.site-splash__panel--bottom',
          { yPercent: 101, duration: 0.72, ease: 'power4.inOut' },
          2.22
        )
        .to(container.current, { autoAlpha: 0, duration: 0.18, ease: 'none' }, 2.86);
    },
    { dependencies: [state], scope: container }
  );

  if (state === 'hidden') return null;

  return (
    <div
      ref={container}
      className="site-splash fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-[#080a0e] text-foreground [isolation:isolate]"
      aria-hidden="true">
      <div className="site-splash__panel--top absolute inset-x-0 top-0 z-[1] h-[51%] border-b border-white/[0.09] bg-[#080a0e] [background-image:linear-gradient(90deg,rgba(240,143,135,0.06),transparent_34%,rgba(172,197,211,0.07))]" />
      <div className="site-splash__panel--bottom absolute inset-x-0 bottom-0 z-[1] h-[51%] border-t border-white/[0.09] bg-[#080a0e] [background-image:linear-gradient(90deg,rgba(240,143,135,0.06),transparent_34%,rgba(172,197,211,0.07))]" />
      <div className="site-splash__grid absolute inset-[-18%] z-[2] bg-[length:42px_42px] bg-center opacity-70 [background-image:linear-gradient(rgba(172,197,211,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(240,143,135,0.07)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_0_36%,transparent_72%)]" />

      <div className="site-splash__stage relative z-[3] grid w-[min(54rem,calc(100vw-1.5rem))] place-items-center opacity-0">
        <div className="site-splash__halo absolute left-1/2 top-1/2 h-[min(22rem,42vw)] w-[min(44rem,86vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(172,197,211,0.16),rgba(240,143,135,0.08)_34%,transparent_68%)] blur-3xl" />
        <span className="site-splash__guide absolute left-1/2 top-1/2 h-px w-[min(46rem,82vw)] -translate-x-1/2 -translate-y-[clamp(3.7rem,8vw,5rem)] bg-linear-to-r from-transparent via-[#F08F87]/35 to-transparent" />
        <span className="site-splash__guide absolute left-1/2 top-1/2 h-px w-[min(46rem,82vw)] -translate-x-1/2 translate-y-[clamp(3.7rem,8vw,5rem)] bg-linear-to-r from-transparent via-[#ACC5D3]/35 to-transparent" />

        <div className="site-splash__lockup relative grid min-h-[clamp(5.3rem,14vw,7.6rem)] w-[min(52rem,calc(100vw-1.5rem))] place-items-center overflow-visible px-[clamp(0.75rem,3vw,2rem)]">
          <div
            className="site-splash__logo relative z-[2] flex max-w-full min-w-max items-center justify-center gap-[clamp(0.45rem,1.2vw,0.75rem)] [font-family:var(--font-nunito),ui-sans-serif,system-ui] text-[clamp(2.05rem,7.1vw,4.9rem)] font-extrabold leading-none text-foreground"
            aria-label="Sharukh Rahman">
            <SplashWord text="Sharukh" side="left" />
            <span className="site-splash__mark grid size-[clamp(3.35rem,7.3vw,4.6rem)] shrink-0 place-items-center will-change-[transform,opacity,filter]">
              <Image src="/logo.svg" alt="" width={76} height={76} priority className="size-full" />
            </span>
            <SplashWord text="Rahman" side="right" />
          </div>
          <span className="site-splash__scan absolute left-1/2 top-1/2 z-[1] h-0.5 w-[min(18rem,34vw)] -translate-x-1/2 -translate-y-1/2 origin-center -skew-x-12 bg-linear-to-r from-transparent via-[#ACC5D3]/70 to-[#F08F87]/50 opacity-0 blur-[1px]" />
        </div>
      </div>
    </div>
  );
}
