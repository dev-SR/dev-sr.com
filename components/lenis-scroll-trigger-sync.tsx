'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Keep ScrollTrigger in sync with Lenis root smooth scroll. */
export function LenisScrollTriggerSync() {
  const lenis = useLenis();

  // Update ScrollTrigger on every Lenis scroll frame
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!lenis) return;

    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  return null;
}
