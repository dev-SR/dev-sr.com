'use client';

import {
  Navbar,
  NavItems,
  NavbarLogo,
  MobileNav,
  MobileMenuButton,
} from '@/components/ui/resizable-navbar';

import { useState, useEffect } from 'react';

const navItems = [
  { name: 'Home', link: '/' },
  { name: 'Portfolio', link: '/portfolio' },
  { name: 'Blog', link: '/blog' },
  { name: 'About', link: '/about' },
];
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Navbar>
      <NavbarLogo />
      <NavItems items={navItems} />
      <MobileMenuButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <MobileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} items={navItems} />
    </Navbar>
  );
}
