"use client"

import { useEffect, useRef } from "react"

interface MathRendererProps {
  children: string
  display?: boolean
}

export function MathRenderer({ children, display = false }: MathRendererProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const renderMath = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const katex = await import("katex")

        if (ref.current) {
          katex.default.render(children, ref.current, {
            displayMode: display,
            throwOnError: false,
            errorColor: "#ef4444",
            strict: false,
          })
        }
      } catch (error) {
        console.error("Failed to render math:", error)
        // Fallback to plain text if KaTeX fails
        if (ref.current) {
          ref.current.textContent = children
        }
      }
    }

    renderMath()
  }, [children, display])

  return (
    <span
      ref={ref}
      className={display ? "block my-4 text-center" : "inline"}
      style={{ fontSize: display ? "1.2em" : "1em" }}
    />
  )
}
