import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationErrorLevel,
} from '@shikijs/transformers';
import { visit } from 'unist-util-visit';

const contentDirectory = path.join(process.cwd(), 'content');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  readingTime?: number;
  viewCount?: number;
  content: string;
  mdxSource: MDXRemoteSerializeResult;
  path: string;
}

export interface BlogTree {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: BlogTree[];
  post?: BlogPost;
}

// Recursively discover all MDX files
export async function discoverMDXFiles(dir: string = contentDirectory): Promise<BlogTree[]> {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const items = fs.readdirSync(dir);
  const tree: BlogTree[] = [];

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const relativePath = path.relative(contentDirectory, fullPath);

    if (stat.isDirectory()) {
      const children = await discoverMDXFiles(fullPath);
      if (children.length > 0) {
        tree.push({
          name: item,
          path: relativePath,
          type: 'directory',
          children,
        });
      }
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      const slug = relativePath.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/');
      const post = await getPostBySlug(slug);

      tree.push({
        name: item.replace(/\.(md|mdx)$/, ''),
        path: relativePath,
        type: 'file',
        post,
      });
    }
  }

  return tree;
}

// Get all blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  const tree = await discoverMDXFiles();
  const posts: BlogPost[] = [];

  function extractPosts(nodes: BlogTree[]) {
    for (const node of nodes) {
      if (node.type === 'file' && node.post) {
        posts.push(node.post);
      } else if (node.type === 'directory' && node.children) {
        extractPosts(node.children);
      }
    }
  }

  extractPosts(tree);
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function renderMDX(content: string): Promise<MDXRemoteSerializeResult> {
  /** @type {import('rehype-pretty-code').Options} */
  const rehypePrettyCodeOptions = {
    theme: 'dracula',
    keepBackground: false,
    transformers: [
      transformerNotationDiff(), // [!code ++] / [!code --]
      transformerNotationFocus(), // [!code focus]
      transformerNotationErrorLevel(), // [!code error], [!code warning]
    ],
  };
  return await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        [
          // https://github.com/remarkjs/remark-math/tree/main
          // render math to html; 👉KaTeX requires CSS to render correctly.
          rehypeKatex,
          { strict: false },
        ],
        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === 'element' && node?.tagName === 'pre') {
              const [codeEl] = node.children;

              if (codeEl.tagName !== 'code') return;

              node.__rawstring__ = codeEl.children?.[0].value;
            }
          });
        },
        [rehypePrettyCode, rehypePrettyCodeOptions],

        () => (tree) => {
          visit(tree, (node) => {
            if (node?.type === 'element' && node?.tagName === 'figure') {
              if (!('data-rehype-pretty-code-figure' in node.properties)) {
                return;
              }

              const preElement = node.children.at(-1);
              if (preElement.tagName !== 'pre') {
                return;
              }
              preElement.properties['__rawstring__'] = node.__rawstring__;
            }
          });
        },
      ],
      format: 'mdx',
    },
    parseFrontmatter: false,
  });
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const filePath = path.join(contentDirectory, `${slug}.md`);
    const mdxPath = path.join(contentDirectory, `${slug}.mdx`);

    let fullPath: string;
    if (fs.existsSync(filePath)) {
      fullPath = filePath;
    } else if (fs.existsSync(mdxPath)) {
      fullPath = mdxPath;
    } else {
      return undefined;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const mdxSource = await renderMDX(content);
    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt,
      tags: data.tags || [],
      readingTime: calculateReadingTime(content),
      viewCount: 0,
      content,
      mdxSource,
      path: path.relative(contentDirectory, fullPath),
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return undefined;
  }
}

// Calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Search posts
export async function searchPosts(query: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  const lowercaseQuery = query.toLowerCase();

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}
