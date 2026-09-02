'use client';

import { createContext, useContext, useMemo, useState, Children, isValidElement } from 'react';
import type React from 'react';
import { cn } from '@/lib/utils';

type InstallTabContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const InstallTabContext = createContext<InstallTabContextValue | null>(null);

export function InstallTabs({
  defaultValue = 'cli',
  className,
  children,
}: {
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const tabs = useMemo(() => {
    const items: { value: string; label: string; content: React.ReactNode }[] = [];
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      const props = child.props as { value?: string; label?: string; children?: React.ReactNode };
      if (!props.value) return;
      items.push({
        value: props.value,
        label: props.label ?? props.value.toUpperCase(),
        content: props.children,
      });
    });
    return items;
  }, [children]);

  const [value, setValue] = useState(defaultValue || tabs[0]?.value || 'cli');
  const active = tabs.find((tab) => tab.value === value) ?? tabs[0];

  return (
    <InstallTabContext.Provider value={{ value, setValue }}>
      <div className={cn('my-8', className)}>
        <div className="mb-4 inline-flex rounded-lg border border-border bg-muted/30 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={cn(
                'rounded-md px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors',
                value === tab.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setValue(tab.value)}>
              {tab.label}
            </button>
          ))}
        </div>
        <div>{active?.content}</div>
      </div>
    </InstallTabContext.Provider>
  );
}

export function InstallTab({
  children,
}: {
  value: string;
  label?: string;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function useInstallTabs() {
  const context = useContext(InstallTabContext);
  if (!context) {
    throw new Error('useInstallTabs must be used within InstallTabs');
  }
  return context;
}
