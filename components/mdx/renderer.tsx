'use client';

import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { learnMdxComponents, mdxComponents } from './index';
import type { MdxHeadingVariant } from './typography';

export function MdxRenderer({
  mdxSource,
  variant = 'blog',
}: {
  mdxSource: MDXRemoteSerializeResult;
  variant?: MdxHeadingVariant;
}) {
  const components = variant === 'learn' ? learnMdxComponents : mdxComponents;
  return <MDXRemote {...mdxSource} components={components} />;
}
