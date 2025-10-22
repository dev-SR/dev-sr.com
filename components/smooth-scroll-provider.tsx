'use client';

import { useEffect, useRef } from 'react';
import type React from 'react';
import gsap from 'gsap';
import { ReactLenis } from 'lenis/react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

type LenisRef = React.ComponentRef<typeof ReactLenis> & {
  lenis?: { raf: (time: number) => void };
};

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef | null>(null);

  useEffect(() => {
    function update(time: number) {
      // Lenis expects milliseconds, gsap gives seconds → convert
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      {children}
    </ReactLenis>
  );
}
