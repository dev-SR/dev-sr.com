'use client';

import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from './gsap-setup';
import { DemoStage } from './demo-stage';

export function GsapPixiSprite() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let killed = false;
      let app: import('pixi.js').Application | null = null;

      async function init() {
        const [{ Application }, { PixiPlugin }] = await Promise.all([
          import('pixi.js'),
          import('gsap/PixiPlugin'),
        ]);
        if (killed || !canvasRef.current) return;

        gsap.registerPlugin(PixiPlugin);

        app = new Application();
        await app.init({
          canvas: canvasRef.current,
          width: 280,
          height: 160,
          backgroundAlpha: 0,
          antialias: true,
        });

        const { Graphics } = await import('pixi.js');
        const sprite = new Graphics().roundRect(0, 0, 48, 48, 8).fill(0x6366f1);
        sprite.x = 20;
        sprite.y = 56;
        app.stage.addChild(sprite);

        gsap.to(sprite, {
          pixi: { x: 200, rotation: 360, scale: 1.2 },
          duration: 2,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      init();

      return () => {
        killed = true;
        app?.destroy(true);
      };
    },
    { scope }
  );

  return (
    <DemoStage className="flex items-center justify-center p-4">
      <div ref={scope}>
        <canvas ref={canvasRef} className="rounded-lg border border-border" />
      </div>
    </DemoStage>
  );
}
