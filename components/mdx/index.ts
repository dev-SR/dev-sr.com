'use client';

import { mdxClientComponents } from './client';
import { createMdxProseComponents } from './prose';
import type { MdxHeadingVariant } from './typography';

export function createMdxComponents(variant: MdxHeadingVariant = 'blog') {
  return {
    ...createMdxProseComponents(variant),
    ...mdxClientComponents,
  };
}

export const mdxComponents = createMdxComponents('blog');
export const learnMdxComponents = createMdxComponents('learn');

export { mdxClientComponents } from './client';
export { createMdxProseComponents, mdxProseComponents } from './prose';
export type { FigureProps } from './figure';
export type { MdxHeadingVariant } from './typography';
