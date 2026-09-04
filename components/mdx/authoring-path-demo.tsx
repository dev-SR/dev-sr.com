'use client';

import dynamic from 'next/dynamic';

const PathVisualizer = dynamic(() => import('@/components/PathVisualizer'), {
  loading: () => (
    <div className="my-8 flex h-48 items-center justify-center rounded-lg border border-border bg-card/35 text-sm text-muted-foreground">
      Loading path visualizer…
    </div>
  ),
});

/** Hardcoded demo script — avoids MDX stripping inline `script={\`...\`}` props. */
const AUTHORING_DEMO_SCRIPT = `
MONTH 1 — Foundations:
  Weeks:
    - Week 1:
        Title: Core ideas
        Topics:
          - Frontmatter
          - Code fences
        DependsOn: []
    - Week 2:
        Title: Components
        Topics:
          - CodeTabs
          - Figure
        DependsOn: ["Week 1"]
`;

export function AuthoringPathDemo() {
  return <PathVisualizer height={420} script={AUTHORING_DEMO_SCRIPT} />;
}
