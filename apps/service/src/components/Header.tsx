'use client';

import { Logo, SearchIcon } from '@repo/ui';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import SearchLayer from './SearchLayer';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(
        !(currentScrollY > lastScrollYRef.current && currentScrollY > 50),
      );
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener('scroll', controlHeader, { passive: true });
    return () => window.removeEventListener('scroll', controlHeader);
  }, []);
  const headerVisible = isSearchOpen ? true : isVisible;

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: headerVisible ? 0 : -71 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="sticky top-0 z-40 border-b border-gray-300 bg-gray-100"
      >
        <div className="flex h-17.5 items-center justify-between pr-5 pl-1">
          <Logo className="h-12.5 w-12.5" />

          <button onClick={() => setIsSearchOpen(true)} aria-label="검색 열기">
            <SearchIcon className="h-8.5 w-8.5 text-gray-900" />
          </button>
        </div>
      </motion.header>

      {isSearchOpen && <SearchLayer onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default Header;
