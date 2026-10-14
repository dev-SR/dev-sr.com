'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from './gsap-setup';
import { motionVars } from './context-safe';
import { DemoStage } from './demo-stage';
import { DemoPressButton, DemoToast } from './ui';
import { Button } from '@/components/ui/button';

export function GsapToastExit() {
  const scope = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useGSAP(
    () => {
      if (visible) {
        gsap.from('.gsap-toast', motionVars({ y: 24, autoAlpha: 0, duration: 0.35, ease: 'power2.out' }));
      }
    },
    { scope, dependencies: [visible] }
  );

  const dismiss = () => {
    gsap.to('.gsap-toast', {
      y: 24,
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => setVisible(false),
    });
  };

  return (
    <DemoStage className="flex items-center justify-center p-6">
      <div ref={scope} className="w-full max-w-sm">
        {visible ? (
          <div className="flex items-start gap-2">
            <DemoToast />
            <Button size="sm" variant="ghost" className="shrink-0" onClick={dismiss}>
              ×
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => setVisible(true)}>
            Show again
          </Button>
        )}
      </div>
    </DemoStage>
  );
}

export function GsapSheetDismiss() {
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);

  useGSAP(
    () => {
      if (open) {
        gsap.from('.gsap-sheet', { yPercent: 100, duration: 0.4, ease: 'power2.out' });
      }
    },
    { scope, dependencies: [open] }
  );

  const close = () => {
    gsap.to('.gsap-sheet', {
      yPercent: 100,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => setOpen(false),
    });
  };

  return (
    <DemoStage className="relative h-48 overflow-hidden">
      <div ref={scope} className="relative h-full">
        {!open && (
          <Button size="sm" className="absolute left-3 top-3" onClick={() => setOpen(true)}>
            Open sheet
          </Button>
        )}
        {open && (
          <>
            <div className="absolute inset-0 bg-black/30" onClick={close} aria-hidden />
            <div className="gsap-sheet absolute bottom-0 left-0 right-0 rounded-t-xl border border-border bg-card p-4">
              <p className="text-sm font-medium">Share link</p>
              <p className="text-xs text-muted-foreground">Copy or send to your team.</p>
            </div>
          </>
        )}
      </div>
    </DemoStage>
  );
}

export function GsapListAddRemove() {
  const scope = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(['Design review', 'API spec']);

  useGSAP(
    () => {
      gsap.from('.gsap-list-item:last-child', {
        height: 0,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    },
    { scope, dependencies: [items.length] }
  );

  return (
    <DemoStage className="p-4">
      <div ref={scope} className="mx-auto w-full max-w-xs space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="gsap-list-item overflow-hidden rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {item}
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => setItems((prev) => [...prev, `Task ${prev.length + 1}`])}>
          Add item
        </Button>
      </div>
    </DemoStage>
  );
}

export function GsapErrorShake() {
  const scope = useRef<HTMLDivElement>(null);

  const shake = () => {
    gsap.fromTo(
      '.gsap-shake-field',
      { x: 0 },
      { x: 8, duration: 0.08, repeat: 5, yoyo: true, ease: 'power1.inOut' }
    );
  };

  return (
    <DemoStage className="space-y-3 p-6">
      <div ref={scope}>
        <input
          className="gsap-shake-field w-full max-w-xs rounded-md border border-destructive/50 bg-background px-3 py-2 text-sm"
          placeholder="Invalid email"
          readOnly
          defaultValue="not-an-email"
        />
      </div>
      <Button size="sm" variant="destructive" onClick={shake}>
        Submit (error)
      </Button>
    </DemoStage>
  );
}

export function GsapCssPressOnly() {
  return (
    <DemoStage className="flex flex-col items-center gap-3 p-8">
      <DemoPressButton />
      <p className="max-w-xs text-center text-xs text-muted-foreground">
        High-frequency press feedback — CSS only, not GSAP.
      </p>
    </DemoStage>
  );
}
