'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from './gsap-setup';
import { motionVars } from './context-safe';
import { DemoStage } from './demo-stage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function GsapDrawerSlide() {
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      gsap.to('.gsap-drawer', {
        xPercent: open ? 0 : 100,
        duration: 0.35,
        ease: 'power2.out',
      });
    },
    { scope, dependencies: [open] }
  );

  return (
    <DemoStage className="relative h-48 overflow-hidden">
      <div ref={scope} className="relative h-full w-full">
        <Button size="sm" className="absolute left-3 top-3 z-10" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Open drawer'}
        </Button>
        <aside className="gsap-drawer absolute right-0 top-0 h-full w-2/3 max-w-[200px] border-l border-border bg-card p-4 shadow-lg">
          <p className="text-sm font-medium">Settings</p>
          <p className="mt-1 text-xs text-muted-foreground">Notifications, privacy, account.</p>
        </aside>
      </div>
    </DemoStage>
  );
}

export function GsapOriginPopover() {
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      if (open) {
        gsap.fromTo(
          '.gsap-popover',
          { scale: 0.95, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.2, ease: 'power2.out', transformOrigin: 'top left' }
        );
      }
    },
    { scope, dependencies: [open] }
  );

  return (
    <DemoStage className="flex items-start justify-start p-8">
      <div ref={scope} className="relative">
        <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
          Filter
        </Button>
        {open && (
          <div className="gsap-popover absolute left-0 top-full z-10 mt-2 w-44 rounded-lg border border-border bg-card p-3 shadow-md">
            <p className="text-xs font-medium">Status</p>
            <p className="mt-1 text-xs text-muted-foreground">Active · Draft · Archived</p>
          </div>
        )}
      </div>
    </DemoStage>
  );
}

export function GsapAccordionChevron() {
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      gsap.to('.gsap-chevron', { rotation: open ? 180 : 0, duration: 0.25, ease: 'power2.out' });
      gsap.to('.gsap-panel', {
        height: open ? 'auto' : 0,
        autoAlpha: open ? 1 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    },
    { scope, dependencies: [open] }
  );

  return (
    <DemoStage className="p-4">
      <div ref={scope} className="w-full max-w-sm rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
          onClick={() => setOpen(!open)}>
          Billing details
          <span className="gsap-chevron inline-block text-muted-foreground">▼</span>
        </button>
        <div className="gsap-panel overflow-hidden px-4 pb-3 text-xs text-muted-foreground">
          Update payment method and download invoices.
        </div>
      </div>
    </DemoStage>
  );
}

export function GsapFabRotate() {
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      gsap.to('.gsap-fab-icon', { rotation: open ? 45 : 0, duration: 0.25, ease: 'power2.out' });
    },
    { scope, dependencies: [open] }
  );

  return (
    <DemoStage className="relative h-40">
      <div ref={scope} className="absolute bottom-4 right-4">
        <button
          type="button"
          className="gsap-fab flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
          onClick={() => setOpen(!open)}>
          <span className="gsap-fab-icon text-xl leading-none">+</span>
        </button>
      </div>
    </DemoStage>
  );
}

export function GsapTransformVsLayout() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to('.gsap-good', { x: 80, duration: 1, ease: 'power2.inOut', repeat: -1, yoyo: true });
      gsap.to('.gsap-bad', { left: 80, duration: 1, ease: 'power2.inOut', repeat: -1, yoyo: true });
    },
    { scope }
  );

  return (
    <DemoStage className="space-y-6 p-6">
      <div ref={scope}>
        <p className="mb-2 text-xs text-muted-foreground">Good: transform x (GPU)</p>
        <div className="relative h-10 rounded bg-muted/40">
          <div className="gsap-good absolute left-0 top-1 size-8 rounded bg-emerald-500/80" />
        </div>
        <p className="mb-2 mt-4 text-xs text-muted-foreground">Avoid: left (layout)</p>
        <div className="relative h-10 rounded bg-muted/40">
          <div className="gsap-bad absolute left-0 top-1 size-8 rounded bg-rose-500/80" />
        </div>
      </div>
    </DemoStage>
  );
}
