'use client';

import { ROUTES } from '@/constant/routes';
import { useDebounce } from '@/hooks/useDebounce';
import { useAutocomplete } from '@/lib/tanstack/query/search-ranking.query';
import { MainCategory } from '@/types/category';
import { Chip, Input, LeftArrow, SearchIcon } from '@repo/ui';
import { CircleX, SearchX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchLayerProps {
  onClose: () => void;
  initial?: string;
}

const highlightKeyword = (text: string, keyword: string) => {
  if (!keyword) return text;

  const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapeRegExp(keyword)})`, 'gi'));

  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span key={i} className="text-primary-400 body2">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const SearchLayer = ({ onClose, initial = '' }: SearchLayerProps) => {
  const [keyword, setKeyword] = useState(initial);
  const normalizedKeyword = keyword.trim();
  const route = useRouter();
  const debouncedKeyword = useDebounce(normalizedKeyword, 300);
  const { data, isPending, isError } = useAutocomplete(debouncedKeyword);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && normalizedKeyword) {
      route.push(ROUTES.SEARCH(normalizedKeyword));
    }
  };

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-112.5 flex-col bg-black/40">
      {/* 상단 검색바 영역 */}
      <div className="flex h-17.5 items-center gap-5 border-b border-gray-300 bg-gray-100 px-5">
        <button onClick={onClose}>
          <LeftArrow className="h-6 w-6.5" />
        </button>
        <Input
          autoFocus
          className="rounded-3xl"
          leftIcon={<SearchIcon className="h-7 w-7 text-gray-700" />}
          placeholder="검색어를 입력하세요."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          onClear={() => setKeyword('')}
          showClear
        />
      </div>

      {!normalizedKeyword ? (
        /* 값이 없을 때: 주제별 검색 */
        <div className="flex flex-col gap-3 rounded-b-lg bg-white px-4 py-5">
          <span className="title2">주제별 검색</span>
          <div className="flex flex-wrap gap-2">
            {MainCategory.map((cat, i) => (
              <Chip
                onClick={() => {
                  route.push(`/search?tag=${cat.label}`);
                  onClose();
                }}
                key={cat.key}
              >
                {cat.label}
              </Chip>
            ))}
          </div>
        </div>
      ) : (
        /* 값이 있을 때: 자동완성 리스트 */
        <div className="flex flex-col gap-6 rounded-b-lg bg-white px-6 py-5">
          {isError ? (
            <div className="text-primary-500 flex flex-col items-center justify-center py-5">
              <div className="mb-2">
                <CircleX size={35} />
              </div>
              <span className="title2">자동완성중 에러발생</span>
              <span className="body3 mt-1">
                검색어를 지우고 다시 시도해주세요
              </span>
            </div>
          ) : !isPending && !isError && data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-5 opacity-40">
              <div className="mb-2">
                <SearchX size={35} />
              </div>
              <span className="title2">검색결과가 없습니다.</span>
            </div>
          ) : (
            data?.map((item, i) => (
              <button
                key={i}
                onClick={() => route.push(ROUTES.SEARCH(item))}
                className="flex items-center gap-3"
              >
                <SearchIcon className="h-5 w-5 shrink-0 text-gray-700" />
                <span className="body2 text-left">
                  {highlightKeyword(item, debouncedKeyword)}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchLayer;
