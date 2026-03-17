'use client';

import { cn } from '@repo/ui';

interface ChipSkeletonProps {
  size?: 'md' | 'lg';
  className?: string;
  count?: number; // 여러 개를 한 번에 렌더링하고 싶을 때 사용
}

const ChipSkeleton = ({
  size = 'md',
  className,
  count = 1,
}: ChipSkeletonProps) => {
  // 개별 칩 스켈레톤 아이템
  const skeletonItem = (key: number) => (
    <div
      key={key}
      className={cn(
        // 기존 칩의 기본 형태를 유지하되 배경색과 애니메이션 추가
        'animate-pulse cursor-default border-none bg-gray-200 hover:bg-gray-200',
        size === 'lg'
          ? 'h-[50px] w-25 rounded-lg'
          : 'h-[35px] w-25 rounded-3xl',
        className,
      )}
    ></div>
  );

  // count가 1보다 크면 리스트 형태로 반환
  if (count > 1) {
    return (
      <div className="flex gap-2">
        {Array.from({ length: count }).map((_, i) => skeletonItem(i))}
      </div>
    );
  }

  return skeletonItem(0);
};

export { ChipSkeleton };
