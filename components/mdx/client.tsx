'use client';

import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CodeCustom, PreCustom } from './code-elements';
import { CodeTabs, MultiFileCodeBlock } from './code-tabs';
import { PrettyCodeFigure } from './pretty-code-figure';
import { AuthoringPathDemo } from './authoring-path-demo';
import { AuthoringFlowDemo } from './authoring-flow-demo';
import { Mark, Sidenote } from './annotate';
import { ComponentPreview } from '@/components/learn/component-preview';
import { Callout } from '@/components/learn/callout';
import { CommandBlock } from '@/components/learn/command-block';
import { DocsFileTabs } from '@/components/learn/docs-file-tabs';
import { InstallTab, InstallTabs } from '@/components/learn/install-tabs';
import { Step, Steps } from '@/components/learn/steps';
import { Guide, GuideStep } from '@/components/learn/guide';
import { Mermaid } from '@/components/learn/mermaid';
import { FlowDiagram } from '@/components/learn/flow-diagram';

const PathVisualizer = dynamic(() => import('@/components/PathVisualizer'), {
  loading: () => (
    <div className="my-8 flex h-48 items-center justify-center rounded-lg border border-white/10 bg-card/35 text-sm text-muted-foreground">
      Loading path visualizer…
    </div>
  ),
});

export const mdxClientComponents = {
  figure: PrettyCodeFigure,
  code: CodeCustom,
  pre: PreCustom,
  CodeTabs,
  MultiFileCodeBlock,
  PathVisualizer,
  AuthoringPathDemo,
  AuthoringFlowDemo,
  Mark,
  Sidenote,
  // Learn components — available so the authoring guide can show live results
  ComponentPreview,
  Callout,
  DocsFileTabs,
  CommandBlock,
  InstallTabs,
  InstallTab,
  Step,
  Steps,
  Guide,
  GuideStep,
  Mermaid,
  FlowDiagram,
  Button,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
};

export { CopyButton } from './copy-button';
export { CodeFrame } from './code-frame';
export { CodeCustom, PreCustom } from './code-elements';
export { CodeTabs, MultiFileCodeBlock } from './code-tabs';
export { PrettyCodeFigure } from './pretty-code-figure';
export { Figure, MdxImage, Paragraph } from './figure';
export type { FigureProps } from './figure';
