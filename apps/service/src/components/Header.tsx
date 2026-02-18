'use client';

import { Logo, SearchIcon } from '@repo/ui';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SearchLayer from './SearchLayer';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (isSearchOpen) {
      // 검색창이 열리면 스크롤 막기
      document.body.style.overflow = 'hidden';
    } else {
      // 검색창이 닫히면 스크롤 다시 허용
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);
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

          <button onClick={() => setIsSearchOpen(true)}>
            <SearchIcon className="h-8.5 w-8.5 text-gray-900" />
          </button>
        </div>
      </motion.header>

      {isSearchOpen && <SearchLayer onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default Header;
