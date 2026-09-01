'use client';

import dynamic from 'next/dynamic';
import { CodeCustom, PreCustom } from './code-elements';
import { CodeTabs, MultiFileCodeBlock } from './code-tabs';
import { PrettyCodeFigure } from './pretty-code-figure';

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
};

export { CopyButton } from './copy-button';
export { CodeFrame } from './code-frame';
export { CodeCustom, PreCustom } from './code-elements';
export { CodeTabs, MultiFileCodeBlock } from './code-tabs';
export { PrettyCodeFigure } from './pretty-code-figure';
export { Figure, MdxImage, Paragraph } from './figure';
export type { FigureProps } from './figure';
