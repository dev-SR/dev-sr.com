'use client';

import { useGSAP } from '@gsap/react';
import { ModeToggle } from '@/components/theme-toggle-button';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import React, { useRef } from 'react';

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

gsap.registerPlugin(ScrollTrigger);

export const Navbar = ({ children, className }: NavbarProps) => {
  const container = useRef<HTMLDivElement>(null);
  // Theme changes update CSS vars; glass opacity is driven by --nav-glass so we
  // never interpolate transparent→color (which GSAP treats as black and flashes wrong theme).
  const { resolvedTheme } = useTheme();

  useGSAP(
    () => {
      const el = container.current;
      if (!el) return;

      // Memorable hang → dock on scroll. Glass colors come from CSS (--nav-glass),
      // so mid-scroll never interpolates through the wrong theme's black/cream.
      gsap.fromTo(
        el,
        {
          maxWidth: '64rem',
          y: 28,
          '--nav-glass': 0,
        },
        {
          maxWidth: '48rem',
          y: 0,
          '--nav-glass': 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: '+=150',
            scrub: 0.7,
          },
        }
      );
    },
    { scope: container, dependencies: [resolvedTheme] }
  );

  return (
    <div
      className={cn('sticky inset-x-0 top-1 z-40 w-full bg-transparent px-3 sm:px-5', className)}>
      <div className="mx-auto max-w-6xl">
        <div
          ref={container}
          className="navbar-dock relative z-[60] mx-auto flex h-14 w-full max-w-5xl items-center justify-between rounded-full px-3 sm:px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export const NavbarLogo = () => {
  const logoContainer = useRef<HTMLSpanElement>(null);
  const sharukh = useRef<HTMLSpanElement>(null);
  const mark = useRef<HTMLImageElement>(null);
  const rahman = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=180',
          scrub: 0.7,
        },
      });

      timeline
        .to(
          sharukh.current,
          {
            autoAlpha: 0,
            x: -28,
            scale: 0.92,
            filter: 'blur(5px)',
            duration: 0.5,
            ease: 'power2.inOut',
          },
          0
        )
        .to(
          rahman.current,
          {
            autoAlpha: 0,
            x: 28,
            scale: 0.92,
            filter: 'blur(5px)',
            duration: 0.5,
            ease: 'power2.inOut',
          },
          0
        )
        .to(
          logoContainer.current,
          {
            gap: 0,
            duration: 0.42,
            ease: 'power2.inOut',
          },
          0.08
        )
        .to(
          mark.current,
          {
            scale: 0.9,
            rotation: 8,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          0.08
        )
        .to(
          [sharukh.current, rahman.current],
          {
            width: 0,
            duration: 0.42,
            ease: 'power2.inOut',
          },
          0.16
        );
    },
    { scope: logoContainer }
  );

  return (
    <Link
      href="/"
      transitionTypes={['nav-back']}
      className="relative z-20 mr-3 flex items-center px-2 py-1 text-sm font-normal text-foreground">
      <span ref={logoContainer} className="flex items-center gap-1.5">
        <span
          ref={sharukh}
          className="overflow-hidden whitespace-nowrap font-heading text-xl font-semibold tracking-tight text-[#F08F87] sm:text-2xl">
          Sharukh
        </span>
        <img ref={mark} src="/logo.svg" alt="Sharukh Rahman logo" width={40} height={40} />
        <span
          ref={rahman}
          className="overflow-hidden whitespace-nowrap font-heading text-xl font-semibold tracking-tight text-[#ACC5D3] sm:text-2xl">
          Rahman
        </span>
      </span>
    </Link>
  );
};

interface NavItemsProps {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
}

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const pathname = usePathname();

  return (
    <div className={cn('hidden md:flex items-center gap-2', className)}>
      <div className="flex items-center gap-1 rounded-full bg-foreground/5 p-1">
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
              {isActive && <span className="absolute inset-0 rounded-full bg-foreground/10" />}
              <span className="relative">{item.name}</span>
            </Link>
          );
        })}
      </div>
      <ModeToggle />
    </div>
  );
};

export const MobileMenuButton = ({
  isMenuOpen,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}) => {
  return (
    <div className="flex items-center gap-1 md:hidden">
      <ModeToggle />
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
      className="absolute left-3 right-3 top-full mt-3 rounded-2xl
border border-border bg-background/92 p-3 shadow-2xl backdrop-blur-xl
animate-in fade-in-0 slide-in-from-top-2 duration-200 md:hidden">
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
                'rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground',
                isActive && 'bg-foreground/10 text-foreground'
              )}>
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
