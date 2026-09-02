import { visit } from 'unist-util-visit';

/**
 * Enables line numbers on all fenced code blocks by default.
 * Opt out with `hideLineNumbers` in the fence meta.
 */
export function rehypeDefaultLineNumbers() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (node.type !== 'element' || node.tagName !== 'code') return;
      if (!parent || parent.type !== 'element' || parent.tagName !== 'pre') return;

      const meta =
        typeof node.data?.meta === 'string' ? node.data.meta : '';

      if (meta.includes('hideLineNumbers')) return;
      if (meta.includes('showLineNumbers')) return;

      node.data = {
        ...node.data,
        meta: `${meta} showLineNumbers`.trim(),
      };
    });
  };
}
