'use client';

import { useEffect, useId, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MermaidProps {
  chart: string;
  className?: string;
}

export function Mermaid({ chart, className }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderId = useId().replace(/:/g, '');

  useEffect(() => {
    let cancelled = false;

    const renderChart = async () => {
      if (!containerRef.current || !chart.trim()) return;

      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });

        const { svg } = await mermaid.render(`mermaid-${renderId}`, chart.trim());
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid render error:', error);
        if (!cancelled && containerRef.current) {
          containerRef.current.textContent = 'Failed to render diagram.';
        }
      }
    };

    renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, renderId]);

  return (
    <div
      className={cn(
        'not-prose my-6 overflow-x-auto rounded-xl border border-border bg-card/50 p-4 [&_svg]:mx-auto',
        className
      )}
      ref={containerRef}
    />
  );
}
