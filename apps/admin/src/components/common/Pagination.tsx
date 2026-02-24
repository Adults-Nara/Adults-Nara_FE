'use client';

import { LeftArrow2, RightArrow } from '@repo/ui';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  showMaxSize?: number;
}

export default function Pagination({
  totalPages,
  showMaxSize = 15,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 현재 URL에서 'page' 값을 가져옴 (없으면 1)
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const onPageChange = (page: number) => {
    router.push(createPageURL(page));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showMax = showMaxSize; // 한 번에 보여줄 번호 개수

    if (totalPages <= showMax + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 항상 첫 페이지 포함
    pages.push(1);

    if (currentPage > 3) pages.push('...');

    // 현재 페이지 주변 번호 계산
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push('...');

    // 항상 마지막 페이지 포함
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-500 disabled:opacity-20"
      >
        <LeftArrow2 />
      </button>

      {getPageNumbers().map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`body3 h-9 min-w-9 rounded-lg border px-2 transition-colors ${
            currentPage === page
              ? 'bg-primary-400 border-none text-white'
              : 'border-gray-500 bg-white hover:bg-gray-200 disabled:border-none'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-500 disabled:opacity-20"
      >
        <RightArrow />
      </button>
    </div>
  );
}
