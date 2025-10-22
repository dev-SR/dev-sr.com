import "server-only"
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

export type NodeType = "file" | "directory"

export interface ContentMeta {
  title: string
  slug: string // slash-separated path without extension
  filePath: string // relative to content root with extension
  lastModified: string // ISO date string
  wordCount: number
  readingTime: number // minutes rounded up
  tags?: string[]
  excerpt?: string
}

export interface ContentNode {
  type: NodeType
  name: string // file or directory name without extension for files
  path: string // relative path from content root (directories have trailing name only)
  children?: ContentNode[]
  meta?: ContentMeta // only for files
}

const CONTENT_DIR = path.join(process.cwd(), "content")

// Utility: is .md or .mdx file
function isMarkdownLike(fileName: string): boolean {
  return fileName.toLowerCase().endsWith(".md") || fileName.toLowerCase().endsWith(".mdx")
}

// Utility: count words quickly
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function calcReadingTime(words: number, wpm = 200): number {
  return Math.max(1, Math.ceil(words / wpm))
}

// Build slug from relative file path
function toSlug(relativePathWithExt: string): string {
  return relativePathWithExt.replace(/\\/g, "/").replace(/\.(md|mdx)$/i, "")
}

export function scanContentTree(rootDir: string = CONTENT_DIR): ContentNode[] {
  if (!fs.existsSync(rootDir)) return []

  const entries = fs.readdirSync(rootDir, { withFileTypes: true })

  const nodes: ContentNode[] = []

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name)
    const relative = path.relative(CONTENT_DIR, fullPath)

    if (entry.isDirectory()) {
      const children = scanContentTree(fullPath)
      nodes.push({ type: "directory", name: entry.name, path: relative, children })
    } else if (entry.isFile() && isMarkdownLike(entry.name)) {
      const filePath = relative
      const slug = toSlug(filePath)

      // Read file and frontmatter
      const raw = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(raw)

      const words = countWords(content)
      const readingTime = calcReadingTime(words)
      const stat = fs.statSync(fullPath)

      const meta: ContentMeta = {
        title: String(data.title ?? path.basename(entry.name, path.extname(entry.name))),
        slug,
        filePath,
        lastModified: stat.mtime.toISOString(),
        wordCount: words,
        readingTime,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
        excerpt: typeof data.excerpt === "string" ? data.excerpt : undefined,
      }

      nodes.push({ type: "file", name: path.basename(entry.name, path.extname(entry.name)), path: filePath, meta })
    }
  }

  // Sort: directories first alphabetically, then files alphabetically
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  return nodes
}

// Flatten tree into list of files for convenience
export function flattenFiles(nodes: ContentNode[]): ContentMeta[] {
  const result: ContentMeta[] = []
  const stack: ContentNode[] = [...nodes]
  while (stack.length) {
    const node = stack.shift()!
    if (node.type === "file" && node.meta) result.push(node.meta)
    if (node.children && node.children.length) stack.unshift(...node.children)
  }
  return result
}

// Simple in-memory search over titles, tags and raw content
export function searchContent(query: string, rootDir: string = CONTENT_DIR): ContentMeta[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const tree = scanContentTree(rootDir)
  const files = flattenFiles(tree)

  // For content match we need to read files again (could be optimized/cached)
  const matched: ContentMeta[] = []
  for (const meta of files) {
    const full = path.join(CONTENT_DIR, meta.filePath)
    let raw = ""
    try {
      raw = fs.readFileSync(full, "utf8")
    } catch {
      // ignore
    }
    const body = raw.split(/^---[\s\S]*?---\s*/)[1] ?? raw
    const ok =
      meta.title.toLowerCase().includes(q) ||
      (meta.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
      body.toLowerCase().includes(q)
    if (ok) matched.push(meta)
  }
  return matched
}
