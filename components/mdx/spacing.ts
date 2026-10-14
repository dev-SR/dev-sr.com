/**
 * MDX vertical rhythm — bottom-margin stack (standard prose practice).
 * Prefer `mb-*` on blocks so adjacent tops don't fight; headings open sections with `mt-*`.
 */
export const MDX_SPACE = {
  /** Body copy, lists, tables — space *between* blocks; keep in-list leading tight */
  block: 'mb-6',
  /** Figures, blockquotes, guides, previews */
  media: 'mb-8',
  /** Thematic breaks */
  rule: 'my-10',
} as const;
