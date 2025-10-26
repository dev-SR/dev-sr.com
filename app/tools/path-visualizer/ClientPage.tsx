// ClientPage.tsx
'use client';

import React, { useMemo, useState } from 'react';
import PathVisualizer from '@/components/PathVisualizer';

const sampleYaml = `MONTH 1 — Foundations:
  Goal: Build math intuition for ML and RL + Python foundations.
  Weeks:
    - Week 1:
        Title: Python & Linear Algebra
        Topics:
          - { name: "Scalars", slug: "scalars" }
          - { name: "Vectors", slug: "vectors" }
          - { name: "Matrices", slug: "matrices" }
          - { name: "Dot Product", slug: "dot-product" }
          - { name: "Transpose", slug: "transpose" }
          - { name: "Norms", slug: "norms" }
        DependsOn: []
    - Week 2:
        Title: Calculus
        Topics:
          - { name: "Derivatives", slug: "derivatives" }
          - { name: "Gradients", slug: "gradients" }
          - { name: "Chain Rule", slug: "chain-rule" }
          - { name: "Gradient Descent", slug: "gradient-descent" }
        DependsOn: ["Week 1"]
    - Week 3:
        Title: Probability
        Topics:
          - { name: "Probability", slug: "probability" }
          - { name: "Conditional Probability", slug: "conditional-probability" }
          - { name: "Independence", slug: "independence" }
        DependsOn: ["Week 1","Week 2"]
`;

export default function ClientPage() {
  const [text, setText] = useState<string>(sampleYaml);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<string>(sampleYaml);

  const apply = () => {
    setError(null);
    try {
      // quick sanity: try YAML parse via visualizer; errors handled there too
      setText(input);
    } catch (e: any) {
      setError(e?.message ?? 'Invalid input');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Curriculum Script (YAML or JSON)</label>
          <textarea
            className="w-full min-h-[260px] p-3 rounded-md border bg-background text-foreground font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-md bg-accent text-white hover:opacity-90"
              onClick={apply}
            >
              Render
            </button>
            <button
              className="px-3 py-1.5 rounded-md border"
              onClick={() => setInput(sampleYaml)}
            >
              Load Sample
            </button>
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>
        </div>
        <div>
          <PathVisualizer script={text} height={520} />
        </div>
      </div>
    </div>
  );
}