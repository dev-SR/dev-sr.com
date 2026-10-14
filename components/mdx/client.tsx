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
import { Mark, Sidenote } from './mark';
import { ComponentPreview } from './component-preview';
import { Callout } from './callout';
import { CommandBlock } from './command-block';
import { DocsFileTabs } from './docs-file-tabs';
import { InstallTab, InstallTabs } from './install-tabs';
import {
  ItemList,
  LineItem,
  ListItem,
  ListSubtitle,
  ListTitle,
} from './item-list';
import { Step, Steps } from './steps';
import { Guide, GuideStep } from './guide';
import { Mermaid } from './mermaid';
import { FlowDiagram } from './flow-diagram';
import { gsapDemoComponents } from './gsap-demos/mdx-registry';

const PathVisualizer = dynamic(() => import('@/components/PathVisualizer'), {
  loading: () => (
    <div className="mb-8 flex h-48 items-center justify-center rounded-lg border border-border bg-card/35 text-sm text-muted-foreground">
      Loading path visualizer…
    </div>
  ),
});

/** Shared MDX shortcodes + code elements — one look for blog and learn. */
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
  ComponentPreview,
  Callout,
  DocsFileTabs,
  CommandBlock,
  InstallTabs,
  InstallTab,
  ItemList,
  ListItem,
  ListTitle,
  ListSubtitle,
  LineItem,
  Step,
  Steps,
  Guide,
  GuideStep,
  Mermaid,
  FlowDiagram,
  ...gsapDemoComponents,
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
export { Figure, MdxImage } from './figure';
export type { FigureProps } from './figure';
export { Paragraph } from './typography';
