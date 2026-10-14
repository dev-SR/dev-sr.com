/**
 * MDX vertical rhythm — bottom-margin stack (standard prose practice).
 * Prefer `mb-*` on blocks so adjacent tops don't fight; headings open sections with `mt-*`.
 */
export const MDX_SPACE = {
  /** Body copy, lists, tables, code, callouts, diagrams */
  block: 'mb-1',
  /** Figures, blockquotes, guides, previews */
  media: 'my-6',
  /** Thematic breaks */
  rule: 'my-10',
} as const;
