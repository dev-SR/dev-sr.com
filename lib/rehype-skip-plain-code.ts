import { visit } from 'unist-util-visit';
import { isPlainCodeLanguage } from '@/lib/plain-code-language';

function classList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value.trim()) return value.split(/\s+/);
  return [];
}

/**
 * Plain fences (`text` / `txt` / …) without a title skip rehype-pretty-code
 * so they render as a simple CodeBlock panel — no Shiki tokens, no figure.
 * A `title="…"` meta keeps pretty-code so the filename header still works.
 */
export function rehypeSkipPlainCode() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    visit(tree, 'element', (node, _index, parent) => {
      if (node.type !== 'element' || node.tagName !== 'code') return;
      if (!parent || parent.type !== 'element' || parent.tagName !== 'pre') return;

      const classes = classList(node.properties?.className);
      const langMatch = classes
        .map((c) => /\blanguage-([a-z0-9_+-]+)\b/i.exec(c)?.[1])
        .find(Boolean);
      const language = (langMatch ?? 'text').toLowerCase();
      if (!isPlainCodeLanguage(language)) return;

      const meta = typeof node.data?.meta === 'string' ? node.data.meta : '';
      if (/\btitle\s*=/.test(meta)) return;

      const raw =
        Array.isArray(node.children) &&
        node.children[0]?.type === 'text' &&
        typeof node.children[0].value === 'string'
          ? node.children[0].value
          : '';

      // Drop language-* so rehype-pretty-code skips theming, but keep a fence
      // marker so MDX InlineCode does not treat this as inline `code`.
      node.properties = {
        ...node.properties,
        className: [
          ...classes.filter((c) => !/\blanguage-/i.test(c)),
          'code-fence',
        ],
        'data-language': language,
      };

      parent.properties = {
        ...parent.properties,
        'data-language': language,
        __rawstring__: raw,
      };
    });
  };
}
