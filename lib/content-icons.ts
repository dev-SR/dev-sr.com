'use client';

import {
  BookOpen,
  Boxes,
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Copy,
  Database,
  FlaskConical,
  Layers,
  Layers3,
  MousePointer2,
  Network,
  Package,
  Play,
  ScrollText,
  Server,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Terminal,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

/** Icons for `<ListItem icon="…">` in MDX. Unknown names fall back to BookOpen. */
export const ITEM_LIST_ICONS = {
  BookOpen,
  Boxes,
  ChartNoAxesCombined,
  Cloud,
  Copy,
  FlaskConical,
  Layers,
  Package,
  Server,
  SlidersHorizontal,
  Tag,
  Terminal,
  Workflow,
} as const satisfies Record<string, LucideIcon>;

/** Icons for Learn frontmatter `icon:` (hub, sidebar, home course cards). */
export const LEARN_ICONS = {
  BookOpen,
  Boxes,
  Code2,
  Database,
  Layers3,
  MousePointer2,
  Network,
  Play,
  ScrollText,
  Server,
  Sparkles,
} as const satisfies Record<string, LucideIcon>;

export type ItemListIconName = keyof typeof ITEM_LIST_ICONS;
export type LearnIconName = keyof typeof LEARN_ICONS;
export type ContentIconSet = 'item-list' | 'learn';

export function resolveItemListIcon(name?: string): LucideIcon {
  if (!name) return BookOpen;
  return (ITEM_LIST_ICONS as Record<string, LucideIcon>)[name] ?? BookOpen;
}

export function resolveLearnIcon(name?: string): LucideIcon {
  if (!name) return BookOpen;
  return (LEARN_ICONS as Record<string, LucideIcon>)[name] ?? BookOpen;
}

export function contentIconEntries(set: ContentIconSet): Array<[string, LucideIcon]> {
  const map = set === 'learn' ? LEARN_ICONS : ITEM_LIST_ICONS;
  return Object.entries(map);
}
