// PathVisualizer.tsx
'use client';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { parseCurriculum, ParsedCurriculum, TopicItem } from '@/lib/pathParser';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import {
  ReactFlow,
  Controls,
  Handle,
  MarkerType,
  Position,
  Node as RFNode,
  Edge as RFEdge,
} from '@xyflow/react';
import ELK from 'elkjs/lib/elk.bundled.js';
import '@xyflow/react/dist/style.css';

export type PathVisualizerProps = {
  script: string | object;
  theme?: { monthColors?: Record<string, string> };
  height?: number | string;
};

type Status = 'completed' | 'current' | 'pending';

export type CurriculumNodeData = {
  id: string;
  title: string;
  topics: TopicItem[];
  monthLabel: string;
  weekLabel: string;
  optional?: boolean;
  status: Status;
  expanded: boolean;
};

// add LayoutOption type (was missing)
type LayoutOption = 'layered' | 'elk';

// rename node/edge type aliases to avoid name collision with the component
type CurriculumNodeType = RFNode<CurriculumNodeData>;
type CurriculumEdgeType = RFEdge;

const elk = new ELK();

const ELK_OPTIONS = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.spacing.baseValue': '80',
  'elk.layered.spacing.nodeNodeBetweenLayers': '140',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
};

function monthBaseFromLabel(label: string) {
  const m = /month\s*(\d+)/i.exec(label);
  return m ? `Month ${parseInt(m[1], 10)}` : label;
}

function topicToSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/* ------------------------------------------------------------------ */
/*                     DETERMINISTIC LAYERED LAYOUT                  */
/* ------------------------------------------------------------------ */
function computeLayeredLayout(
  parsed: ParsedCurriculum,
  expandedIds: Set<string>
): Map<string, { x: number; y: number; width: number; height: number }> {
  const incoming = new Map<string, string[]>();
  const nodesById = new Map(parsed.nodes.map((n) => [n.id, n]));
  parsed.nodes.forEach((n) => incoming.set(n.id, []));
  for (const e of parsed.edges) {
    incoming.get(e.target)!.push(e.source);
  }

  const depthMemo = new Map<string, number>();
  const depthOf = (id: string): number => {
    if (depthMemo.has(id)) return depthMemo.get(id)!;
    const pred = incoming.get(id) ?? [];
    if (pred.length === 0) {
      depthMemo.set(id, 0);
      return 0;
    }
    const d = 1 + Math.max(...pred.map(depthOf));
    depthMemo.set(id, d);
    return d;
  };
  for (const n of parsed.nodes) depthOf(n.id);

  const layers = new Map<number, string[]>();
  for (const n of parsed.nodes) {
    const d = depthMemo.get(n.id) ?? 0;
    if (!layers.has(d)) layers.set(d, []);
    layers.get(d)!.push(n.id);
  }

  const orderIdx = new Map(parsed.order.map((id, i) => [id, i]));
  for (const [layer, ids] of layers) {
    ids.sort((a, b) => (orderIdx.get(a) ?? 0) - (orderIdx.get(b) ?? 0));
    layers.set(layer, ids);
  }

  const NODE_W = 260;
  const SP_X = 140;
  const SP_Y = 110;

  const pos = new Map<string, { x: number; y: number; width: number; height: number }>();
  for (const [layer, ids] of Array.from(layers.entries()).sort((a, b) => a[0] - b[0])) {
    let y = 0;
    for (const id of ids) {
      const node = nodesById.get(id)!;
      const height = expandedIds.has(id)
        ? Math.min(220, 90 + (node.topics?.length ?? 0) * 18)
        : 100;
      pos.set(id, { x: layer * (NODE_W + SP_X), y, width: NODE_W, height });
      y += height + SP_Y;
    }
  }
  return pos;
}

/* ------------------------------------------------------------------ */
/*                            ELK LAYOUT                              */
/* ------------------------------------------------------------------ */
// use RFNode / RFEdge types instead of global Node/Edge
async function computeElkLayout(
  nodes: RFNode<CurriculumNodeData>[],
  edges: RFEdge[],
  expandedIds: Set<string>
): Promise<Map<string, { x: number; y: number }>> {
  const elkNodes = nodes.map((n) => ({
    id: n.id,
    width: 260,
    height: expandedIds.has(n.id)
      ? Math.min(220, 90 + (n.data.topics?.length ?? 0) * 18)
      : 100,
  }));

  const elkEdges = edges.map((e) => ({
    id: e.id,
    sources: [e.source],
    targets: [e.target],
  }));

  const graph = {
    id: 'root',
    layoutOptions: ELK_OPTIONS,
    children: elkNodes,
    edges: elkEdges,
  };

  const layout = await elk.layout(graph);
  const map = new Map<string, { x: number; y: number }>();
  layout.children?.forEach((c) => {
    if (c.x !== undefined && c.y !== undefined) {
      map.set(c.id, { x: c.x, y: c.y });
    }
  });
  return map;
}

/* ------------------------------------------------------------------ */
/*                            NODE COMPONENT                           */
/* ------------------------------------------------------------------ */
function CurriculumNode({ data }: { data: CurriculumNodeData }) {
  const colors: Record<string, string> = {
    'Month 1': '#d4e4ff',
    'Month 2': '#ffe6cc',
    'Month 3': '#eadcff',
    'Month 4': '#dfffea',
    'Month 5': '#ffe4ec',
  };
  const bg = colors[monthBaseFromLabel(data.monthLabel)] ?? '#f3f4f6';

  return (
    <div
      title={data.topics.map((t) => t.name).join(', ')}
      className={cn(
        'rounded-lg shadow-sm border border-slate-200 text-slate-800 min-w-[240px] max-w-[260px] transition-all duration-200 relative',
        data.status === 'completed' && 'opacity-50',
        data.status === 'current' && 'ring-2 ring-blue-500',
        data.optional && 'border-dashed'
      )}
      style={{ background: bg }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="nodrag"
        style={{ background: 'transparent', left: -8 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="nodrag"
        style={{ background: 'transparent', right: -8 }}
      />

      <div
        className="px-3 py-2 border-b border-black/5 flex items-center justify-between drag-handle"
        style={{ cursor: 'grab' }}
      >
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {data.weekLabel}
        </div>
        {data.optional && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/10 text-black">
            Side Quest
          </span>
        )}
      </div>

      <div className="px-3 py-2">
        <div className="font-semibold text-sm mb-1">{data.title}</div>

        {data.expanded && data.topics.length ? (
          <ul className="text-xs list-disc pl-4 space-y-1">
            {data.topics.map((t) => (
              <li key={t.slug ?? t.name}>
                <Link
                  href={`/blog/${t.slug ?? topicToSlug(t.name)}`}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="text-accent hover:underline nodrag nowheel"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-slate-600">
            {data.topics.slice(0, 3).map((t, i, arr) => (
              <span key={t.slug ?? t.name}>
                <Link
                  href={`/blog/${t.slug ?? topicToSlug(t.name)}`}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="text-accent hover:underline nodrag nowheel"
                >
                  {t.name}
                </Link>
                {i < arr.length - 1 && <span className="text-slate-400"> • </span>}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                         REACT FLOW SETTINGS                         */
/* ------------------------------------------------------------------ */
const nodeTypes = {
  curriculumNode: CurriculumNode,
};

const DEFAULT_EDGE_OPTIONS = {
  type: 'smoothstep' as const,
  animated: true,
  style: { stroke: '#2563eb', strokeWidth: 2.2, strokeDasharray: '5 5' },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#2563eb',
    width: 16,
    height: 16,
  },
};

/* ------------------------------------------------------------------ */
/*                              MAIN COMPONENT                         */
/* ------------------------------------------------------------------ */
export default function PathVisualizer({
  script,
  theme,
  height = 600,
}: PathVisualizerProps) {
  const [parsed, setParsed] = useState<ParsedCurriculum | null>(null);
  const [progressIdx, setProgressIdx] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [layout, setLayout] = useState<LayoutOption>('layered');
  const [isLayouting, setIsLayouting] = useState(false);

  // don't use useReactFlow - keep ref as any to avoid complex generic mismatch
  const rfRef = useRef<any>(null);

  const [nodes, setNodes] = useState<CurriculumNodeType[]>([]);
  const [edges, setEdges] = useState<CurriculumEdgeType[]>([]);

  /* --------------------------------------------------------------- */
  /*                         PARSE CURRICULUM                        */
  /* --------------------------------------------------------------- */
  useEffect(() => {
    try {
      const p = parseCurriculum(script, theme);
      setParsed(p);
      setProgressIdx(0);
      setExpandedIds(new Set());
    } catch (e) {
      console.error(e);
      setParsed(null);
    }
  }, [script, theme]);

  /* --------------------------------------------------------------- */
  /*                     LAYERED POSITIONS (memo)                    */
  /* --------------------------------------------------------------- */
  const layeredPos = useMemo(() => {
    if (!parsed || layout !== 'layered') return null;
    return computeLayeredLayout(parsed, expandedIds);
  }, [parsed, expandedIds, layout]);

  /* --------------------------------------------------------------- */
  /*                         APPLY LAYOUT                           */
  /* --------------------------------------------------------------- */
  const applyLayout = useCallback(async () => {
    if (!parsed) return;
    setIsLayouting(true);

    const orderMap = new Map(parsed.order.map((id, i) => [id, i]));
    const curId = parsed.order[Math.min(progressIdx, parsed.order.length - 1)];

    const baseNodes: CurriculumNodeType[] = parsed.nodes.map((src) => {
      const idx = orderMap.get(src.id) ?? Infinity;
      const status: Status =
        idx < progressIdx
          ? 'completed'
          : src.id === curId
          ? 'current'
          : 'pending';

      return {
        id: src.id,
        type: 'curriculumNode',
        draggable: layout === 'elk',
        data: {
          id: src.id,
          title: src.title,
          topics: src.topics ?? [],
          monthLabel: src.monthLabel,
          weekLabel: src.weekLabel,
          optional: src.optional,
          status,
          expanded: expandedIds.has(src.id),
        },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });

    const baseEdges: CurriculumEdgeType[] = parsed.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: 'right',
      targetHandle: 'left',
      ...DEFAULT_EDGE_OPTIONS,
    }));

    let finalNodes = [...baseNodes];

    if (layout === 'layered' && layeredPos) {
      finalNodes = baseNodes.map((n) => {
        const p = layeredPos.get(n.id) ?? { x: 0, y: 0 };
        return { ...n, position: { x: p.x, y: p.y }, draggable: false };
      });
    } else if (layout === 'elk') {
      const elkPos = await computeElkLayout(baseNodes, baseEdges, expandedIds);
      finalNodes = baseNodes.map((n) => {
        const p = elkPos.get(n.id) ?? { x: 0, y: 0 };
        return { ...n, position: p, draggable: true };
      });
    }

    setNodes(finalNodes);
    setEdges(baseEdges);

    setTimeout(() => {
      rfRef.current?.fitView({ padding: 0.2, duration: 400 });
      setIsLayouting(false);
    }, 50);
  }, [parsed, layeredPos, progressIdx, expandedIds, layout]);

  useEffect(() => {
    if (parsed) {
      // avoid "Promise returned is ignored" by explicitly void-ing the async call
      void applyLayout();
    }
  }, [parsed, applyLayout]);

  // snap back positions in layered mode
  const onNodeDragStop = useCallback(
    (_: unknown, node: RFNode<CurriculumNodeData>) => {
      if (layout === 'layered' && layeredPos) {
        const orig = layeredPos.get(node.id);
        if (orig) {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === node.id ? { ...n, position: { x: orig.x, y: orig.y } } : n
            )
          );
        }
      }
    },
    [layout, layeredPos]
  );

  /* --------------------------------------------------------------- */
  /*                              UI                                 */
  /* --------------------------------------------------------------- */
  if (!parsed) {
    return (
      <div className="border rounded-md p-4 bg-muted text-foreground">
        Failed to parse script.
      </div>
    );
  }

  const curNode = parsed.nodes.find(
    (n) => n.id === parsed.order[Math.min(progressIdx, parsed.order.length - 1)]
  );
  const hovered = hoveredId
    ? parsed.nodes.find((n) => n.id === hoveredId)
    : null;
  const summary = hovered
    ? `Exploring ${hovered.weekLabel} — ${hovered.title}`
    : curNode
      ? `Current: ${curNode.weekLabel} — ${curNode.title}`
      : '';

  return (
    <div className="w-full">
      {/* ---------- Controls ---------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
        <div className="text-sm font-medium px-3 py-2 rounded-md bg-accent/10 text-accent min-h-[36px] flex items-center">
          {summary}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* Layout selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Layout:</span>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value as LayoutOption)}
              className="text-sm border rounded px-2 py-1"
              disabled={isLayouting}
            >
              <option value="layered">Layered</option>
              <option value="elk">ELK (Auto)</option>
            </select>
          </div>

          {/* Timeline slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Timeline</span>
            <input
              type="range"
              min={0}
              max={Math.max(parsed.order.length - 1, 0)}
              value={progressIdx}
              onChange={(e) => setProgressIdx(parseInt(e.target.value, 10))}
              className="w-24"
            />
            <span className="text-slate-500 w-16 text-right">
              {progressIdx + 1} / {parsed.order.length}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- React Flow ---------- */}
      <div
        className="w-full border rounded-md bg-background relative"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {isLayouting && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-sm">Arranging nodes...</div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
          onInit={(inst: any) => {
            rfRef.current = inst;
          }}
          onNodeMouseEnter={(_: any, n: CurriculumNodeType) => setHoveredId(n.id)}
          onNodeMouseLeave={() => setHoveredId(null)}
          onNodeClick={(_: any, n: CurriculumNodeType) =>
            setExpandedIds((prev) => {
              const s = new Set(prev);
              s.has(n.id) ? s.delete(n.id) : s.add(n.id);
              return s;
            })
          }
          onNodeDragStop={onNodeDragStop}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Controls position="bottom-left" />
        </ReactFlow>
      </div>
    </div>
  );
}