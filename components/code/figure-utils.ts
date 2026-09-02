import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';

export type FileTabItem = {
  id: string;
  label: string;
  rawString: string;
  element: ReactElement;
};

function readProp<T>(element: ReactElement, key: string): T | undefined {
  return (element.props as Record<string, unknown>)[key] as T | undefined;
}

export function extractRawString(node: ReactNode): string {
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

export function extractFigureTitle(node: ReactElement): string | undefined {
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

export function extractFigureTitleFromChildren(children: ReactNode): string | undefined {
  let title: string | undefined;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const tag = child.type;
    const isFigcaption =
      tag === 'figcaption' ||
      (child.props as Record<string, unknown>)['data-rehype-pretty-code-title'] !== undefined;

    if (isFigcaption) {
      const figChildren = (child.props as { children?: ReactNode }).children;
      if (typeof figChildren === 'string' && figChildren.trim()) {
        title = figChildren.trim();
      }
    }
  });

  return title;
}

export function extractPreMeta(children: ReactNode): { language: string; rawString: string } {
  let language = 'text';
  let rawString = '';

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === 'pre' || (child.props as Record<string, unknown>)['data-language']) {
      const props = child.props as Record<string, unknown>;
      if (typeof props['data-language'] === 'string') {
        language = props['data-language'].toLowerCase();
      }
      if (typeof props.__rawstring__ === 'string') {
        rawString = props.__rawstring__;
      }
    }
  });

  return { language, rawString };
}

function isPrettyCodeFigure(node: ReactElement): boolean {
  return readProp(node, 'data-rehype-pretty-code-figure') !== undefined;
}

function isCodeBlockWrapper(node: ReactElement): boolean {
  const className = readProp<string>(node, 'className') ?? '';
  return className.includes('code-block');
}

function findPrettyFigure(node: ReactNode): ReactElement | null {
  if (!isValidElement(node)) return null;

  if (readProp(node, 'data-rehype-pretty-code-figure') !== undefined) {
    return node;
  }

  let found: ReactElement | null = null;
  Children.forEach((node.props as { children?: ReactNode }).children, (child) => {
    if (!found) {
      found = findPrettyFigure(child);
    }
  });

  return found;
}

export function collectFileTabItems(children: ReactNode): FileTabItem[] {
  const items: FileTabItem[] = [];

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

    if (isCodeBlockWrapper(child)) {
      const label = extractFigureTitle(child) ?? extractLanguage(child) ?? `file-${index + 1}`;
      items.push({
        id: `${label}-${index}`,
        label,
        rawString: extractRawString(child),
        element: child,
      });
      return;
    }

    const figure = findPrettyFigure(child);
    if (!figure) return;

    const label = extractFigureTitle(figure) ?? `file-${index + 1}`;
    items.push({
      id: `${label}-${index}`,
      label,
      rawString: extractRawString(child),
      element: child,
    });
  });

  return items;
}

/** @deprecated Use collectFileTabItems */
export const collectCodeTabItems = collectFileTabItems;
