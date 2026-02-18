'use client';
import { useEffect, useState } from 'react';
import { Input, LeftArrow, SearchIcon } from '@repo/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchLayer from '@/components/SearchLayer';

const InputHeader = () => {
  const searchParams = useSearchParams();
  const route = useRouter();

  const currentKeyword = searchParams.get('keyword') ?? '';

  const [keyword, setKeyword] = useState(currentKeyword);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setKeyword(currentKeyword);
    setIsSearchOpen(false);
  }, [currentKeyword]);

  return (
    <>
      <div className="sticky top-0 z-40 flex h-17.5 items-center gap-5 border-b border-gray-300 bg-gray-100 px-5">
        <button onClick={route.back} aria-label="뒤로가기">
          <LeftArrow className="h-6 w-6.5" />
        </button>
        <Input
          className="rounded-3xl"
          leftIcon={<SearchIcon className="h-7 w-7 text-gray-700" />}
          placeholder="검색어를 입력하세요."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setIsSearchOpen(true)}
          onClear={() => {
            setKeyword('');
            setIsSearchOpen(true);
          }}
          showClear
        />
      </div>

      {isSearchOpen && (
        <SearchLayer onClose={() => setIsSearchOpen(false)} initial={keyword} />
      )}
    </>
  );
};

export default InputHeader;
