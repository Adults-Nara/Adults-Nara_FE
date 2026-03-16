'use client';

import SearchLayer from '@/components/SearchLayer';
import { ROUTES } from '@/constant/routes';
import { Close, SearchIcon } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ShortsHeader() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <>
      <div className="absolute top-0 right-0 left-0 z-30 flex items-center justify-between bg-linear-to-b from-black/10 to-transparent px-4 pt-[max(12px)] pb-3 text-white">
        <button
          className="text-[24px] drop-shadow-sm"
          aria-label="닫기"
          onClick={() => {
            router.replace(ROUTES.HOME);
          }}
        >
          <Close />
        </button>
        <button
          className="text-[28px] drop-shadow-sm"
          onClick={() => setIsSearchOpen(true)}
          aria-label="검색"
        >
          <SearchIcon />
        </button>
      </div>
      {isSearchOpen && <SearchLayer onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
