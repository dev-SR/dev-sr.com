'use client';

import dynamic from 'next/dynamic';

/**
 * next-mdx-remote's MDXRemote trips an invalid-hook SSR error on blog/learn
 * client pages (React 19.2 + Next 16). Keep it off the server bundle.
 */
export const ClientMdxExcerpt = dynamic(
  () => import('./excerpt').then((mod) => mod.MdxExcerpt),
  {
    ssr: false,
    loading: () => <div className="h-6 w-3/4 max-w-xl animate-pulse rounded bg-muted/60" />,
  }
);
