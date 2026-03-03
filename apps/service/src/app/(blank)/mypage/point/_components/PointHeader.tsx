'use client';
import { LeftArrow } from '@repo/ui';
import { useRouter } from 'next/navigation';

const PointHeader = () => {
  const route = useRouter();
  return (
    <div className="sticky top-0 z-40 flex h-17.5 items-center justify-between border-b border-gray-300 bg-gray-100 px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={route.back}
          aria-label="뒤로가기"
          className="cursor-pointer"
        >
          <LeftArrow className="h-6 w-6.5" />
        </button>
        <span className="title2">포인트 현황</span>
      </div>
    </div>
  );
};

export default PointHeader;
