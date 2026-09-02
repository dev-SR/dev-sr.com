'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import YAML from 'yaml';
import { cn } from '@/lib/utils';

export type FlowDiagramNode = {
  id: string;
  label: string;
  type?: string;
};

export type FlowDiagramEdge = {
  id?: string;
  source: string;
  target: string;
  label?: string;
};

export type FlowDiagramProps = {
  script: string | { nodes: FlowDiagramNode[]; edges: FlowDiagramEdge[] };
  height?: number | string;
  className?: string;
};

function parseFlowScript(script: FlowDiagramProps['script']) {
  if (typeof script === 'string') {
    try {
      return JSON.parse(script) as { nodes: FlowDiagramNode[]; edges: FlowDiagramEdge[] };
    } catch {
      return YAML.parse(script) as { nodes: FlowDiagramNode[]; edges: FlowDiagramEdge[] };
    }
  }
  return script;
}

export function FlowDiagram({ script, height = 420, className }: FlowDiagramProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { nodes, edges } = useMemo(() => {
    try {
      const data = parseFlowScript(script);
      const flowNodes: Node[] = (data.nodes ?? []).map((node, index) => ({
        id: node.id,
        data: { label: node.label },
        position: { x: (index % 3) * 220, y: Math.floor(index / 3) * 120 },
        style: {
          borderRadius: 12,
          border: '1px solid var(--border)',
          background: 'var(--card)',
          color: 'var(--foreground)',
          padding: 12,
          fontSize: 12,
          minWidth: 140,
        },
      }));

      const flowEdges: Edge[] = (data.edges ?? []).map((edge, index) => ({
        id: edge.id ?? `edge-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: 'var(--accent)' },
      }));

      return { nodes: flowNodes, edges: flowEdges };
    } catch {
      return { nodes: [], edges: [] };
    }
  }, [script]);

  if (!mounted) {
    return (
      <div
        className={cn(
          'my-6 flex items-center justify-center rounded-xl border border-border bg-card/40 text-sm text-muted-foreground',
          className
        )}
        style={{ height }}>
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      className={cn('not-prose my-6 overflow-hidden rounded-xl border border-border bg-card/30', className)}
      style={{ height }}>
      <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
        <Background gap={16} color="var(--border)" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
