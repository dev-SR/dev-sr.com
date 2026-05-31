'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const SPLASH_KEY = 'devsr:splash:v2';

export default function SiteSplash() {
  const [isVisible, setIsVisible] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.localStorage.setItem(SPLASH_KEY, 'seen');
      return;
    }

    if (window.localStorage.getItem(SPLASH_KEY)) return;

    window.localStorage.setItem(SPLASH_KEY, 'seen');
    setIsVisible(true);
  }, []);

  useGSAP(
    () => {
      if (!isVisible || !container.current) return;

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => setIsVisible(false),
      });

      timeline
        .fromTo(
          '.site-splash__grid',
          { autoAlpha: 0, scale: 1.1 },
          { autoAlpha: 1, scale: 1, duration: 1.2 },
          0
        )
        .fromTo(
          '.site-splash__mark',
          { autoAlpha: 0, scale: 0.65, rotation: -20, filter: 'blur(12px)' },
          { autoAlpha: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.8 },
          0.15
        )
        .fromTo(
          '.site-splash__name--left',
          { autoAlpha: 0, x: 48, filter: 'blur(10px)' },
          { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.7 },
          0.28
        )
        .fromTo(
          '.site-splash__name--right',
          { autoAlpha: 0, x: -48, filter: 'blur(10px)' },
          { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.7 },
          0.36
        )
        .fromTo('.site-splash__line--inner', { x: '-110%' }, { x: '255%', duration: 1.1 }, 0.42)
        .to(
          '.site-splash__name--left',
          { autoAlpha: 0, x: -48, filter: 'blur(8px)', duration: 0.45, ease: 'power2.in' },
          1.55
        )
        .to(
          '.site-splash__name--right',
          { autoAlpha: 0, x: 48, filter: 'blur(8px)', duration: 0.45, ease: 'power2.in' },
          1.55
        )
        .to(
          '.site-splash__mark',
          { scale: 1.12, rotation: 12, duration: 0.45, ease: 'power2.inOut' },
          1.55
        )
        .to(container.current, { autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 1.85);
    },
    { dependencies: [isVisible], scope: container }
  );

  if (!isVisible) return null;

  return (
    <div ref={container} className="site-splash" aria-hidden="true">
      <div className="site-splash__grid" />
      <div className="site-splash__logo">
        <span className="site-splash__name site-splash__name--left">Sharukh</span>
        <span className="site-splash__mark">
          <Image src="/logo.svg" alt="" width={76} height={76} priority />
        </span>
        <span className="site-splash__name site-splash__name--right">Rahman</span>
      </div>
      <div className="site-splash__line">
        <span className="site-splash__line--inner" />
      </div>
    </div>
  );
}
