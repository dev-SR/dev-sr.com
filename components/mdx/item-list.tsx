import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Card } from '@/components/ui/card';
import { resolveItemListIcon } from '@/lib/content-icons';
import { cn } from '@/lib/utils';

type ItemListLayout = 'stack' | '2col';

interface ItemListProps {
  children: ReactNode;
  className?: string;
  /** `stack` (default) = single column; `2col` = two-column grid from `sm` up. */
  layout?: ItemListLayout;
}

interface ListItemProps {
  icon?: string;
  children: ReactNode;
  className?: string;
}

export function ItemList({ children, className, layout = 'stack' }: ItemListProps) {
  const items = Children.toArray(children).filter(isListItemElement);
  const isTwoCol = layout === '2col';

  return (
    <Card
      data-slot="item-list"
      data-layout={layout}
      className={cn(
        'not-prose mb-6 gap-0 overflow-hidden rounded-xl py-0 shadow-none',
        isTwoCol && 'grid grid-cols-1 sm:grid-cols-2',
        className
      )}>
      {items.map((item, index) => (
        <div key={item.key ?? index}>{item}</div>
      ))}
    </Card>
  );
}


export function ListItem({ icon, children, className }: ListItemProps) {
  const Icon = icon ? resolveItemListIcon(icon) : null;

  return (
    <div
      data-slot="list-item"
      className={cn('flex h-full items-start gap-3 bg-background px-3.5 py-4', className)}>
      {Icon && (
        <div className="flex w-7 shrink-0 justify-center pt-0.5">
          <Icon className="size-4 text-muted-foreground" aria-hidden strokeWidth={1.8} />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-prose-md text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

function isListItemElement(child: ReactNode): child is ReactElement<ListItemProps> {
  return isValidElement(child) && child.type === ListItem;
}


interface ListTitleProps {
  children: ReactNode;
  className?: string;
}

export function ListTitle({ children, className }: ListTitleProps) {
  return (
    <span
      data-slot="list-title"
      className={cn(
        'block text-base font-semibold leading-5 text-foreground',
        // MDX may wrap siblings in <p>; dissolve so we never nest blocks in paragraphs.
        '[&>p]:contents',
        className
      )}>
      {children}
    </span>
  );
}

interface ListSubtitleProps {
  children: ReactNode;
  className?: string;
}

export function ListSubtitle({ children, className }: ListSubtitleProps) {
  return (
    <span
      data-slot="list-subtitle"
      className={cn(
        'block text-prose-sm text-muted-foreground font-extralight',
        '[&>p]:contents',
        className
      )}>
      {children}
    </span>
  );
}

interface LineItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Use <span> (not <div>) so nested LineItems stay valid when MDX wraps
 * mixed text + components in a <p>. Nesting only adds padding — same type
 * as siblings (size lives on ListItem body; kill MDX Paragraph font overrides).
 */
export function LineItem({ children, className }: LineItemProps) {
  return (
    <span
      data-slot="line-item"
      className={cn(
        'block text-prose-sm font-light',
        // Nested LineItems: indent only — do not change font size/weight.
        '[&_[data-slot=line-item]]:mt-1.5 [&_[data-slot=line-item]]:block [&_[data-slot=line-item]]:pl-8',
        // Unwrap MDX <p>. Inline code chrome comes from globals (`p code` / `span code`);
        // fenced blocks are reset via `pre code` after those rules.
        '[&>p]:contents',
        className
      )}>
      {children}
    </span>
  );
}
