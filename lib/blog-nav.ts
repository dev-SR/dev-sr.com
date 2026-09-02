import type { BlogNavNode } from '@/lib/mdx';
import type { LearnNavNode } from '@/lib/learn';

function formatFolderTitle(name: string): string {
  return name.replace(/-/g, ' ');
}

function firstPageHref(node: LearnNavNode): string | undefined {
  if (node.type === 'page') {
    return node.href;
  }

  for (const child of node.children ?? []) {
    const href = firstPageHref(child);
    if (href) {
      return href;
    }
  }

  return undefined;
}

function mapBlogNode(node: BlogNavNode, order: number): LearnNavNode {
  if (node.type === 'file') {
    const slug = node.slug ?? node.path.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/');

    return {
      slug,
      title: node.title ?? node.name,
      order,
      type: 'page',
      href: `/blog/${slug}`,
    };
  }

  const children = (node.children ?? []).map((child, index) => mapBlogNode(child, index));
  const mapped: LearnNavNode = {
    slug: node.path.replace(/\//g, '-'),
    title: formatFolderTitle(node.name),
    order,
    type: 'chapter',
    href: '/blog',
    children,
  };

  mapped.href = firstPageHref(mapped) ?? '/blog';
  return mapped;
}

export function blogNavToLearnNav(nodes: BlogNavNode[]): LearnNavNode {
  return {
    slug: 'blog',
    title: 'Blog',
    order: 0,
    type: 'course',
    href: '/blog',
    children: nodes.map((node, index) => mapBlogNode(node, index)),
  };
}
