'use client';

import { createContext, useContext } from 'react';

const DocsPrettyFigureContext = createContext(false);
const DocsFileTabsContext = createContext(false);

export function DocsPrettyFigureProvider({ children }: { children: React.ReactNode }) {
  return <DocsPrettyFigureContext.Provider value={true}>{children}</DocsPrettyFigureContext.Provider>;
}

export function DocsFileTabsProvider({ children }: { children: React.ReactNode }) {
  return <DocsFileTabsContext.Provider value={true}>{children}</DocsFileTabsContext.Provider>;
}

export function useInDocsPrettyFigure() {
  return useContext(DocsPrettyFigureContext);
}

export function useInDocsFileTabs() {
  return useContext(DocsFileTabsContext);
}
