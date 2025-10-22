"use client"

import { useState, useEffect } from "react"
import { Search, X, Clock, Tag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { BlogPost } from "@/lib/mdx"
import Link from "next/link"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  posts: BlogPost[]
}

export function SearchModal({ isOpen, onClose, posts }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BlogPost[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSelectedIndex(0)
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )

    setResults(filtered.slice(0, 10))
    setSelectedIndex(0)
  }, [query, posts])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === "Enter" && results[selectedIndex]) {
        window.location.href = `/blog/${results[selectedIndex].slug}`
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose, results, selectedIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="flex items-start justify-center min-h-screen pt-16 px-4">
        <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search blog posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 bg-transparent text-lg"
                autoFocus
              />
              <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-muted/50">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!query.trim() ? (
              <div className="p-6 text-center animate-in fade-in-50 duration-300">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Start typing to search through blog posts...</p>
                <div className="mt-4 text-xs text-muted-foreground">
                  Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑</kbd>{" "}
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↓</kbd> to navigate,{" "}
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to select
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-6 text-center animate-in fade-in-50 duration-300">
                <p className="text-muted-foreground">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="p-2">
                {results.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={onClose}
                    className={`block p-4 rounded-md transition-all duration-200 group animate-in slide-in-from-left-1 ${
                      index === selectedIndex ? "bg-accent text-accent-foreground shadow-sm" : "hover:bg-muted/50"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.excerpt}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readingTime} min read
                          </div>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {post.tags.slice(0, 2).join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 transition-all duration-200 ${
                          index === selectedIndex
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                        }`}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border text-xs text-muted-foreground text-center">
            <div className="flex items-center justify-center gap-4">
              <span>
                Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> to close
              </span>
              {results.length > 0 && (
                <span>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑↓</kbd> to navigate
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
