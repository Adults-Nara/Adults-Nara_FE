'use client';

import { ROUTES } from '@/constant/routes';
import { useRouter } from 'next/navigation';

interface RewardSummaryProps {
  showDetailLink?: boolean;
}

const RewardSummary = ({ showDetailLink = true }: RewardSummaryProps) => {
  const route = useRouter();
  return (
    <div className="bg-primary-900 flex w-full flex-col gap-4 rounded-lg p-4">
      <div className="flex w-full justify-between">
        <span className="title2 text-white">이번 달 혜택</span>

        {showDetailLink && (
          <button
            className="body3 cursor-pointer text-white"
            onClick={() => route.push(ROUTES.POINT)}
          >
            자세히보기{' >'}
          </button>
        )}
      </div>
      <div className="flex flex-col">
        <span className="body2 text-white">
          <span className="title2 text-primary-600 text-4xl">800</span>원 혜택을
          받아요.
        </span>
        <span className="body3 text-gray-500">
          아직 200원을 더 받을 수 있어요.
        </span>
      </div>
      <span className="body2 text-white">1년간 12,000원 혜택을 받았어요.</span>
    </div>
  );
};

export default RewardSummary;
