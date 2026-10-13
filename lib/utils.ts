import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Custom `@theme` text sizes (`text-prose-*`, `text-heading-*`) must be registered
 * as font-size, or twMerge treats them as text-color and drops them next to
 * `text-muted-foreground` / `text-foreground`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-prose',
        'text-prose-xs',
        'text-prose-sm',
        'text-prose-md',
        'text-heading-1',
        'text-heading-2',
        'text-heading-3',
        'text-heading-4',
        'text-heading-5',
        'text-heading-6',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
