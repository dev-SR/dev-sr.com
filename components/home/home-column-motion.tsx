'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPageMotionReady } from '@/lib/page-motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HomeColumnMotionProps {
  children: ReactNode;
  className?: string;
}

/** GSAP + ScrollTrigger motion for the home content column. */
export function HomeColumnMotion({ children, className }: HomeColumnMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      let cancelled = false;

      const run = () => {
        if (cancelled || !scope.current) return;
        const el = scope.current;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const sections = Array.from(el.children).filter(
          (node): node is HTMLElement =>
            node instanceof HTMLElement && node.tagName === 'SECTION'
        );
        if (!sections.length) return;

        // —— Hero: cascade copy → console → metrics ——
        const hero = sections[0];
        const copyCol = hero.querySelector('.mx-auto.grid > div:first-child');
        const consoleCol = hero.querySelector('.mx-auto.grid > div:last-child');
        const copyBits = copyCol
          ? Array.from(copyCol.children)
          : [];
        const consoleEl = consoleCol?.querySelector('.hero-console');
        const metrics = hero.querySelectorAll('.hero-metric');

        const heroFrom = {
          opacity: 0,
          y: reduce ? 12 : 56,
          filter: reduce ? 'blur(0px)' : 'blur(8px)',
        };

        const heroTl = gsap.timeline({
          defaults: { ease: 'power3.out', overwrite: 'auto' },
        });

        if (copyBits.length) {
          heroTl.fromTo(
            copyBits,
            heroFrom,
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: reduce ? 0.4 : 1.05,
              stagger: reduce ? 0.06 : 0.18,
            },
            0.12
          );
        }

        if (consoleEl) {
          heroTl.fromTo(
            consoleEl,
            {
              opacity: 0,
              y: reduce ? 16 : 64,
              scale: reduce ? 1 : 0.97,
              filter: reduce ? 'blur(0px)' : 'blur(10px)',
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: reduce ? 0.45 : 1.15,
            },
            reduce ? '-=0.2' : '-=0.55'
          );
        }

        if (metrics.length) {
          heroTl.fromTo(
            metrics,
            { opacity: 0, y: reduce ? 0 : 28 },
            {
              opacity: 1,
              y: 0,
              duration: reduce ? 0.3 : 0.7,
              stagger: reduce ? 0.05 : 0.14,
            },
            reduce ? '-=0.1' : '-=0.45'
          );
        }

        // —— Scroll sections: heading, then cards ——
        sections.slice(1).forEach((section) => {
          const heading = section.querySelector('.mb-8');
          const strengthCards = section.querySelectorAll(
            ':scope > .mx-auto.grid > div.rounded-lg'
          );
          const courseCards = section.querySelectorAll('.grid.gap-5 > a, .grid.gap-5 > *');
          const popularCards = section.querySelectorAll('.space-y-4 > *');
          const topicCards = section.querySelectorAll(
            '.grid.gap-4 > a, .grid.gap-4 > *'
          );
          const cta = section.querySelector('.mx-auto.flex.max-w-6xl');

          const cards = Array.from(
            new Set([
              ...Array.from(strengthCards),
              ...Array.from(courseCards),
              ...Array.from(popularCards),
              ...Array.from(topicCards),
            ])
          );

          const tl = gsap.timeline({
            defaults: { ease: 'power3.out', overwrite: 'auto' },
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              toggleActions: 'play none none none',
              once: true,
            },
          });

          if (heading) {
            tl.fromTo(
              heading,
              {
                opacity: 0,
                y: reduce ? 8 : 48,
                filter: reduce ? 'blur(0px)' : 'blur(6px)',
              },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: reduce ? 0.35 : 0.95,
              }
            );
          }

          if (cards.length) {
            tl.fromTo(
              cards,
              {
                opacity: 0,
                y: reduce ? 10 : 52,
                filter: reduce ? 'blur(0px)' : 'blur(6px)',
              },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: reduce ? 0.35 : 0.85,
                stagger: {
                  each: reduce ? 0.06 : 0.16,
                  from: 'start',
                },
              },
              heading ? (reduce ? '-=0.1' : '-=0.35') : 0
            );
          } else if (cta) {
            tl.fromTo(
              cta,
              {
                opacity: 0,
                y: reduce ? 10 : 44,
                filter: reduce ? 'blur(0px)' : 'blur(6px)',
              },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: reduce ? 0.35 : 0.95,
              },
              0
            );
          } else if (!heading) {
            tl.fromTo(
              section,
              { opacity: 0, y: reduce ? 8 : 40 },
              { opacity: 1, y: 0, duration: reduce ? 0.35 : 0.9 },
              0
            );
          }
        });

        ScrollTrigger.refresh();
      };

      const unsub = onPageMotionReady(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(run);
        });
      });

      return () => {
        cancelled = true;
        unsub();
      };
    },
    { scope }
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
