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
  { name: 'Features', link: '#features' },
  { name: 'Pricing', link: '#pricing' },
  { name: 'About', link: '#about' },
];
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Close mobile menu on window resize
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
      <NavItems items={navItems} setIsSearchOpen={setIsSearchOpen} />
      <MobileMenuButton isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <MobileNav
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
    </Navbar>
  );
}
