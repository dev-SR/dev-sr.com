'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const SPLASH_KEY = 'devsr:splash:v1';

export default function SiteSplash() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.localStorage.setItem(SPLASH_KEY, 'seen');
      return;
    }

    if (window.localStorage.getItem(SPLASH_KEY)) {
      return;
    }

    setIsVisible(true);
    window.localStorage.setItem(SPLASH_KEY, 'seen');

    const timer = window.setTimeout(() => setIsVisible(false), 2100);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="site-splash" aria-hidden="true">
      <div className="site-splash__grid" />
      <div className="site-splash__logo">
        <span className="site-splash__name site-splash__name--left">Sharukh</span>
        <span className="site-splash__mark">
          <Image src="/logo.svg" alt="" width={76} height={76} priority />
        </span>
        <span className="site-splash__name site-splash__name--right">Rahman</span>
      </div>
      <div className="site-splash__line" />
    </div>
  );
}
