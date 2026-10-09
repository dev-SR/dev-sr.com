import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { cache } from 'react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { renderMDX } from '@/lib/mdx';

const learnDirectory = path.join(process.cwd(), 'content', 'learn');

export interface LearnPageMeta {
  title: string;
  excerpt?: string;
  tags?: string[];
  icon?: string;
  order?: number;
  badge?: string;
}

export interface LearnPage {
  slug: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  icon?: string;
  order?: number;
  badge?: string;
  content: string;
  mdxSource: MDXRemoteSerializeResult;
  path: string;
  courseSlug: string;
}

/** Frontmatter + path identity — no MDX/Shiki work. */
interface LearnPageRecord extends LearnPageMeta {
  slug: string;
  path: string;
  courseSlug: string;
}

export interface LearnNavNode {
  slug: string;
  title: string;
  excerpt?: string;
  tags?: string[];
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
  excerpt?: string;
  tags?: string[];
  icon?: string;
  badge?: string;
  pageCount: number;
}

export interface LearnCatalogCourse extends LearnCourseSummary {
  href: string;
  chapterCount: number;
}

export interface LearnCatalogLesson {
  title: string;
  excerpt?: string;
  href: string;
  courseSlug: string;
  courseTitle: string;
  badge?: string;
}

export interface LearnCatalog {
  courses: LearnCatalogCourse[];
  lessons: LearnCatalogLesson[];
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

function discoverRawLearnTree(dir: string = learnDirectory): RawLearnNode[] {
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
      const children = discoverRawLearnTree(fullPath);
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

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).map((tag) => tag.trim()).filter(Boolean);
}

function resolveExcerpt(data: Record<string, unknown>): string | undefined {
  if (typeof data.excerpt === 'string' && data.excerpt.trim()) return data.excerpt;
  if (typeof data.description === 'string' && data.description.trim()) return data.description;
  return undefined;
}

/** Frontmatter only — safe to call for every page when building nav. */
function loadLearnMetaFromPath(relativePath: string): LearnPageRecord | undefined {
  try {
    const fullPath = path.join(learnDirectory, relativePath);
    if (!fs.existsSync(fullPath)) {
      return undefined;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    const slug = relativeLearnPathToSlug(relativePath);
    const courseSlug = slug.split('/')[0] ?? slug;
    const excerpt = resolveExcerpt(data as Record<string, unknown>);

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt,
      tags: parseTags(data.tags),
      icon: data.icon,
      order: data.order,
      badge: data.badge,
      path: relativePath.replace(/\\/g, '/'),
      courseSlug,
    };
  } catch (error) {
    console.error(`Error reading learn meta ${relativePath}:`, error);
    return undefined;
  }
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
    const excerpt = resolveExcerpt(data as Record<string, unknown>);
    const tags = parseTags(data.tags);

    return {
      slug,
      title: data.title || 'Untitled',
      excerpt,
      tags,
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

function buildNavFromRaw(
  nodes: RawLearnNode[],
  parentSegments: string[] = [],
  depth: 0 | 1 | 2 = 0
): LearnNavNode[] {
  const navNodes: LearnNavNode[] = [];

  for (const node of nodes) {
    if (node.type === 'file') {
      const page = loadLearnMetaFromPath(node.path);
      if (!page) continue;

      navNodes.push({
        slug: page.slug,
        title: page.title,
        excerpt: page.excerpt,
        tags: page.tags,
        icon: page.icon,
        badge: page.badge,
        order: page.order ?? node.order,
        type: depth === 0 ? 'course' : 'page',
        href: `/learn/${page.slug}`,
      });
      continue;
    }

    const segment = stripOrderPrefix(node.name);
    const chapterSegments = [...parentSegments, segment];
    const chapterSlug = segmentsToSlug(chapterSegments);
    const indexPath = path.join(node.path, 'index.mdx');
    const indexMdPath = path.join(node.path, 'index.md');
    const resolvedIndexPath = fs.existsSync(path.join(learnDirectory, indexPath))
      ? indexPath
      : fs.existsSync(path.join(learnDirectory, indexMdPath))
        ? indexMdPath
        : null;

    const indexPage = resolvedIndexPath ? loadLearnMetaFromPath(resolvedIndexPath) : undefined;

    const childPages = (node.children ?? []).filter((child) => child.type === 'file');
    const childDirs = (node.children ?? []).filter((child) => child.type === 'directory');

    // index.mdx is optional. When present it sets chapter/course href + meta.
    // It is kept in `children` (same slug as parent) for static params / neighbors;
    // the sidebar hides that duplicate and only lists real sections.
    const children: LearnNavNode[] = [];

    if (indexPage) {
      children.push({
        slug: indexPage.slug,
        title: indexPage.title,
        excerpt: indexPage.excerpt,
        tags: indexPage.tags,
        icon: indexPage.icon,
        badge: indexPage.badge,
        order: indexPage.order ?? node.order,
        type: depth === 0 ? 'course' : 'page',
        href: `/learn/${indexPage.slug}`,
      });
    }

    for (const child of childPages) {
      if (child.name === 'index') continue;
      const page = loadLearnMetaFromPath(child.path);
      if (!page) continue;
      children.push({
        slug: page.slug,
        title: page.title,
        excerpt: page.excerpt,
        tags: page.tags,
        icon: page.icon,
        badge: page.badge,
        order: page.order ?? child.order,
        type: 'page',
        href: `/learn/${page.slug}`,
      });
    }

    if (childDirs.length > 0) {
      children.push(...buildNavFromRaw(childDirs, chapterSegments, depth === 0 ? 1 : 2));
    }

    if (children.length === 0) {
      continue;
    }

    const chapterTitle =
      indexPage?.title ??
      segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

    const sectionChildren = children.filter((child) => child.slug !== chapterSlug);
    const href = indexPage
      ? `/learn/${indexPage.slug}`
      : (sectionChildren[0]?.href ?? children[0]?.href ?? `/learn/${chapterSlug}`);

    if (depth === 0 && !indexPage && childDirs.length > 0) {
      navNodes.push({
        slug: chapterSlug,
        title: chapterTitle,
        order: node.order,
        type: 'course',
        href,
        children: sortByOrderThenName(children),
      });
      continue;
    }

    navNodes.push({
      slug: chapterSlug,
      title: chapterTitle,
      excerpt: indexPage?.excerpt,
      tags: indexPage?.tags,
      icon: indexPage?.icon,
      badge: indexPage?.badge,
      order: node.order,
      type: depth === 0 ? 'course' : 'chapter',
      href,
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

/** slug → relative path under content/learn */
const getSlugPathIndex = cache((): Map<string, string> => {
  const index = new Map<string, string>();

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        const relativePath = path.relative(learnDirectory, fullPath).replace(/\\/g, '/');
        const slug = relativeLearnPathToSlug(relativePath);
        if (!index.has(slug)) {
          index.set(slug, relativePath);
        }
      }
    }
  }

  walk(learnDirectory);
  return index;
});

const getLearnNavTree = cache(async (): Promise<LearnNavNode[]> => {
  return buildNavFromRaw(discoverRawLearnTree());
});

export async function getLearnCourseNav(courseSlug: string): Promise<LearnNavNode | null> {
  const nav = await getLearnNavTree();
  return nav.find((node) => node.slug === courseSlug || node.slug.split('/')[0] === courseSlug) ?? null;
}

export async function getLearnNav(courseSlug?: string): Promise<LearnNavNode[]> {
  const nav = await getLearnNavTree();

  if (!courseSlug) {
    return nav;
  }

  const course = nav.find((node) => node.slug === courseSlug || node.slug.split('/')[0] === courseSlug);
  return course ? [course] : [];
}

export async function getLearnCourses(): Promise<LearnCourseSummary[]> {
  const catalog = await getLearnCatalog();
  return catalog.courses.map(({ href: _href, chapterCount: _chapterCount, ...course }) => course);
}

export const getLearnCatalog = cache(async (): Promise<LearnCatalog> => {
  const nav = await getLearnNavTree();
  const courses: LearnCatalogCourse[] = [];
  const lessons: LearnCatalogLesson[] = [];

  for (const course of nav.filter((node) => node.type === 'course')) {
    const courseSlug = course.slug.split('/')[0];
    const leaves = flattenNavLeaves([course]);
    const chapterCount = (course.children ?? []).filter((child) => child.type === 'chapter').length;

    courses.push({
      slug: courseSlug,
      title: course.title,
      excerpt: course.excerpt,
      tags: course.tags ?? [],
      icon: course.icon,
      badge: course.badge,
      pageCount: leaves.length,
      chapterCount,
      href: course.href,
    });

    for (const leaf of leaves) {
      // Skip the course index itself — the course card already covers it
      if (leaf.slug === course.slug || leaf.slug === courseSlug) continue;

      lessons.push({
        title: leaf.title,
        excerpt: leaf.excerpt,
        href: leaf.href,
        courseSlug,
        courseTitle: course.title,
        badge: leaf.badge,
      });
    }
  }

  return { courses, lessons };
});

/** Slugs only — for generateStaticParams / sitemap (no Shiki). */
export const getAllLearnSlugs = cache(async (): Promise<string[]> => {
  const nav = await getLearnNavTree();
  return [...new Set(flattenNavLeaves(nav).map((node) => node.slug))];
});

export const getLearnPage = cache(async (slug: string): Promise<LearnPage | undefined> => {
  if (!fs.existsSync(learnDirectory)) {
    return undefined;
  }

  const relativePath = getSlugPathIndex().get(slug);
  if (!relativePath) {
    return undefined;
  }

  return loadLearnPageFromPath(relativePath);
});

/** Absolute path to the on-disk `.md` / `.mdx` for a public learn slug. */
export async function getLearnSourcePath(slug: string): Promise<string | undefined> {
  if (!slug || slug.includes('..') || !fs.existsSync(learnDirectory)) {
    return undefined;
  }

  const relativePath = getSlugPathIndex().get(slug);
  if (!relativePath || relativePath.includes('..')) {
    return undefined;
  }

  const fullPath = path.join(learnDirectory, relativePath);
  if (!fs.existsSync(fullPath)) {
    return undefined;
  }

  return fullPath;
}

export const getAllLearnPages = cache(async (): Promise<LearnPage[]> => {
  const slugs = await getAllLearnSlugs();
  const pages = await Promise.all(slugs.map((slug) => getLearnPage(slug)));
  return pages.filter((page): page is LearnPage => Boolean(page));
});

export async function getLearnNeighbors(slug: string): Promise<{
  previous: LearnNeighbor | null;
  next: LearnNeighbor | null;
}> {
  const courseSlug = slug.split('/')[0] ?? slug;
  const courseNav = await getLearnNav(courseSlug);
  const leaves = flattenNavLeaves(courseNav);
  const index = leaves.findIndex((node) => node.slug === slug);

  if (index < 0) {
    return { previous: null, next: null };
  }

  const previous =
    index > 0
      ? { slug: leaves[index - 1].slug, title: leaves[index - 1].title, href: leaves[index - 1].href }
      : null;
  const next =
    index < leaves.length - 1
      ? { slug: leaves[index + 1].slug, title: leaves[index + 1].title, href: leaves[index + 1].href }
      : null;

  return { previous, next };
}
