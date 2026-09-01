'use client';

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Link from 'next/link';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { FileIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type TreeViewElement = {
  id: string;
  name: string;
  type?: 'file' | 'folder';
  isSelectable?: boolean;
  href?: string;
  children?: TreeViewElement[];
};

type TreeSortMode = 'default' | 'none' | ((a: TreeViewElement, b: TreeViewElement) => number);

type TreeContextProps = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  indicator: boolean;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  fileIcon?: React.ReactNode;
  direction: 'rtl' | 'ltr';
};

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

type Direction = 'rtl' | 'ltr' | undefined;

const isFolderElement = (element: TreeViewElement) => {
  if (element.type) {
    return element.type === 'folder';
  }

  return Array.isArray(element.children);
};

const mergeExpandedItems = (currentItems: string[] | undefined, nextItems: string[]) => [
  ...new Set([...(currentItems ?? []), ...nextItems]),
];

const treeCollator = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base',
});

const defaultTreeComparator = (a: TreeViewElement, b: TreeViewElement) => {
  const aIsFolder = isFolderElement(a);
  const bIsFolder = isFolderElement(b);

  if (aIsFolder !== bIsFolder) {
    return aIsFolder ? -1 : 1;
  }

  return treeCollator.compare(a.name, b.name);
};

const getTreeComparator = (sort: TreeSortMode) => {
  if (sort === 'none') {
    return undefined;
  }

  if (sort === 'default') {
    return defaultTreeComparator;
  }

  return sort;
};

const sortTreeElements = (elements: TreeViewElement[], sort: TreeSortMode): TreeViewElement[] => {
  const comparator = getTreeComparator(sort);

  const nextElements = elements.map((element) => {
    if (!Array.isArray(element.children)) {
      return element;
    }

    return {
      ...element,
      children: sortTreeElements(element.children, sort),
    };
  });

  if (!comparator) {
    return nextElements;
  }

  return [...nextElements].sort(comparator);
};

const renderTreeElements = (elements: TreeViewElement[], sort: TreeSortMode): React.ReactNode =>
  sortTreeElements(elements, sort).map((element) => {
    if (isFolderElement(element)) {
      return (
        <Folder
          key={element.id}
          value={element.id}
          element={element.name}
          isSelectable={element.isSelectable}>
          {Array.isArray(element.children) ? renderTreeElements(element.children, sort) : null}
        </Folder>
      );
    }

    return (
      <File
        key={element.id}
        value={element.id}
        href={element.href}
        isSelectable={element.isSelectable}
        title={element.name}>
        <span className="truncate">{element.name}</span>
      </File>
    );
  });

type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpandedItems?: string[];
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  fileIcon?: React.ReactNode;
  sort?: TreeSortMode;
} & Omit<
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
  'defaultValue' | 'onValueChange' | 'type' | 'value'
>;

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      fileIcon,
      sort = 'default',
      dir,
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);
    const [expandedItems, setExpandedItems] = useState<string[] | undefined>(initialExpandedItems);

    const selectItem = useCallback((id: string) => {
      setSelectedId(id);
    }, []);

    const handleExpand = useCallback((id: string) => {
      setExpandedItems((prev) => {
        if (prev?.includes(id)) {
          return prev.filter((item) => item !== id);
        }
        return [...(prev ?? []), id];
      });
    }, []);

    const expandSpecificTargetedElements = useCallback(
      (treeElements?: TreeViewElement[], selectId?: string) => {
        if (!treeElements || !selectId) return;
        const findParent = (currentElement: TreeViewElement, currentPath: string[] = []) => {
          const isSelectable = currentElement.isSelectable ?? true;
          const newPath = [...currentPath, currentElement.id];
          if (currentElement.id === selectId) {
            if (isSelectable) {
              setExpandedItems((prev) => mergeExpandedItems(prev, newPath));
            } else if (newPath.includes(currentElement.id)) {
              newPath.pop();
              setExpandedItems((prev) => mergeExpandedItems(prev, newPath));
            }
            return;
          }
          if (Array.isArray(currentElement.children) && currentElement.children.length > 0) {
            currentElement.children.forEach((child) => {
              findParent(child, newPath);
            });
          }
        };
        treeElements.forEach((element) => {
          findParent(element);
        });
      },
      []
    );

    useEffect(() => {
      setSelectedId(initialSelectedId);
    }, [initialSelectedId]);

    useEffect(() => {
      if (initialSelectedId) {
        expandSpecificTargetedElements(elements, initialSelectedId);
      }
    }, [initialSelectedId, elements, expandSpecificTargetedElements]);

    const direction = dir === 'rtl' ? 'rtl' : 'ltr';
    const treeItems = elements ? renderTreeElements(elements, sort) : children;

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expandedItems,
          handleExpand,
          selectItem,
          setExpandedItems,
          indicator,
          openIcon,
          closeIcon,
          fileIcon,
          direction,
        }}>
        <div ref={ref} data-slot="tree" className={cn('relative size-full', className)}>
          <ScrollArea className="relative h-full px-2" dir={dir as Direction}>
            <AccordionPrimitive.Root
              {...props}
              type="multiple"
              value={expandedItems ?? []}
              className="flex flex-col gap-1 pb-10"
              dir={dir as Direction}>
              {treeItems}
            </AccordionPrimitive.Root>
          </ScrollArea>
          {elements ? children : null}
        </div>
      </TreeContext.Provider>
    );
  }
);

Tree.displayName = 'Tree';

const TreeIndicator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { direction } = useTree();

    return (
      <div
        dir={direction}
        ref={ref}
        className={cn(
          'bg-muted absolute left-1.5 h-full w-px rounded-md py-3 duration-300 ease-in-out hover:bg-border rtl:right-1.5',
          className
        )}
        {...props}
      />
    );
  }
);

TreeIndicator.displayName = 'TreeIndicator';

type FolderProps = {
  expandedItems?: string[];
  element: string;
  isSelectable?: boolean;
  isSelect?: boolean;
} & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

const Folder = forwardRef<HTMLDivElement, FolderProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ className, element, value, isSelectable = true, isSelect, children, ...props }, ref) => {
    const {
      direction,
      handleExpand,
      expandedItems,
      indicator,
      selectedId,
      selectItem,
      openIcon,
      closeIcon,
    } = useTree();
    const isSelected = isSelect ?? selectedId === value;

    return (
      <AccordionPrimitive.Item
        ref={ref}
        {...props}
        value={value}
        data-slot="tree-folder"
        className="relative overflow-hidden">
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger
            className={cn(
              'flex w-full items-center gap-1 rounded-md px-1 py-1 text-sm capitalize hover:bg-muted/50',
              className,
              {
                'bg-muted rounded-md': isSelected && isSelectable,
                'cursor-pointer': isSelectable,
                'cursor-not-allowed opacity-50': !isSelectable,
              }
            )}
            disabled={!isSelectable}
            onClick={() => {
              selectItem(value);
              handleExpand(value);
            }}>
            {expandedItems?.includes(value)
              ? (openIcon ?? <FolderOpenIcon className="size-4 text-muted-foreground" />)
              : (closeIcon ?? <FolderIcon className="size-4 text-muted-foreground" />)}
            <span className="truncate">{element}</span>
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionPrimitive.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden text-sm">
          {element && indicator && <TreeIndicator aria-hidden="true" />}
          <AccordionPrimitive.Root
            dir={direction}
            type="multiple"
            className="ml-5 flex flex-col gap-1 py-1 rtl:mr-5"
            value={expandedItems ?? []}>
            {children}
          </AccordionPrimitive.Root>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    );
  }
);

Folder.displayName = 'Folder';

type FileProps = {
  value: string;
  handleSelect?: (id: string) => void;
  isSelectable?: boolean;
  isSelect?: boolean;
  fileIcon?: React.ReactNode;
  href?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'href'>;

const File = forwardRef<HTMLButtonElement | HTMLAnchorElement, FileProps>(
  (
    {
      value,
      className,
      handleSelect,
      onClick,
      isSelectable = true,
      isSelect,
      fileIcon,
      href,
      children,
      ...props
    },
    ref
  ) => {
    const { direction, selectedId, selectItem, fileIcon: contextFileIcon } = useTree();
    const isSelected = isSelect ?? selectedId === value;
    const itemClassName = cn(
      'flex w-full min-w-0 items-center gap-1 rounded-md px-1 py-1 text-left text-sm duration-200 ease-in-out hover:bg-muted/50 hover:text-accent rtl:pr-0 rtl:pl-1',
      {
        'bg-muted text-accent': isSelected && isSelectable,
      },
      isSelectable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
      direction === 'rtl' ? 'rtl' : 'ltr',
      className
    );

    const content = (
      <>
        {fileIcon ?? contextFileIcon ?? <FileIcon className="size-4 text-muted-foreground" />}
        {children}
      </>
    );

    const handleItemClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (!isSelectable) {
        event.preventDefault();
        return;
      }
      selectItem(value);
      handleSelect?.(value);
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    };

    if (href) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          aria-current={isSelected ? 'page' : undefined}
          aria-disabled={!isSelectable}
          data-slot="tree-file"
          className={itemClassName}
          onClick={handleItemClick}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={!isSelectable}
        data-slot="tree-file"
        className={itemClassName}
        onClick={handleItemClick}
        {...props}>
        {content}
      </button>
    );
  }
);

File.displayName = 'File';

const CollapseButton = forwardRef<
  HTMLButtonElement,
  {
    elements: TreeViewElement[];
    expandAll?: boolean;
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ className, elements, expandAll = false, children, ...props }, ref) => {
  const { expandedItems, setExpandedItems } = useTree();

  const expandAllTree = useCallback((treeElements: TreeViewElement[]) => {
    const expandedElementIds: string[] = [];

    const expandTree = (element: TreeViewElement) => {
      const isSelectable = element.isSelectable ?? true;
      if (isSelectable && element.children && element.children.length > 0) {
        expandedElementIds.push(element.id);
        for (const child of element.children) {
          expandTree(child);
        }
      }
    };

    for (const element of treeElements) {
      expandTree(element);
    }

    return [...new Set(expandedElementIds)];
  }, []);

  const closeAll = useCallback(() => {
    setExpandedItems?.([]);
  }, [setExpandedItems]);

  useEffect(() => {
    if (expandAll) {
      setExpandedItems?.(expandAllTree(elements));
    }
  }, [expandAll, elements, expandAllTree, setExpandedItems]);

  return (
    <Button
      variant="ghost"
      className={cn('absolute right-2 bottom-1 h-8 w-fit p-1', className)}
      onClick={
        expandedItems && expandedItems.length > 0
          ? closeAll
          : () => setExpandedItems?.(expandAllTree(elements))
      }
      ref={ref}
      {...props}>
      {children}
      <span className="sr-only">Toggle</span>
    </Button>
  );
});

CollapseButton.displayName = 'CollapseButton';

export { CollapseButton, File, Folder, Tree, type TreeViewElement };
export type { TreeSortMode };
