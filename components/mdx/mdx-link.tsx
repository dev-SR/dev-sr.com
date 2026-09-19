'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { scrollToHashId } from '@/lib/scroll-to-hash';
import { cn } from '@/lib/utils';

type MdxLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  showExternalIcon?: boolean;
};

/**
 * MDX `<a>` replacement: same-page `#hash` links scroll locally (no RSC fetch).
 * Cross-page routes use Next.js Link; absolute http(s) open externally.
 */
export function MdxLink({
  href,
  className,
  children,
  showExternalIcon = true,
  onClick,
  ...props
}: MdxLinkProps) {
  const pathname = usePathname();
  const hrefString = typeof href === 'string' ? href : '';
  const isExternal = /^https?:\/\//.test(hrefString);
  const hashIndex = hrefString.indexOf('#');
  const hasHash = hashIndex >= 0;
  const pathPart = hasHash ? hrefString.slice(0, hashIndex) : hrefString;
  const hashId = hasHash ? hrefString.slice(hashIndex + 1) : '';
  const isSamePageHash = Boolean(hashId) && (pathPart === '' || pathPart === pathname);

  if (isSamePageHash) {
    return (
      <a
        href={`#${hashId}`}
        className={className}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          scrollToHashId(hashId);
        }}
        {...props}>
        {children}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a
        href={hrefString}
        className={cn(className, showExternalIcon && 'inline-flex items-center gap-1')}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        {...props}>
        {children}
        {showExternalIcon && <ExternalLink className="size-3" />}
      </a>
    );
  }

  return (
    <Link
      href={hrefString || '#'}
      className={className}
      onClick={onClick}
      {...(props as Omit<React.ComponentProps<typeof Link>, 'href' | 'className' | 'onClick'>)}>
      {children}
    </Link>
  );
}
