'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CodeContainer,
  CodeContainerBody,
  CodeContainerHeader,
} from '@/components/code/code-container';
import { cn } from '@/lib/utils';

interface MermaidProps {
  chart: string;
  className?: string;
}

type ViewMode = 'preview' | 'code';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 10;
const ZOOM_STEP = 0.25;
const WHEEL_SENSITIVITY = 0.0018;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
}

function ActionButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={label}
      className="size-7 px-0 text-muted-foreground hover:bg-muted/60 hover:text-foreground">
      {children}
    </Button>
  );
}

function ViewSwitch({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Diagram view"
      className="inline-flex h-7 items-center rounded-md border border-border/70 bg-muted/40 p-0.5">
      {(['code', 'preview'] as const).map((value) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(value)}
            className={cn(
              'rounded px-2.5 text-[11px] font-medium capitalize transition-colors',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}>
            {value}
          </button>
        );
      })}
    </div>
  );
}

function MermaidHeaderActions({
  mode,
  onModeChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  showZoomReset,
  onToggleMaximize,
  maximized,
  onCopy,
  copied,
  onDownload,
  canDownload,
}: {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  showZoomReset: boolean;
  onToggleMaximize: () => void;
  maximized: boolean;
  onCopy: () => void;
  copied: boolean;
  onDownload: () => void;
  canDownload: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {mode === 'preview' && (
        <>
          {showZoomReset && (
            <ActionButton label="Reset zoom" onClick={onZoomReset}>
              <RotateCcw className="size-3.5" />
            </ActionButton>
          )}
          <ActionButton label="Zoom in" onClick={onZoomIn} disabled={zoom >= MAX_ZOOM}>
            <ZoomIn className="size-3.5" />
          </ActionButton>
          <ActionButton label="Zoom out" onClick={onZoomOut} disabled={zoom <= MIN_ZOOM}>
            <ZoomOut className="size-3.5" />
          </ActionButton>
          <ActionButton
            label={maximized ? 'Exit fullscreen' : 'Maximize'}
            onClick={onToggleMaximize}>
            {maximized ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </ActionButton>
        </>
      )}
      <ActionButton label={copied ? 'Copied' : 'Copy source'} onClick={onCopy}>
        {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
      </ActionButton>
      <ActionButton label="Download SVG" onClick={onDownload} disabled={!canDownload}>
        <Download className="size-3.5" />
      </ActionButton>
      <div className="ml-1">
        <ViewSwitch mode={mode} onChange={onModeChange} />
      </div>
    </div>
  );
}

function MermaidPreviewPane({
  svg,
  status,
  errorMessage,
  zoom,
  offset,
  onZoomChange,
  onOffsetChange,
  maximized,
}: {
  svg: string;
  status: 'idle' | 'loading' | 'ready' | 'error';
  errorMessage: string;
  zoom: number;
  offset: { x: number; y: number };
  onZoomChange: (zoom: number | ((prev: number) => number)) => void;
  onOffsetChange: (
    offset:
      | { x: number; y: number }
      | ((prev: { x: number; y: number }) => { x: number; y: number })
  ) => void;
  maximized: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    dragging.current = true;
    setIsDragging(true);
    lastPointer.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      const dx = event.clientX - lastPointer.current.x;
      const dy = event.clientY - lastPointer.current.y;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      onOffsetChange((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    },
    [onOffsetChange]
  );

  const onPointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const onWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const stage = stageRef.current;
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const cursorX = event.clientX - rect.left - rect.width / 2;
      const cursorY = event.clientY - rect.top - rect.height / 2;
      const factor = 1 - event.deltaY * WHEEL_SENSITIVITY;

      onZoomChange((prevZoom) => {
        const nextZoom = clampZoom(prevZoom * factor);
        if (nextZoom === prevZoom) return prevZoom;

        const ratio = nextZoom / prevZoom;
        onOffsetChange((prevOffset) => {
          if (nextZoom === 1) return { x: 0, y: 0 };
          return {
            x: cursorX - (cursorX - prevOffset.x) * ratio,
            y: cursorY - (cursorY - prevOffset.y) * ratio,
          };
        });

        return nextZoom;
      });
    },
    [onZoomChange, onOffsetChange]
  );

  return (
    <div
      ref={stageRef}
      className={cn(
        'relative touch-none overflow-hidden overscroll-contain bg-card/30 select-none',
        maximized ? 'min-h-0 flex-1' : 'max-h-[min(70vh,36rem)] min-h-100',
        status === 'ready' && 'cursor-grab active:cursor-grabbing'
      )}
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      onPointerDown={status === 'ready' ? onPointerDown : undefined}
      onPointerMove={status === 'ready' ? onPointerMove : undefined}
      onPointerUp={status === 'ready' ? onPointerUp : undefined}
      onPointerCancel={status === 'ready' ? onPointerUp : undefined}
      onWheel={status === 'ready' ? onWheel : undefined}>
      {status === 'loading' && (
        <p className="py-10 text-center text-sm text-muted-foreground">Rendering diagram…</p>
      )}
      {status === 'error' && (
        <p className="py-10 text-center text-sm text-destructive">{errorMessage}</p>
      )}
      {status === 'ready' && svg && (
        <div className="flex h-full min-h-100 items-center justify-center p-4 sm:p-6">
          <div
            className="origin-center will-change-transform [&_svg]:mx-auto [&_svg]:block [&_svg]:max-w-none"
            style={{
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 120ms ease-out',
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      )}
    </div>
  );
}

export function Mermaid({ chart, className }: MermaidProps) {
  const renderId = useId().replace(/:/g, '');
  const source = chart.trim();

  const [mode, setMode] = useState<ViewMode>('preview');
  const [zoom, setZoom] = useState(2);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [maximized, setMaximized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [svg, setSvg] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const viewChanged = zoom !== 1 || offset.x !== 0 || offset.y !== 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const renderChart = async () => {
      if (!source) {
        setSvg('');
        setStatus('error');
        setErrorMessage('Empty diagram.');
        return;
      }

      setStatus('loading');
      setErrorMessage('');

      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });

        const { svg: nextSvg } = await mermaid.render(`mermaid-${renderId}`, source);
        if (cancelled) return;

        setSvg(nextSvg);
        setStatus('ready');
      } catch (error) {
        console.error('Mermaid render error:', error);
        if (cancelled) return;

        setSvg('');
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to render diagram.');
      }
    };

    renderChart();

    return () => {
      cancelled = true;
    };
  }, [source, renderId]);

  useEffect(() => {
    if (!maximized) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMaximized(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [maximized]);

  const zoomIn = useCallback(() => {
    setZoom((current) => clampZoom(current + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((current) => clampZoom(current - ZOOM_STEP));
  }, []);

  const zoomReset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const copySource = useCallback(async () => {
    if (!source) return;
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }, [source]);

  const downloadSvg = useCallback(() => {
    if (!svg) return;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'diagram.svg';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }, [svg]);

  const headerActions = (
    <MermaidHeaderActions
      mode={mode}
      onModeChange={setMode}
      zoom={zoom}
      onZoomIn={zoomIn}
      onZoomOut={zoomOut}
      onZoomReset={zoomReset}
      showZoomReset={viewChanged}
      onToggleMaximize={() => setMaximized((open) => !open)}
      maximized={maximized}
      onCopy={copySource}
      copied={copied}
      onDownload={downloadSvg}
      canDownload={status === 'ready' && Boolean(svg)}
    />
  );

  const previewPane = (
    <MermaidPreviewPane
      svg={svg}
      status={status}
      errorMessage={errorMessage}
      zoom={zoom}
      offset={offset}
      onZoomChange={setZoom}
      onOffsetChange={setOffset}
      maximized={maximized}
    />
  );

  const codePane = (
    <pre
      className={cn(
        'm-0 overflow-auto overscroll-contain bg-[#131419] p-4 font-mono text-sm leading-6 text-foreground/90',
        maximized ? 'min-h-0 flex-1' : 'max-h-[min(70vh,36rem)]'
      )}
      data-lenis-prevent
      data-lenis-prevent-wheel>
      <code>{source}</code>
    </pre>
  );

  const body = mode === 'preview' ? previewPane : codePane;

  const shell = (
    <CodeContainer className={cn('not-prose my-6', maximized && 'invisible', className)}>
      <CodeContainerHeader className="h-10">
        <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          mermaid
        </span>
        {!maximized && headerActions}
      </CodeContainerHeader>
      <CodeContainerBody>{!maximized && body}</CodeContainerBody>
    </CodeContainer>
  );

  return (
    <>
      {shell}
      {mounted &&
        maximized &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Mermaid diagram fullscreen">
            <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
              <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                mermaid
                {zoom !== 1 && (
                  <span className="ml-2 normal-case text-muted-foreground/70">
                    {Math.round(zoom * 100)}%
                  </span>
                )}
              </span>
              {headerActions}
            </div>
            <div className="flex min-h-0 flex-1 flex-col">{body}</div>
          </div>,
          document.body
        )}
    </>
  );
}
