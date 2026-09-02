'use client';

import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { learnMdxServerComponents } from './learn-mdx-server';
import { ComponentPreview } from './component-preview';
import { CommandBlock } from './command-block';
import { DocsFileTabs } from './docs-file-tabs';
import { LearnCodeCustom, LearnPreCustom, DocsPrettyFigure } from './learn-code-elements';
import { InstallTab, InstallTabs } from './install-tabs';
import { Step, Steps } from './steps';
import { Guide, GuideStep } from './guide';
import { Mermaid } from './mermaid';
import { FlowDiagram } from './flow-diagram';

const PathVisualizer = dynamic(() => import('@/components/PathVisualizer'), {
  loading: () => (
    <div className="my-6 flex h-48 items-center justify-center rounded-xl border border-border bg-card/35 text-sm text-muted-foreground">
      Loading path visualizer…
    </div>
  ),
});

export const learnMdxClientComponents = {
  ...learnMdxServerComponents,
  figure: DocsPrettyFigure,
  code: LearnCodeCustom,
  pre: LearnPreCustom,
  ComponentPreview,
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
  PathVisualizer,
  Button,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
};

export const learnMdxComponents = learnMdxClientComponents;
