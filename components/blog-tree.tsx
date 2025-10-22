"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ChevronDown, FileText, Folder } from "lucide-react"
import type { BlogTree } from "@/lib/mdx"
import { Button } from "@/components/ui/button"

interface BlogTreeProps {
  tree: BlogTree[]
  className?: string
}

interface TreeNodeProps {
  node: BlogTree
  level?: number
}

function TreeNode({ node, level = 0 }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2) // Auto-expand first 2 levels

  if (node.type === "file" && node.post) {
    return (
      <div
        className={`flex items-center py-2 px-2 hover:bg-muted/50 rounded-md transition-colors`}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
      >
        <FileText className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
        <Link
          href={`/blog/${node.post.slug}`}
          className="text-sm text-foreground hover:text-accent transition-colors truncate"
        >
          {node.post.title}
        </Link>
      </div>
    )
  }

  if (node.type === "directory" && node.children) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full justify-start py-2 px-2 h-auto font-normal hover:bg-muted/50`}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          <Folder className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
          <span className="text-sm capitalize truncate">{node.name.replace(/-/g, " ")}</span>
        </Button>
        {isExpanded && (
          <div className="mt-1">
            {node.children.map((child, index) => (
              <TreeNode key={`${child.path}-${index}`} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}

export function BlogTreeNavigation({ tree, className }: BlogTreeProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Browse Topics</h3>
      <div className="space-y-1">
        {tree.map((node, index) => (
          <TreeNode key={`${node.path}-${index}`} node={node} />
        ))}
      </div>
    </div>
  )
}
