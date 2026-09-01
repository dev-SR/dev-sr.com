import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';

export type CodeTabItem = {
  id: string;
  label: string;
  rawString: string;
  element: ReactElement;
};

function readProp<T>(element: ReactElement, key: string): T | undefined {
  return (element.props as Record<string, unknown>)[key] as T | undefined;
}

function extractRawString(node: ReactNode): string {
  if (!isValidElement(node)) return '';

  const raw = readProp<string>(node, '__rawstring__');
  if (raw) return raw;

  const children = readProp<ReactNode>(node, 'children');
  if (!children) return '';

  let result = '';
  Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      result += child;
      return;
    }
    result += extractRawString(child);
  });
  return result;
}

function extractLanguage(node: ReactElement): string {
  const language = readProp<string>(node, 'data-language');
  if (language) return language.toLowerCase();

  const children = readProp<ReactNode>(node, 'children');
  if (!children) return 'text';

  let found = 'text';
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const nested = extractLanguage(child);
      if (nested !== 'text') found = nested;
    }
  });
  return found;
}

function extractFigureTitle(node: ReactElement): string | undefined {
  const children = readProp<ReactNode>(node, 'children');
  if (!children) return undefined;

  let title: string | undefined;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const tag = child.type;
    const isFigcaption =
      tag === 'figcaption' ||
      readProp<boolean>(child, 'data-rehype-pretty-code-title') !== undefined;

    if (isFigcaption) {
      const figChildren = readProp<ReactNode>(child, 'children');
      if (typeof figChildren === 'string' && figChildren.trim()) {
        title = figChildren.trim();
      }
    }
  });

  return title;
}

function isPrettyCodeFigure(node: ReactElement): boolean {
  return readProp(node, 'data-rehype-pretty-code-figure') !== undefined;
}

function isCodeFrameWrapper(node: ReactElement): boolean {
  const className = readProp<string>(node, 'className') ?? '';
  return className.includes('mdx-code-frame');
}

export function collectCodeTabItems(children: ReactNode): CodeTabItem[] {
  const items: CodeTabItem[] = [];

  Children.forEach(children, (child, index) => {
    if (!isValidElement(child)) return;

    if (isPrettyCodeFigure(child)) {
      const label = extractFigureTitle(child) ?? `file-${index + 1}`;
      items.push({
        id: `${label}-${index}`,
        label,
        rawString: extractRawString(child),
        element: child,
      });
      return;
    }

    if (isCodeFrameWrapper(child)) {
      const label =
        extractFigureTitle(child) ?? extractLanguage(child) ?? `file-${index + 1}`;
      items.push({
        id: `${label}-${index}`,
        label,
        rawString: extractRawString(child),
        element: child,
      });
    }
  });

  return items;
}
