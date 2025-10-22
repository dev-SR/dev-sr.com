"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronRight, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface TocItem {
  id: string
  text: string
  level: number
  element: HTMLElement
}

interface TableOfContentsProps {
  contentSelector?: string
  className?: string
}

export function TableOfContents({ contentSelector = ".mdx-content", className }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isSticky, setIsSticky] = useState(false)
  const [isAccordionOpen, setIsAccordionOpen] = useState(true)
  const [showSticky, setShowSticky] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const tocRef = useRef<HTMLDivElement>(null)
  const collapsibleContentRef = useRef<HTMLDivElement>(null)

  // Extract headings from content
  useEffect(() => {
    const extractHeadings = () => {
      const contentElement = document.querySelector(contentSelector)
      if (!contentElement) return

      const headings = contentElement.querySelectorAll("h1, h2, h3, h4, h5, h6")
      const items: TocItem[] = []

      headings.forEach((heading, index) => {
        const element = heading as HTMLElement
        let id = element.id

        // Generate ID if not present
        if (!id) {
          id =
            element.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `heading-${index}`
          element.id = id
        }

        items.push({
          id,
          text: element.textContent || "",
          level: Number.parseInt(element.tagName.charAt(1)),
          element,
        })
      })

      setTocItems(items)
    }

    // Initial extraction
    extractHeadings()

    // Re-extract if content changes (for dynamic content)
    const observer = new MutationObserver(extractHeadings)
    const contentElement = document.querySelector(contentSelector)
    if (contentElement) {
      observer.observe(contentElement, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    }

    return () => observer.disconnect()
  }, [contentSelector])

  // Intersection Observer for active section tracking
  useEffect(() => {
    if (tocItems.length === 0) return

    const observerOptions = {
      rootMargin: "-20% 0% -35% 0%",
      threshold: 0,
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting)

      if (visibleEntries.length > 0) {
        // Get the first visible heading
        const firstVisible = visibleEntries[0]
        setActiveId(firstVisible.target.id)
      }
    }, observerOptions)

    // Observe all heading elements
    tocItems.forEach((item) => {
      if (observerRef.current) {
        observerRef.current.observe(item.element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [tocItems])

  // Smooth scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80 // Account for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({
        top: y,
        behavior: "smooth",
      })

      // Update active state immediately for better UX
      setActiveId(id)
    }
  }

  // Render TOC items recursively for nested structure
  const renderTocItems = (items: TocItem[], minLevel: number = Math.min(...items.map((item) => item.level))) => {
    const groupedItems: { [key: number]: TocItem[] } = {}

    items.forEach((item) => {
      const level = item.level
      if (!groupedItems[level]) {
        groupedItems[level] = []
      }
      groupedItems[level].push(item)
    })

    return items.map((item, index) => {
      const isActive = activeId === item.id
      const indentLevel = item.level - minLevel

      return (
        <button
          key={item.id}
          onClick={() => scrollToHeading(item.id)}
          className={`
            block w-full text-left py-2 px-3 rounded-md text-sm transition-all duration-200 hover:bg-muted/50
            ${isActive ? "bg-accent/10 text-accent border-l-2 border-accent font-medium" : "text-muted-foreground hover:text-foreground"}
          `}
          style={{
            paddingLeft: `${0.75 + indentLevel * 1}rem`,
          }}
        >
          <span className="line-clamp-2">{item.text}</span>
        </button>
      )
    })
  }

  if (tocItems.length === 0) {
    return null
  }

  return (
    <>
      {/* Accordion TOC - shown at page load */}
      <div className={`mb-8 ${className}`}>
        <Card>
          <Collapsible open={isAccordionOpen} onOpenChange={setIsAccordionOpen}>
            <CardHeader className="pb-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <List className="h-5 w-5" />
                    Table of Contents
                  </CardTitle>
                  {isAccordionOpen ? (
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  ) : (
                    <ChevronRight className="h-4 w-4 transition-transform" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="pt-0" ref={collapsibleContentRef}>
                <nav className="space-y-1">{renderTocItems(tocItems)}</nav>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </>
  )
}

// Compact version for sidebar use
export function CompactTableOfContents({ contentSelector = ".mdx-content", className }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  // Extract headings from content
  useEffect(() => {
    const extractHeadings = () => {
      const contentElement = document.querySelector(contentSelector)
      if (!contentElement) return

      const headings = contentElement.querySelectorAll("h1, h2, h3, h4")
      const items: TocItem[] = []

      headings.forEach((heading, index) => {
        const element = heading as HTMLElement
        let id = element.id

        if (!id) {
          id =
            element.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `heading-${index}`
          element.id = id
        }

        items.push({
          id,
          text: element.textContent || "",
          level: Number.parseInt(element.tagName.charAt(1)),
          element,
        })
      })

      setTocItems(items)
    }

    extractHeadings()

    const observer = new MutationObserver(extractHeadings)
    const contentElement = document.querySelector(contentSelector)
    if (contentElement) {
      observer.observe(contentElement, { childList: true, subtree: true })
    }

    return () => observer.disconnect()
  }, [contentSelector])

  // Intersection Observer for active section
  useEffect(() => {
    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id)
        }
      },
      { rootMargin: "-20% 0% -35% 0%" },
    )

    tocItems.forEach((item) => observer.observe(item.element))
    return () => observer.disconnect()
  }, [tocItems])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setActiveId(id)
    }
  }

  if (tocItems.length === 0) return null

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-foreground mb-3">On This Page</h3>
      <nav className="space-y-1">
        {tocItems.map((item) => {
          const isActive = activeId === item.id
          const indentLevel = item.level - Math.min(...tocItems.map((i) => i.level))

          return (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`
                block w-full text-left py-1.5 px-2 rounded text-xs transition-all duration-200
                ${isActive ? "bg-accent/10 text-accent font-medium border-l-2 border-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}
              `}
              style={{ paddingLeft: `${0.5 + indentLevel * 0.75}rem` }}
            >
              <span className="line-clamp-2">{item.text}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
