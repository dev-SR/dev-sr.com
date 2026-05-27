'use client';
import { cn } from '@/lib/utils';
import { useWindowScroll } from '@uidotdev/usehooks';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import React, { useEffect, useRef, useState } from 'react';
/* -------------------------------------------------- */
/* Navbar Wrapper                                      */
/* -------------------------------------------------- */
interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavItem {
  name: string;
  link: string;
}

function transitionFor(link: string) {
  return [link === '/' ? 'nav-back' : 'nav-forward'];
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const [visible, setVisible] = useState(false);
  const [{ y }] = useWindowScroll();

  useEffect(() => {
    setVisible(Number(y) > 18);
  }, [y]);

  return (
    <div
      className={cn('sticky inset-x-0 top-4 z-40 w-full bg-transparent px-3 sm:px-5', className)}
      data-scrolled={visible}>
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            'relative z-[60] mx-auto flex h-14 w-full items-center justify-between rounded-full border px-3 transition-all duration-500 ease-out sm:px-4',
            visible
              ? 'border-white/15 bg-background/72 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:max-w-3xl'
              : 'border-transparent bg-transparent md:max-w-5xl'
          )}>
          {children}
        </div>
      </div>
    </div>
  );
};
/* -------------------------------------------------- */
/* NavbarLogo                                         */
/* -------------------------------------------------- */
export const NavbarLogo = () => {
  const [{ y }] = useWindowScroll();
  const compact = Number(y) > 18;

  return (
    <Link
      href="/"
      transitionTypes={['nav-back']}
      className="relative z-20 mr-3 flex items-center px-2 py-1 text-sm font-normal text-foreground">
      <span className="flex items-center gap-1.5">
        <span
          className={cn(
            'text-xl font-semibold text-[#F08F87] transition-all duration-500 sm:text-2xl',
            compact && '-translate-x-2 opacity-0 md:opacity-100'
          )}>
          Sharukh
        </span>
        <img
          src="/logo.svg"
          alt="Sharukh Rahman logo"
          width={40}
          height={40}
          className={cn('transition-transform duration-500', compact && 'md:scale-90')}
        />
        <span
          className={cn(
            'text-xl font-semibold text-[#ACC5D3] transition-all duration-500 sm:text-2xl',
            compact && 'translate-x-2 opacity-0 md:opacity-100'
          )}>
          Rahman
        </span>
      </span>
    </Link>
  );
};

/* -------------------------------------------------- */
/* NavItems                                            */
/* -------------------------------------------------- */
interface NavItemsProps {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
}

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const pathname = usePathname();

  return (
    <div className={cn('hidden md:flex', className)}>
      <div className="flex items-center gap-1 rounded-full bg-white/[0.04] p-1">
        {items.map((item) => {
          const isActive =
            item.link === '/' ? pathname === item.link : pathname.startsWith(item.link);

          return (
            <Link
              key={item.link}
              href={item.link}
              transitionTypes={transitionFor(item.link)}
              onClick={onItemClick}
              className={cn(
                'relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground',
                isActive && 'text-foreground'
              )}>
              {isActive && <span className="absolute inset-0 rounded-full bg-white/10" />}
              <span className="relative">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------- */
// /* Mobile Navigation */

export const MobileMenuButton = ({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}) => {
  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );
};

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  items: NavItem[];
}
export const MobileNav = ({ isMenuOpen, setIsMenuOpen, items }: MobileNavProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  if (!isMenuOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute left-3 right-3 top-full mt-3 rounded-2xl border border-white/10 bg-background/92 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in-0 slide-in-from-top-2 duration-200 md:hidden">
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive =
            item.link === '/' ? pathname === item.link : pathname.startsWith(item.link);

          return (
            <Link
              key={item.link}
              href={item.link}
              transitionTypes={transitionFor(item.link)}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                'rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground',
                isActive && 'bg-white/10 text-foreground'
              )}>
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
