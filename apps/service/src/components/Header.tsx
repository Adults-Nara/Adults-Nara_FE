'use client';

import { Logo, SearchIcon } from '@repo/ui';
import { useState } from 'react';
import SearchLayer from './SearchLayer';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky z-40 border-b border-gray-300 bg-gray-100">
        <div className="flex h-17.5 items-center justify-between pr-5 pl-1">
          <Logo className="h-12.5 w-12.5" />

          <button onClick={() => setIsSearchOpen(true)}>
            <SearchIcon className="h-8.5 w-8.5 text-gray-900" />
          </button>
        </div>
      </header>

      {isSearchOpen && <SearchLayer onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default Header;
