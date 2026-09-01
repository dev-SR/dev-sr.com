'use client';

import { mdxClientComponents } from './client';
import { mdxServerComponents } from './server';

export const mdxComponents = {
  ...mdxServerComponents,
  ...mdxClientComponents,
};

export { mdxClientComponents } from './client';
export { mdxServerComponents } from './server';
export type { FigureProps } from './figure';
