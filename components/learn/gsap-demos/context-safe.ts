'use client';

import { gsap } from './gsap-setup';

/** Motion vars respecting prefers-reduced-motion (gentler, not zero). */
export function motionVars(
  full: gsap.TweenVars,
  reduced?: gsap.TweenVars
): gsap.TweenVars {
  if (typeof window === 'undefined') return full;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) return full;
  return {
    ...full,
    ...(reduced ?? {
      duration: 0.15,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
    }),
  };
}

export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
