'use client';

import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { mdxComponents } from '@/components/mdx-components';

export default function ClientMDXRenderer({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  return <MDXRemote {...mdxSource} components={mdxComponents} />;
}
