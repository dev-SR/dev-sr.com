import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { renderMDX } from '@/lib/mdx';

const learnDirectory = path.join(process.cwd(), 'content', 'learn');

export interface LearnPageMeta {
  title: string;
  description?: string;
  icon?: string;
  order?: number;
  badge?: string;
}

export interface LearnPage {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  order?: number;
  badge?: string;
  content: string;
  mdxSource: MDXRemoteSerializeResult;
  path: string;
  courseSlug: string;
}

export interface LearnNavNode {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  badge?: string;
  order: number;
  type: 'course' | 'chapter' | 'page';
  href: string;
  children?: LearnNavNode[];
}

export interface LearnCourseSummary {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  badge?: string;
  pageCount: number;
}

export interface LearnNeighbor {
  slug: string;
  title: string;
  href: string;
}

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

function stripOrderPrefix(segment: string): string {
  return segment.replace(/^\d+-/, '');
}

function parseOrderPrefix(segment: string): number {
  const match = /^(\d+)-/.exec(segment);
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

function fileNameToSegment(fileName: string): string {
  return stripOrderPrefix(fileName.replace(/\.(md|mdx)$/, ''));
}

function segmentsToSlug(segments: string[]): string {
  return segments.map(stripOrderPrefix).join('/');
}

function relativeLearnPathToSlug(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, '/');
  const withoutExt = normalized.replace(/\.(md|mdx)$/, '');
  const parts = withoutExt.split('/');

  if (parts.at(-1) === 'index') {
    parts.pop();
  } else {
    parts[parts.length - 1] = fileNameToSegment(parts[parts.length - 1]);
  }

  return segmentsToSlug(parts);
}

function sortByOrderThenName<T extends { order: number; title: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return collator.compare(a.title, b.title);
  });
}

interface RawLearnNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  order: number;
  children?: RawLearnNode[];
}

async function discoverRawLearnTree(dir: string = learnDirectory): Promise<RawLearnNode[]> {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const items = fs.readdirSync(dir);
  const tree: RawLearnNode[] = [];

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const relativePath = path.relative(learnDirectory, fullPath);

    if (stat.isDirectory()) {
      const children = await discoverRawLearnTree(fullPath);
      if (children.length > 0) {
        tree.push({
          name: item,
          path: relativePath,
          type: 'directory',
          order: parseOrderPrefix(item),
          children,
        });
      }
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      tree.push({
        name: item.replace(/\.(md|mdx)$/, ''),
        path: relativePath,
        type: 'file',
        order: parseOrderPrefix(item),
      });
    }
  }

  return [...tree].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return collator.compare(a.name, b.name);
  });
}

async function loadLearnPageFromPath(relativePath: string): Promise<LearnPage | undefined> {
  try {
    const fullPath = path.join(learnDirectory, relativePath);
    if (!fs.existsSync(fullPath)) {
      return undefined;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const slug = relativeLearnPathToSlug(relativePath);
    const courseSlug = slug.split('/')[0] ?? slug;
    const mdxSource = await renderMDX(content);

    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description,
      icon: data.icon,
      order: data.order,
      badge: data.badge,
      content,
      mdxSource,
      path: relativePath.replace(/\\/g, '/'),
      courseSlug,
    };
  } catch (error) {
    console.error(`Error reading learn page ${relativePath}:`, error);
    return undefined;
  }
}

async function buildNavFromRaw(
  nodes: RawLearnNode[],
  parentSegments: string[] = [],
  depth: 0 | 1 | 2 = 0
): Promise<LearnNavNode[]> {
  const navNodes: LearnNavNode[] = [];

  for (const node of nodes) {
    if (node.type === 'file') {
      const slug = relativeLearnPathToSlug(node.path);
      const page = await loadLearnPageFromPath(node.path);
      if (!page) continue;

      navNodes.push({
        slug,
        title: page.title,
        description: page.description,
        icon: page.icon,
        badge: page.badge,
        order: page.order ?? node.order,
        type: depth === 0 ? 'course' : 'page',
        href: `/learn/${slug}`,
      });
      continue;
    }

    const segment = stripOrderPrefix(node.name);
    const chapterSegments = [...parentSegments, segment];
    const chapterSlug = segmentsToSlug(chapterSegments);
    const indexPath = path.join(node.path, 'index.mdx');
    const indexMdPath = path.join(node.path, 'index.md');
    const hasIndex = fs.existsSync(path.join(learnDirectory, indexPath))
      || fs.existsSync(path.join(learnDirectory, indexMdPath));

    const indexPage = hasIndex
      ? await loadLearnPageFromPath(
          fs.existsSync(path.join(learnDirectory, indexPath)) ? indexPath : indexMdPath
        )
      : undefined;

    const childPages = (node.children ?? []).filter((child) => child.type === 'file');
    const childDirs = (node.children ?? []).filter((child) => child.type === 'directory');

    const children: LearnNavNode[] = [];

    if (indexPage) {
      children.push({
        slug: indexPage.slug,
        title: indexPage.title,
        description: indexPage.description,
        icon: indexPage.icon,
        badge: indexPage.badge,
        order: indexPage.order ?? node.order,
        type: depth === 0 ? 'course' : 'page',
        href: `/learn/${indexPage.slug}`,
      });
    }

    for (const child of childPages) {
      if (child.name === 'index') continue;
      const page = await loadLearnPageFromPath(child.path);
      if (!page) continue;
      children.push({
        slug: page.slug,
        title: page.title,
        description: page.description,
        icon: page.icon,
        badge: page.badge,
        order: page.order ?? child.order,
        type: 'page',
        href: `/learn/${page.slug}`,
      });
    }

    if (childDirs.length > 0) {
      const nested = await buildNavFromRaw(childDirs, chapterSegments, depth === 0 ? 1 : 2);
      children.push(...nested);
    }

    if (children.length === 0) {
      continue;
    }

    const chapterTitle =
      indexPage?.title ??
      segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    if (depth === 0 && !indexPage && childDirs.length > 0) {
      navNodes.push({
        slug: chapterSlug,
        title: chapterTitle,
        order: node.order,
        type: 'course',
        href: children[0]?.href ?? `/learn/${chapterSlug}`,
        children: sortByOrderThenName(children),
      });
      continue;
    }

    navNodes.push({
      slug: chapterSlug,
      title: chapterTitle,
      description: indexPage?.description,
      icon: indexPage?.icon,
      badge: indexPage?.badge,
      order: node.order,
      type: depth === 0 ? 'course' : 'chapter',
      href: indexPage ? `/learn/${indexPage.slug}` : (children[0]?.href ?? `/learn/${chapterSlug}`),
      children: sortByOrderThenName(children),
    });
  }

  return sortByOrderThenName(navNodes);
}

function flattenNavLeaves(nodes: LearnNavNode[]): LearnNavNode[] {
  const leaves: LearnNavNode[] = [];

  for (const node of nodes) {
    if (node.type === 'page' || !node.children?.length) {
      leaves.push(node);
    }
    if (node.children?.length) {
      leaves.push(...flattenNavLeaves(node.children));
    }
  }

  return leaves;
}

export async function getLearnCourseNav(courseSlug: string): Promise<LearnNavNode | null> {
  const nav = await getLearnNav();
  return nav.find((node) => node.slug === courseSlug || node.slug.split('/')[0] === courseSlug) ?? null;
}

export async function getLearnNav(courseSlug?: string): Promise<LearnNavNode[]> {
  const tree = await discoverRawLearnTree();
  const nav = await buildNavFromRaw(tree);

  if (!courseSlug) {
    return nav;
  }

  const course = nav.find((node) => node.slug === courseSlug || node.slug.split('/')[0] === courseSlug);
  return course ? [course] : [];
}

export async function getLearnCourses(): Promise<LearnCourseSummary[]> {
  const nav = await getLearnNav();
  return nav
    .filter((node) => node.type === 'course')
    .map((course) => ({
      slug: course.slug.split('/')[0],
      title: course.title,
      description: course.description,
      icon: course.icon,
      badge: course.badge,
      pageCount: flattenNavLeaves([course]).length,
    }));
}

export async function getAllLearnPages(): Promise<LearnPage[]> {
  const nav = await getLearnNav();
  const slugs = flattenNavLeaves(nav).map((node) => node.slug);
  const uniqueSlugs = [...new Set(slugs)];
  const pages = await Promise.all(uniqueSlugs.map((slug) => getLearnPage(slug)));
  return pages.filter((page): page is LearnPage => Boolean(page));
}

export async function getLearnPage(slug: string): Promise<LearnPage | undefined> {
  if (!fs.existsSync(learnDirectory)) {
    return undefined;
  }

  const candidates: string[] = [];

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        const relativePath = path.relative(learnDirectory, fullPath).replace(/\\/g, '/');
        if (relativeLearnPathToSlug(relativePath) === slug) {
          candidates.push(relativePath);
        }
      }
    }
  }

  walk(learnDirectory);

  if (candidates.length === 0) {
    return undefined;
  }

  return loadLearnPageFromPath(candidates[0]);
}

export async function getLearnNeighbors(slug: string): Promise<{
  previous: LearnNeighbor | null;
  next: LearnNeighbor | null;
}> {
  const page = await getLearnPage(slug);
  if (!page) {
    return { previous: null, next: null };
  }

  const courseNav = await getLearnNav(page.courseSlug);
  const leaves = flattenNavLeaves(courseNav);
  const index = leaves.findIndex((node) => node.slug === slug);

  const previous =
    index > 0
      ? { slug: leaves[index - 1].slug, title: leaves[index - 1].title, href: leaves[index - 1].href }
      : null;
  const next =
    index >= 0 && index < leaves.length - 1
      ? { slug: leaves[index + 1].slug, title: leaves[index + 1].title, href: leaves[index + 1].href }
      : null;

  return { previous, next };
}
