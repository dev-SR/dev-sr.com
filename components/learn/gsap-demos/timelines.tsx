'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from './gsap-setup';
import { motionVars } from './context-safe';
import { DemoStage } from './demo-stage';
import { Button } from '@/components/ui/button';

export function GsapModalSequence() {
  const scope = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      if (!open) return;
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from('.gsap-overlay', { autoAlpha: 0, duration: 0.2 })
        .from('.gsap-modal', motionVars({ scale: 0.95, autoAlpha: 0, duration: 0.28 }), '<0.05')
        .from('.gsap-modal-item', { y: 12, autoAlpha: 0, stagger: 0.06, duration: 0.22 }, '-=0.1');
    },
    { scope, dependencies: [open] }
  );

  return (
    <DemoStage className="relative h-56 overflow-hidden">
      <Button size="sm" className="absolute left-3 top-3 z-20" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      {open && (
        <div ref={scope} className="absolute inset-0 z-10 flex items-center justify-center">
          <div
            className="gsap-overlay absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="gsap-modal relative z-10 w-64 rounded-xl border border-border bg-card p-4 shadow-xl">
            <p className="gsap-modal-item text-sm font-semibold">Delete project?</p>
            <p className="gsap-modal-item mt-1 text-xs text-muted-foreground">
              This cannot be undone.
            </p>
            <div className="gsap-modal-item mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </DemoStage>
  );
}

export function GsapOnboardingBeat() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { duration: 0.4, ease: 'power2.out' } });
      tl.from('.gsap-step-1', { x: -20, autoAlpha: 0 })
        .from('.gsap-step-2', { x: -20, autoAlpha: 0 }, '+=0.15')
        .from('.gsap-step-3', { x: -20, autoAlpha: 0 }, '+=0.15');
    },
    { scope }
  );

  const steps = ['Connect repository', 'Configure CI', 'Deploy preview'];

  return (
    <DemoStage className="p-6">
      <div ref={scope} className="mx-auto max-w-xs space-y-3">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`gsap-step-${i + 1} flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm`}>
            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {i + 1}
            </span>
            {s}
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapSplashLetters() {
  const scope = useRef<HTMLDivElement>(null);
  const word = 'Launch';

  useGSAP(
    () => {
      gsap.from('.gsap-letter', {
        y: 24,
        autoAlpha: 0,
        rotation: 8,
        stagger: 0.04,
        duration: 0.45,
        ease: 'back.out(1.4)',
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-8">
      <div ref={scope} className="flex overflow-hidden text-2xl font-bold tracking-tight">
        {word.split('').map((letter, i) => (
          <span key={i} className="gsap-letter inline-block">
            {letter}
          </span>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapLabelTour() {
  const scope = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      tlRef.current = gsap
        .timeline({ paused: true })
        .addLabel('intro', 0)
        .to('.gsap-tour-dot', { scale: 1.3, duration: 0.3, ease: 'power2.out' }, 'intro')
        .addLabel('details', '+=0.2')
        .to('.gsap-tour-panel', { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 'details')
        .addLabel('outro', '+=0.2')
        .to('.gsap-tour-dot', { scale: 1, duration: 0.2 }, 'outro');
      tlRef.current.play();
    },
    { scope }
  );

  const labels = ['intro', 'details', 'outro'];

  return (
    <DemoStage className="space-y-4 p-6">
      <div ref={scope}>
        <div className="gsap-tour-dot mx-auto size-10 rounded-full bg-accent" />
        <div className="gsap-tour-panel mt-4 translate-y-2 rounded-lg border border-border bg-card p-3 text-center text-xs opacity-0">
          Step {step + 1}: {labels[step]}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        {labels.map((label, i) => (
          <Button
            key={label}
            size="sm"
            variant={step === i ? 'default' : 'outline'}
            onClick={() => {
              setStep(i);
              tlRef.current?.tweenTo(label);
            }}>
            {label}
          </Button>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapNotificationStack() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.gsap-notif', {
        x: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.35,
        ease: 'power2.out',
      });
    },
    { scope }
  );

  return (
    <DemoStage className="flex justify-end p-4">
      <div ref={scope} className="flex w-full max-w-[220px] flex-col gap-2">
        {['Email sent', 'Profile updated', 'Invite accepted'].map((t) => (
          <div key={t} className="gsap-notif rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm">
            {t}
          </div>
        ))}
      </div>
    </DemoStage>
  );
}

export function GsapGSDevToolsDemo() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.to('.gsap-dev-box', { x: 100, rotation: 180, duration: 1.5, ease: 'power2.inOut' })
        .to('.gsap-dev-box', { scale: 1.2, duration: 0.8, ease: 'back.out(1.5)' });
      if (process.env.NODE_ENV === 'development') {
        import('gsap/GSDevTools').then(({ GSDevTools }) => {
          gsap.registerPlugin(GSDevTools);
          GSDevTools.create({ animation: tl });
        });
      }
    },
    { scope }
  );

  return (
    <DemoStage className="p-6">
      <p className="mb-3 text-xs text-muted-foreground">Dev only — do not ship GSDevTools.</p>
      <div ref={scope} className="relative h-16 rounded bg-muted/40">
        <div className="gsap-dev-box absolute left-2 top-2 size-12 rounded-lg bg-violet-500" />
      </div>
    </DemoStage>
  );
}
