'use client';

import { FlowDiagram } from '@/components/learn/flow-diagram';

/** Hardcoded demo — avoids MDX stripping inline `script={\`...\`}` props. */
const AUTHORING_FLOW_SCRIPT = `nodes:
  - id: preview
    label: Preview
  - id: code
    label: Code tab
  - id: tabs
    label: DocsFileTabs
edges:
  - source: preview
    target: code
  - source: code
    target: tabs`;

export function AuthoringFlowDemo() {
  return <FlowDiagram height={320} script={AUTHORING_FLOW_SCRIPT} />;
}
