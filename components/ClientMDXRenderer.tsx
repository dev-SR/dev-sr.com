'use client';

import { MdxRenderer } from '@/components/mdx/renderer';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export default function ClientMDXRenderer({ mdxSource }: { mdxSource: MDXRemoteSerializeResult }) {
  return <MdxRenderer mdxSource={mdxSource} variant="blog" />;
}
