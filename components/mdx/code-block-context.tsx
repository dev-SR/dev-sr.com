'use client';

import { createContext, useContext } from 'react';

const CodeTabsContext = createContext(false);
const PrettyCodeFigureContext = createContext(false);

export function CodeTabsProvider({ children }: { children: React.ReactNode }) {
  return <CodeTabsContext.Provider value={true}>{children}</CodeTabsContext.Provider>;
}

export function PrettyCodeFigureProvider({ children }: { children: React.ReactNode }) {
  return <PrettyCodeFigureContext.Provider value={true}>{children}</PrettyCodeFigureContext.Provider>;
}

export function useInCodeTabs() {
  return useContext(CodeTabsContext);
}

export function useInPrettyCodeFigure() {
  return useContext(PrettyCodeFigureContext);
}
