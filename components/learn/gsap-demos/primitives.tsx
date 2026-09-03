'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { Noto_Sans_Bengali } from 'next/font/google';
import { Search } from 'lucide-react';
import { gsap, useGSAP, ScrollTrigger } from './gsap-setup';
import { motionVars } from './context-safe';
import { DemoStage } from './demo-stage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['500', '700'],
  display: 'swap',
});

/** Persistent shared-element highlight: layout width = first item; travel via x + scaleX. */
function moveSharedIndicator(
  indicator: HTMLElement,
  target: HTMLElement,
  baseWidth: number
) {
  gsap.to(indicator, {
    ...motionVars(
      {
        x: target.offsetLeft,
        scaleX: target.offsetWidth / baseWidth,
        duration: 0.28,
        ease: 'power2.inOut',
        transformOrigin: 'left center',
      },
      {
        x: target.offsetLeft,
        scaleX: target.offsetWidth / baseWidth,
        duration: 0.15,
        transformOrigin: 'left center',
      }
    ),
    overwrite: 'auto',
  });
}

function useSharedIndicator(scope: RefObject<HTMLDivElement | null>, active: number) {
  const baseWidth = useRef(0);

  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const indicator = root.querySelector<HTMLElement>('.gsap-indicator');
    const targets = root.querySelectorAll<HTMLElement>('.gsap-indicator-target');
    const target = targets[active];
    if (!indicator || !target) return;

    if (!baseWidth.current) {
      baseWidth.current = target.offsetWidth || 1;
      gsap.set(indicator, {
        width: baseWidth.current,
        x: target.offsetLeft,
        scaleX: 1,
        transformOrigin: 'left center',
      });
      return;
    }

    moveSharedIndicator(indicator, target, baseWidth.current);
  }, [scope, active]);
}

const CELLS = ['A', 'B', 'C'];
const TABS = [
  { id: 'overview', label: 'Overview', body: 'Project health, deploys, and the next release window.' },
  { id: 'analytics', label: 'Analytics', body: 'Traffic is up 12% week over week — mostly docs referrals.' },
  { id: 'billing', label: 'Billing', body: 'Invoice sent. Next charge on the 1st of the month.' },
];

/* ─── Shared element ─── */

export function GsapSharedElementPrimitive() {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useSharedIndicator(scope, active);

  return (
    <DemoStage className="p-6">
      <div ref={scope} className="relative mx-auto flex w-full max-w-xs gap-1 rounded-lg bg-muted p-1">
        <span className="gsap-indicator pointer-events-none absolute inset-y-1 left-0 rounded-md bg-card shadow-sm" />
        {CELLS.map((label, i) => (
          <button
            key={label}
            type="button"
            className={cn(
              'gsap-indicator-target relative z-10 flex-1 rounded-md px-3 py-2 text-xs font-medium',
              active === i ? 'text-foreground' : 'text-muted-foreground'
            )}
            onClick={() => setActive(i)}>
            {label}
          </button>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapSharedElementTabs() {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useSharedIndicator(scope, active);

  return (
    <DemoStage className="p-4">
      <div ref={scope} className="mx-auto w-full max-w-sm">
        <div className="relative flex gap-1 rounded-lg bg-muted p-1">
          <span className="gsap-indicator pointer-events-none absolute inset-y-1 left-0 rounded-md bg-card shadow-sm" />
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              className={cn(
                'gsap-indicator-target relative z-10 flex-1 rounded-md px-3 py-1.5 text-xs font-medium',
                active === i ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setActive(i)}>
              {tab.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{TABS[active].body}</p>
      </div>
    </DemoStage>
  );
}

/* ─── Origin-aware ─── */

const TICKS = 5;

export function GsapOriginAwarePrimitive() {
  const scope = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActiveState] = useState(0);

  const setActive = (index: number) => {
    if (!scope.current || index === activeRef.current) return;
    const prev = activeRef.current;
    const down = index > prev;
    activeRef.current = index;
    setActiveState(index);

    const bars = scope.current.querySelectorAll<HTMLElement>('.gsap-origin-bar');
    const activeBar = bars[index];
    if (!activeBar) return;

    gsap.to(bars, motionVars(
      { scaleY: 0, duration: 0.2, ease: 'power2.inOut', overwrite: 'auto' },
      { scaleY: 0, duration: 0.15 }
    ));
    gsap.set(activeBar, { transformOrigin: down ? '100% 0%' : '100% 100%' });
    gsap.to(activeBar, motionVars(
      { scaleY: 1, duration: 0.2, ease: 'power2.inOut', overwrite: 'auto' },
      { scaleY: 1, duration: 0.15 }
    ));
  };

  useGSAP(
    () => {
      const bars = scope.current?.querySelectorAll<HTMLElement>('.gsap-origin-bar');
      if (!bars?.length) return;
      gsap.set(bars, { scaleY: 0, transformOrigin: '100% 0%' });
      gsap.set(bars[0], { scaleY: 1 });
    },
    { scope }
  );

  return (
    <DemoStage className="flex justify-center p-6">
      <div ref={scope} className="w-16 border-r border-border bg-card">
        {Array.from({ length: TICKS }, (_, i) => (
          <button
            key={i}
            type="button"
            className="relative flex h-10 w-full items-center justify-center"
            onClick={() => setActive(i)}
            aria-current={active === i ? 'true' : undefined}>
            <span
              className={cn(
                'text-xs font-semibold tabular-nums',
                active === i ? 'text-foreground' : 'text-muted-foreground'
              )}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="gsap-origin-bar pointer-events-none absolute top-0 right-0 h-full w-[3px] origin-top scale-y-0 bg-accent" />
          </button>
        ))}
      </div>
    </DemoStage>
  );
}

const CHAPTERS = [
  { n: '01', color: '#ff6651', title: 'Overview', body: 'Start here — what this chapter covers and why it matters.' },
  { n: '02', color: '#63bff2', title: 'Setup', body: 'Install GSAP, register plugins once, and scope every selector.' },
  { n: '03', color: '#ffb905', title: 'Tweens', body: 'to, from, fromTo, set — four methods, one job per tween.' },
  { n: '04', color: '#705df2', title: 'Timelines', body: 'Sequence overlays, panels, and children with labels.' },
  { n: '05', color: '#adbbd0', title: 'Scroll', body: 'Nested scroller, pin, scrub — never the window in a demo.' },
  { n: '06', color: '#78d24e', title: 'Plugins', body: 'Flip, Draggable, DrawSVG — load only what the page needs.' },
  { n: '07', color: '#00fff0', title: 'Craft', body: 'Frequency first. If it is hit all day, do not animate it.' },
];

export function GsapChapterNav() {
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const clickingRef = useRef(false);
  const [active, setActiveState] = useState(0);

  const setActive = (index: number) => {
    if (!stageRef.current || index === activeRef.current) return;
    const prev = activeRef.current;
    const down = index > prev;
    activeRef.current = index;
    setActiveState(index);

    const bars = stageRef.current.querySelectorAll<HTMLElement>('.gsap-nav-bar');
    const washes = stageRef.current.querySelectorAll<HTMLElement>('.gsap-nav-wash');
    const activeBar = bars[index];
    const activeWash = washes[index];
    if (!activeBar || !activeWash) return;

    gsap.to(bars, motionVars(
      { scaleY: 0, duration: 0.2, ease: 'power2.inOut', overwrite: 'auto' },
      { scaleY: 0, duration: 0.15 }
    ));
    gsap.to(washes, motionVars(
      { autoAlpha: 0, duration: 0.2, overwrite: 'auto' },
      { autoAlpha: 0, duration: 0.15 }
    ));
    gsap.set(activeBar, { transformOrigin: down ? '100% 0%' : '100% 100%' });
    gsap.to(activeBar, motionVars(
      { scaleY: 1, duration: 0.2, ease: 'power2.inOut', overwrite: 'auto' },
      { scaleY: 1, duration: 0.15 }
    ));
    gsap.to(activeWash, motionVars(
      { autoAlpha: 0.3, duration: 0.2, ease: 'power2.out', overwrite: 'auto' },
      { autoAlpha: 0.3, duration: 0.15 }
    ));
  };

  useGSAP(
    (context, contextSafe) => {
      if (!stageRef.current || !contextSafe) return;

      const bars = stageRef.current.querySelectorAll<HTMLElement>('.gsap-nav-bar');
      const washes = stageRef.current.querySelectorAll<HTMLElement>('.gsap-nav-wash');
      gsap.set(bars, { scaleY: 0, transformOrigin: '100% 0%' });
      gsap.set(washes, { autoAlpha: 0 });
      gsap.set(bars[0], { scaleY: 1 });
      gsap.set(washes[0], { autoAlpha: 0.3 });

      const sections = gsap.utils.toArray<HTMLElement>('.gsap-chapter-section', stageRef.current);
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          scroller: stageRef.current!,
          start: 'top 40%',
          end: 'bottom 40%',
          onToggle: (self) => {
            if (clickingRef.current || !self.isActive) return;
            setActive(i);
          },
        });
      });

      const onNavClick = contextSafe((event: Event) => {
        const button = event.currentTarget as HTMLElement;
        const index = Number(button.dataset.index);
        if (Number.isNaN(index) || !stageRef.current) return;
        const target = stageRef.current.querySelector(`#gsap-chapter-${index}`);
        if (!target) return;
        clickingRef.current = true;
        setActive(index);
        gsap.to(stageRef.current, {
          duration: 0.45,
          scrollTo: { y: target, offsetY: 8 },
          ease: 'power2.inOut',
          onComplete: () => {
            clickingRef.current = false;
          },
        });
      });

      stageRef.current.querySelectorAll<HTMLElement>('.gsap-nav-item').forEach((item) => {
        item.addEventListener('click', onNavClick);
      });

      return () => {
        stageRef.current?.querySelectorAll<HTMLElement>('.gsap-nav-item').forEach((item) => {
          item.removeEventListener('click', onNavClick);
        });
      };
    },
    { scope: stageRef }
  );

  return (
    <DemoStage
      ref={stageRef}
      scroll
      height={360}
      className="flex items-start"
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch>
      <nav className="sticky top-0 w-[5.5rem] shrink-0 self-start border-r border-border bg-card">
        {CHAPTERS.map((chapter, i) => (
          <button
            key={chapter.n}
            type="button"
            data-index={i}
            className="gsap-nav-item group relative flex h-12 w-full items-center justify-center"
            style={{ '--chapter-color': chapter.color } as CSSProperties}
            aria-current={active === i ? 'true' : undefined}>
            <span
              className="gsap-nav-wash pointer-events-none absolute inset-0 opacity-0"
              style={{
                background: 'linear-gradient(to right, transparent 0%, var(--chapter-color) 100%)',
              }}
            />
            <span
              className={cn(
                'gsap-nav-number relative font-[family-name:var(--font-greycliff)] text-[1.35rem] font-extrabold transition-opacity duration-200',
                active === i
                  ? 'opacity-100'
                  : 'opacity-40 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100'
              )}>
              {chapter.n}
            </span>
            <span className="gsap-nav-bar pointer-events-none absolute top-0 right-0 h-full w-[3px] origin-top scale-y-0 bg-[var(--chapter-color)]" />
          </button>
        ))}
      </nav>
      <div className="min-w-0 flex-1">
        {CHAPTERS.map((chapter, i) => (
          <section
            key={chapter.n}
            id={`gsap-chapter-${i}`}
            className="gsap-chapter-section border-b border-border/60 px-5 py-10 last:border-b-0">
            <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
              Chapter {chapter.n}
            </p>
            <h3 className="mt-1 text-sm font-semibold text-foreground">{chapter.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{chapter.body}</p>
          </section>
        ))}
      </div>
    </DemoStage>
  );
}

/* ─── Direction-aware ─── */

export function GsapDirectionAwarePrimitive() {
  const scope = useRef<HTMLDivElement>(null);
  const prevRef = useRef(0);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const dir = Math.sign(active - prevRef.current);
      if (dir === 0) return;
      prevRef.current = active;
      gsap.fromTo(
        '.gsap-dir-panel',
        { xPercent: dir * 8, autoAlpha: 0 },
        motionVars(
          { xPercent: 0, autoAlpha: 1, duration: 0.22, ease: 'power2.out' },
          { xPercent: 0, autoAlpha: 1, duration: 0.15 }
        )
      );
    },
    { scope, dependencies: [active] }
  );

  return (
    <DemoStage className="p-4">
      <div ref={scope} className="mx-auto w-full max-w-sm">
        <div className="mb-4 flex gap-2">
          {[0, 1, 2].map((i) => (
            <Button
              key={i}
              size="sm"
              variant={active === i ? 'default' : 'outline'}
              onClick={() => setActive(i)}>
              {i + 1}
            </Button>
          ))}
        </div>
        <div className="gsap-dir-panel rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          Panel {active + 1} — slides with direction of the index change.
        </div>
      </div>
    </DemoStage>
  );
}

export function GsapDirectionAwareTabs() {
  const scope = useRef<HTMLDivElement>(null);
  const prevRef = useRef(0);
  const [active, setActive] = useState(0);
  useSharedIndicator(scope, active);

  useGSAP(
    () => {
      const dir = Math.sign(active - prevRef.current);
      if (dir === 0) return;
      prevRef.current = active;
      gsap.fromTo(
        '.gsap-dir-panel',
        { xPercent: dir * 8, autoAlpha: 0 },
        motionVars(
          { xPercent: 0, autoAlpha: 1, duration: 0.22, ease: 'power2.out' },
          { xPercent: 0, autoAlpha: 1, duration: 0.15 }
        )
      );
    },
    { scope, dependencies: [active] }
  );

  return (
    <DemoStage className="p-4">
      <div ref={scope} className="mx-auto w-full max-w-sm">
        <div className="relative flex gap-4 border-b border-border">
          <span className="gsap-indicator pointer-events-none absolute bottom-0 left-0 h-0.5 bg-foreground" />
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              className={cn(
                'gsap-indicator-target relative pb-2 text-xs font-medium',
                active === i ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setActive(i)}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="gsap-dir-panel mt-4 text-sm text-muted-foreground">{TABS[active].body}</div>
      </div>
    </DemoStage>
  );
}

/* ─── Continuity ─── */

export function GsapContinuityPrimitive() {
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      gsap.to('.gsap-continuity-track', {
        ...motionVars(
          {
            scaleX: open ? 1 : 0.35,
            duration: 0.28,
            ease: 'power3.out',
            transformOrigin: 'left center',
          },
          {
            scaleX: open ? 1 : 0.35,
            duration: 0.15,
            transformOrigin: 'left center',
          }
        ),
        overwrite: 'auto',
      });
    },
    { scope, dependencies: [open] }
  );

  return (
    <DemoStage className="flex flex-col items-center gap-4 p-8">
      <div ref={scope} className="w-full max-w-xs overflow-hidden">
        <div className="gsap-continuity-track h-3 w-full origin-left scale-x-[0.35] rounded-full bg-accent" />
      </div>
      <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>
        {open ? 'Collapse' : 'Expand'}
      </Button>
    </DemoStage>
  );
}

export function GsapSearchExpand() {
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const ready = useRef(false);

  useGSAP(
    () => {
      const track = scope.current?.querySelector('.gsap-search-track');
      const input = scope.current?.querySelector('.gsap-search-input');
      if (!track || !input) return;

      if (!ready.current) {
        ready.current = true;
        gsap.set(track, { scaleX: 0.35, transformOrigin: 'left center' });
        gsap.set(input, { autoAlpha: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
      if (open) {
        tl.to(track, motionVars(
          { scaleX: 1, duration: 0.28, ease: 'power3.out', transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.15, transformOrigin: 'left center' }
        )).to(
          input,
          motionVars(
            { autoAlpha: 1, duration: 0.18, ease: 'power2.out' },
            { autoAlpha: 1, duration: 0.12 }
          ),
          '+=0.08'
        );
      } else {
        tl.to(input, motionVars(
          { autoAlpha: 0, duration: 0.12, ease: 'power2.out' },
          { autoAlpha: 0, duration: 0.1 }
        )).to(
          track,
          motionVars(
            { scaleX: 0.35, duration: 0.28, ease: 'power3.out', transformOrigin: 'left center' },
            { scaleX: 0.35, duration: 0.15, transformOrigin: 'left center' }
          )
        );
      }
    },
    { scope, dependencies: [open] }
  );

  return (
    <DemoStage className="flex items-center justify-center p-8">
      <div ref={scope} className="flex w-full max-w-xs items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="shrink-0 transition-transform duration-150 ease-out active:scale-[0.97]"
          aria-expanded={open}
          aria-label={open ? 'Close search' : 'Open search'}
          onClick={() => setOpen((value) => !value)}>
          <Search className="size-4" />
        </Button>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="gsap-search-track origin-left scale-x-[0.35] rounded-md border border-border bg-background">
            <input
              className="gsap-search-input h-9 w-full bg-transparent px-3 text-sm opacity-0"
              placeholder="Search docs…"
              aria-hidden={!open}
              tabIndex={open ? 0 : -1}
              readOnly
            />
          </div>
        </div>
      </div>
    </DemoStage>
  );
}

/* ─── Merge ─── */

const MERGE_GLOW = '#f472b6';
const MERGE_TRAIL = '#a78bfa';
const MERGE_RING = '#38bdf8';

function spawnMergeParticles(stage: HTMLElement, x: number, y: number, color: string) {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.setAttribute('aria-hidden', 'true');
    p.className = 'pointer-events-none absolute size-1.5 rounded-full';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.background = color;
    p.style.zIndex = '20';
    stage.appendChild(p);

    const angle = (Math.PI * 2 * i) / 12;
    const dist = 28 + Math.random() * 36;

    gsap.to(p, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: 0,
      scale: 0,
      duration: 0.55 + Math.random() * 0.35,
      ease: 'power2.out',
      onComplete: () => p.remove(),
    });
  }
}

function spawnMergeGlowRing(stage: HTMLElement, x: number, y: number) {
  const ring = document.createElement('div');
  ring.setAttribute('aria-hidden', 'true');
  ring.className = 'pointer-events-none absolute size-20 rounded-full border-2';
  ring.style.left = `${x - 40}px`;
  ring.style.top = `${y - 40}px`;
  ring.style.borderColor = MERGE_RING;
  ring.style.zIndex = '15';
  stage.appendChild(ring);

  gsap.fromTo(
    ring,
    { scale: 0.45, opacity: 0.85 },
    {
      scale: 2.1,
      opacity: 0,
      duration: 0.75,
      ease: 'power2.out',
      onComplete: () => ring.remove(),
    }
  );
}

type MergeDemoConfig = {
  tileClass: string;
  resultClass: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  resultContent?: ReactNode;
  fontClassName?: string;
};

function MergeStage({
  tileClass,
  resultClass,
  leftContent,
  rightContent,
  resultContent,
  fontClassName,
}: MergeDemoConfig) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const left = root.querySelector<HTMLElement>('.gsap-merge-left');
      const right = root.querySelector<HTMLElement>('.gsap-merge-right');
      const plus = root.querySelector<HTMLElement>('.gsap-merge-plus');
      const result = root.querySelector<HTMLElement>('.gsap-merge-result');
      if (!left || !right || !result) return;

      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const stageW = root.clientWidth;
      const stageH = root.clientHeight;
      const tileW = left.offsetWidth;
      const tileH = left.offsetHeight;
      const midX = stageW / 2;
      const midY = stageH / 2;
      const rightStart = stageW - tileW;
      // Final left edge so both tile centers sit on midX — never cross past each other
      const meetLeft = midX - tileW / 2;
      const leftTravelX = meetLeft; // starts at left: 0
      const rightTravelX = meetLeft - rightStart; // starts at left: rightStart

      gsap.set(left, {
        left: 0,
        top: (stageH - tileH) / 2,
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        filter: 'none',
        transformOrigin: '50% 50%',
      });
      gsap.set(right, {
        left: rightStart,
        top: (stageH - tileH) / 2,
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        filter: 'none',
        transformOrigin: '50% 50%',
      });
      gsap.set(result, {
        left: meetLeft,
        top: (stageH - tileH) / 2,
        scale: 0.2,
        autoAlpha: 0,
        filter: 'none',
        transformOrigin: '50% 50%',
      });
      if (plus) gsap.set(plus, { autoAlpha: 1, scale: 1, y: 0 });

      if (reduce) {
        const tl = gsap.timeline();
        if (plus) tl.to(plus, { autoAlpha: 0, duration: 0.1 });
        tl.to([left, right], { autoAlpha: 0, duration: 0.12 }, 0);
        tl.to(result, { autoAlpha: 1, scale: 1, duration: 0.18, ease: 'power1.out' });
        return;
      }

      const tl = gsap.timeline();

      // 1. Anticipation — lift + glow
      tl.to([left, right], {
        y: -8,
        duration: 0.28,
        ease: 'power2.out',
        filter: `drop-shadow(0 0 14px ${MERGE_TRAIL})`,
      });

      if (plus) {
        tl.to(plus, { autoAlpha: 0, scale: 0.95, duration: 0.12, ease: 'power2.out' }, '<0.05');
      }

      // 2. Converge to the same center — scale + fade together, no overshoot
      tl.to(
        left,
        {
          x: leftTravelX,
          y: 0,
          scale: 0.35,
          autoAlpha: 0.35,
          filter: `blur(1px) drop-shadow(0 0 14px ${MERGE_TRAIL})`,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        'merge'
      ).to(
        right,
        {
          x: rightTravelX,
          y: 0,
          scale: 0.35,
          autoAlpha: 0.35,
          filter: `blur(1px) drop-shadow(0 0 14px ${MERGE_TRAIL})`,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        'merge'
      );

      // 3. Impact — particles + glow ring at midX / midY
      tl.add(() => {
        spawnMergeParticles(root, midX, midY, MERGE_GLOW);
        spawnMergeGlowRing(root, midX, midY);
      });

      // 4. Collapse into the shared point
      tl.to([left, right], {
        autoAlpha: 0,
        scale: 0.12,
        filter: 'blur(6px)',
        duration: 0.22,
        ease: 'power2.in',
      });

      // 5. Result births — elastic pop + flash
      tl.fromTo(
        result,
        {
          scale: 0.25,
          autoAlpha: 0,
          filter: 'blur(8px) brightness(2)',
        },
        {
          scale: 1,
          autoAlpha: 1,
          filter: `blur(0px) brightness(1) drop-shadow(0 0 22px ${MERGE_GLOW})`,
          duration: 0.55,
          ease: 'elastic.out(1, 0.55)',
        }
      );

      // 6. Settle glow
      tl.to(result, {
        filter: `drop-shadow(0 0 10px ${MERGE_GLOW})`,
        duration: 0.4,
        ease: 'power1.out',
      });
    },
    { scope }
  );

  return (
    <DemoStage
      className={cn(
        'flex items-center justify-center overflow-visible p-10',
        fontClassName
      )}>
      <div ref={scope} className="relative h-24 w-56 overflow-visible">
        <div
          className={cn(
            'gsap-merge-left absolute flex items-center justify-center will-change-transform',
            tileClass
          )}>
          {leftContent}
        </div>
        <span className="gsap-merge-plus pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          +
        </span>
        <div
          className={cn(
            'gsap-merge-right absolute flex items-center justify-center will-change-transform',
            tileClass
          )}>
          {rightContent}
        </div>
        <div
          className={cn(
            'gsap-merge-result absolute flex items-center justify-center will-change-transform',
            resultClass
          )}>
          {resultContent}
        </div>
      </div>
    </DemoStage>
  );
}

export function GsapMergePrimitive() {
  return (
    <MergeStage
      tileClass="size-16 rounded-xl border border-border bg-card shadow-sm"
      resultClass="size-16 rounded-xl border border-border bg-accent/80 shadow-sm"
    />
  );
}

export function GsapGlyphMerge() {
  return (
    <MergeStage
      fontClassName={notoBengali.className}
      tileClass="size-20 rounded-xl border border-border bg-card shadow-sm"
      resultClass="size-20 rounded-xl border border-border bg-card shadow-sm"
      leftContent={<span className="text-4xl font-medium leading-none">ে</span>}
      rightContent={<span className="text-4xl font-medium leading-none">ক</span>}
      resultContent={<span className="text-4xl font-medium leading-none">কে</span>}
    />
  );
}
