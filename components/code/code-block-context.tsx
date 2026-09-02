'use client';

import { createContext, useContext } from 'react';

const PrettyFigureContext = createContext(false);
const FileTabsContext = createContext(false);

export function PrettyFigureProvider({ children }: { children: React.ReactNode }) {
  return <PrettyFigureContext.Provider value={true}>{children}</PrettyFigureContext.Provider>;
}

export function FileTabsProvider({ children }: { children: React.ReactNode }) {
  return <FileTabsContext.Provider value={true}>{children}</FileTabsContext.Provider>;
}

/** @deprecated Use PrettyFigureProvider */
export const PrettyCodeFigureProvider = PrettyFigureProvider;
/** @deprecated Use FileTabsProvider */
export const CodeTabsProvider = FileTabsProvider;
/** @deprecated Use PrettyFigureProvider */
export const DocsPrettyFigureProvider = PrettyFigureProvider;
/** @deprecated Use FileTabsProvider */
export const DocsFileTabsProvider = FileTabsProvider;

export function useInPrettyFigure() {
  return useContext(PrettyFigureContext);
}

export function useInFileTabs() {
  return useContext(FileTabsContext);
}

/** @deprecated Use useInPrettyFigure */
export const useInPrettyCodeFigure = useInPrettyFigure;
/** @deprecated Use useInPrettyFigure */
export const useInDocsPrettyFigure = useInPrettyFigure;
/** @deprecated Use useInFileTabs */
export const useInCodeTabs = useInFileTabs;
/** @deprecated Use useInFileTabs */
export const useInDocsFileTabs = useInFileTabs;
