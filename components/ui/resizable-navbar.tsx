'use client';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useWindowScroll, useWindowSize } from '@uidotdev/usehooks';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';

import React, { useEffect, useRef, useState } from 'react';
/* -------------------------------------------------- */
/* Navbar Wrapper                                      */
/* -------------------------------------------------- */
interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const [visible, setVisible] = useState(false);
  const [{ x, y }, scrollTo] = useWindowScroll();
  const isSmallDevice = Number(useWindowSize().width) < 768;
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Number(y) > 10) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [y]);

  useGSAP(
    () => {
      // Set initial state
      gsap.set(container.current, {
        width: '100%',
        y: 0,
      });

      gsap.to(container.current, {
        width: isSmallDevice ? '100%' : '40%',
        y: -45,
        backdropFilter: 'blur(10px)',
        // boxShadow:
        //   '0 0 24px rgba(34,42,53,0.06), 0 1px 1px rgba(0,0,0,0.05), 0 0 0 1px rgba(34,42,53,0.04), 0 0 4px rgba(34,42,53,0.08), 0 16px 68px rgba(47,48,55,0.05), 0 1px 0 rgba(255,255,255,0.1) inset',
        ease: 'power2.inOut',
        duration: 0.4,
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=100',
          scrub: 1,
        },
      });
    },
    { dependencies: [isSmallDevice] }
  );

  return (
    <div
      className={cn(
        'sticky inset-x-0 top-12 z-40 w-full bg-transparent grid grid-cols-12',
        className
      )}>
      <div className={'col-span-1 md:col-span-2'}></div>
      <div className={'col-span-10 md:col-span-8'}>
        <div
          ref={container}
          className={cn(
            'relative z-[60] mx-auto flex flex-row items-center justify-between self-start rounded-full px-3 py-2 sm:px-4',
            visible && 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md',
            'w-full lg:min-w-[800px] max-w-7xl',
            className
          )}>
          {children}
        </div>
      </div>
      <div className={'col-span-1 md:col-span-2'}></div>
    </div>
  );
};
/* -------------------------------------------------- */
/* NavbarLogo                                         */
/* -------------------------------------------------- */
export const NavbarLogo = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '20% top',
        scrub: 1,
      },
    });

    // Step 1: fade out names
    tl.to('#sharukh', {
      opacity: 0,
      x: -50,
      ease: 'power3.out',
      duration: 0.1,
    })
      .to(
        '#rahman',
        {
          opacity: 0,
          x: -100,
          ease: 'power3.out',
          duration: 0.1,
        },
        '<' // run at the same time as Sharukh
      )
      // Step 2: move logo AFTER names are gone
      .to(
        '#logo',
        {
          x: -100,
          ease: 'power3.out',
          duration: 0.1,
        },
        '<' // run at the same time as Sharukh
      );
  });

  return (
    <Link
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black">
      <span className="flex gap-1">
        <span className="text-[#F08F87] text-2xl font-medium" id="sharukh">
          Sharukh
        </span>
        <img src="/logo.svg" alt="logo" width={40} height={40} id="logo" />
        <span className="text-[#ACC5D3] text-2xl font-medium" id="rahman">
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
  items: { name: string; link: string }[];
  className?: string;
  onItemClick?: () => void;
  setIsSearchOpen: (open: boolean) => void;
}

export const NavItems = ({ items, className, onItemClick, setIsSearchOpen }: NavItemsProps) => {
  return (
    <div className={cn('hidden md:flex', className)}>
      {/* Desktop Navigation */}
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        <Link
          href="/portfolio"
          className="text-muted-foreground hover:text-foreground transition-colors">
          Portfolio
        </Link>
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground transition-colors">
          Blog
        </Link>
        <Link
          href="/about"
          className="text-muted-foreground hover:text-foreground transition-colors">
          About
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSearchOpen(true)}
          className="text-muted-foreground hover:text-foreground">
          <Search className="h-4 w-4" />
        </Button>
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
      <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );
};

interface MobileNavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
}
export const MobileNav = ({ isMenuOpen, setIsMenuOpen, setIsSearchOpen }: MobileNavProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isMenuOpen) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isMenuOpen]);

  if (!isMenuOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute left-0 right-0 top-full mt-2 md:hidden bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md rounded-lg shadow-lg p-4 border border-border">
      <div className="flex flex-col space-y-4">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        <Link
          href="/portfolio"
          className="text-muted-foreground hover:text-foreground transition-colors">
          Portfolio
        </Link>
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground transition-colors">
          Blog
        </Link>
        <Link
          href="/about"
          className="text-muted-foreground hover:text-foreground transition-colors">
          About
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSearchOpen(true)}
          className="justify-start text-muted-foreground hover:text-foreground">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};
