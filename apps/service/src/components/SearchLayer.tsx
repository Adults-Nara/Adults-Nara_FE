'use client';

import { ROUTES } from '@/constant/routes';
import { Chip, Input, LeftArrow, SearchIcon } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SearchLayerProps {
  onClose: () => void;
  initial?: string;
}

const SearchLayer = ({ onClose, initial = '' }: SearchLayerProps) => {
  const [keyword, setKeyword] = useState(initial);
  const route = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      route.push(ROUTES.SEARCH(keyword));
    }
  };

  // 임시 데이터 (나중에 API 연동)
  const categories = [
    '애완동물',
    '드라마',
    '요리',
    '건강',
    '원예',
    '낚시',
    '뉴스',
    '교양',
    '애완동물',
    '드라마',
    '요리',
    '건강',
    '원예',
    '낚시',
    '뉴스',
    '교양',
  ];
  const suggestions = [
    '건강보험료 개편',
    '건강보험료',
    '건강되찾기프로젝트',
    '건강박수',
    '건강체조',
  ];

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

      {!keyword ? (
        /* 값이 없을 때: 주제별 검색 */
        <div className="flex flex-col gap-3 rounded-b-lg bg-white px-4 py-5">
          <span className="title2">주제별 검색</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <Chip onClick={() => setKeyword(cat)} key={i}>
                {cat}
              </Chip>
            ))}
          </div>
        </div>
      ) : (
        /* 값이 있을 때: 자동완성 리스트 */
        <div className="flex flex-col gap-6 rounded-b-lg bg-white px-6 py-5">
          {suggestions.map((item, i) => (
            <button
              key={i}
              onClick={() => route.push(ROUTES.SEARCH(item))}
              className="flex items-center gap-3"
            >
              <SearchIcon className="h-5 w-5 text-gray-700" />
              <span className="body2">{item}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchLayer;
