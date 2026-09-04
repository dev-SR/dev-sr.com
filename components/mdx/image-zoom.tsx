'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const WHEEL_SENSITIVITY = 0.0018;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export type ImageZoomProps = {
  children: ReactNode;
  className?: string;
  backdropClassName?: string;
};

export function ImageZoom({ children, className, backdropClassName }: ImageZoomProps) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    resetView();
  }, [resetView]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const applyWheelZoom = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const cursorX = event.clientX - rect.left - rect.width / 2;
    const cursorY = event.clientY - rect.top - rect.height / 2;
    const factor = 1 - event.deltaY * WHEEL_SENSITIVITY;

    setScale((prevScale) => {
      const nextScale = clamp(prevScale * factor, MIN_SCALE, MAX_SCALE);
      const ratio = nextScale / prevScale;

      setOffset((prevOffset) => {
        if (nextScale <= MIN_SCALE + 0.01) {
          return { x: 0, y: 0 };
        }
        return {
          x: cursorX - (cursorX - prevOffset.x) * ratio,
          y: cursorY - (cursorY - prevOffset.y) * ratio,
        };
      });

      return nextScale <= MIN_SCALE + 0.01 ? MIN_SCALE : nextScale;
    });
  }, []);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    dragging.current = true;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [scale]);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = event.clientX - lastPointer.current.x;
    const dy = event.clientY - lastPointer.current.y;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onPointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const zoomBy = useCallback((factor: number) => {
    setScale((prev) => {
      const next = clamp(prev * factor, MIN_SCALE, MAX_SCALE);
      if (next <= MIN_SCALE + 0.01) {
        setOffset({ x: 0, y: 0 });
        return MIN_SCALE;
      }
      return next;
    });
  }, []);

  return (
    <>
      <button
        type="button"
        className={cn(
          'relative block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left',
          className
        )}
        onClick={() => setOpen(true)}
        aria-label="Expand image">
        {children}
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-lenis-prevent
            data-lenis-prevent-wheel
            className={cn(
              'fixed inset-0 z-[100] flex flex-col bg-background/85 text-foreground backdrop-blur-md',
              backdropClassName
            )}
            onClick={close}
            onWheel={applyWheelZoom}>
            <h2 id={titleId} className="sr-only">
              Expanded image
            </h2>

            <div
              className="absolute top-4 right-4 z-10 flex items-center gap-2"
              onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-muted"
                onClick={() => zoomBy(1 / 1.25)}
                aria-label="Zoom out"
                disabled={scale <= MIN_SCALE}>
                <ZoomOut className="size-4" />
              </button>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-muted"
                onClick={() => zoomBy(1.25)}
                aria-label="Zoom in"
                disabled={scale >= MAX_SCALE}>
                <ZoomIn className="size-4" />
              </button>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:bg-muted"
                onClick={close}
                aria-label="Close">
                <X className="size-4" />
              </button>
            </div>

            <div
              ref={stageRef}
              className={cn(
                'flex flex-1 items-center justify-center overflow-hidden p-6 sm:p-10',
                scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-out'
              )}
              onClick={(event) => {
                if (scale > 1) {
                  event.stopPropagation();
                  return;
                }
                close();
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}>
              <div
                className="max-h-full max-w-full origin-center will-change-transform [&_img]:max-h-[min(90dvh,100%)] [&_img]:max-w-[min(90dvw,100%)] [&_img]:h-auto [&_img]:w-auto [&_img]:object-contain"
                style={{
                  transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                  transition: dragging.current ? 'none' : 'transform 80ms ease-out',
                }}
                onClick={(event) => event.stopPropagation()}>
                {children}
              </div>
            </div>

            <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border/60 bg-card/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              Scroll to zoom · drag to pan · Esc to close
            </p>
          </div>,
          document.body
        )}
    </>
  );
}
