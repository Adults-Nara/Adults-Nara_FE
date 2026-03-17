'use client';
import { ChipSkeleton } from '@/components/skeleton/ChipSkeleton';
import { ROUTES } from '@/constant/routes';
import {
  useMyChildTags,
  useTagWatchStats,
} from '@/lib/tanstack/query/tag.query';
import { formatSecondsToTime } from '@/utils/format';
import { Chip } from '@repo/ui';
import { useRouter } from 'next/navigation';

const CategoryBoard = () => {
  const { tags, isError: tagError, isPending: tagPending } = useMyChildTags();
  const {
    stats,
    isError: statsError,
    isPending: statsPending,
  } = useTagWatchStats();
  const route = useRouter();
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-gray-100 p-4 shadow-[0_5px_15px_0px_rgba(0,0,0,0.1)]">
      <div className="flex w-full justify-between">
        <span className="title2">선호주제</span>
        <button
          className="body3 text-primary-500 cursor-pointer"
          onClick={() => route.push(ROUTES.CATEGORY)}
        >
          자세히보기{' >'}
        </button>
      </div>
      <div className="flex w-full flex-wrap gap-2">
        {tagPending ? (
          <div className="gap-2.5 overflow-hidden px-3">
            <ChipSkeleton count={4} />
          </div>
        ) : tagError ? (
          <div className="body2 text-primary-500 px-3 py-2">
            사용자 주제를 가져올 수 없습니다.
          </div>
        ) : tags.length === 0 ? (
          <div className="body2 text-primary-500 px-3 py-2">
            선택된 주제가 없습니다.
          </div>
        ) : (
          tags.map((cat) => {
            return (
              <Chip key={cat.tagId} selected className="hover:bg-primary-500">
                {cat.tagName}
              </Chip>
            );
          })
        )}
      </div>
      <div className="flex w-full flex-col gap-4">
        {statsPending ? (
          <div className="flex animate-pulse flex-col items-start gap-4 px-4">
            <div className="h-6 w-70 rounded bg-gray-200" />
            <div className="h-6 w-70 rounded bg-gray-200" />
            <div className="h-6 w-70 rounded bg-gray-200" />
          </div>
        ) : statsError ? (
          <div>시청기록에러 발생</div>
        ) : stats.length === 0 ? (
          <span>시청 기록이 없습니다.</span>
        ) : (
          stats.slice(0, 3).map((rank, index) => {
            return (
              <div key={rank.tagId} className="flex gap-4">
                <span className="title3 text-primary-500 w-5">{index + 1}</span>
                <span className="body2 w-30">{rank.tagName}</span>
                <span className="body2 text-gray-700">
                  {formatSecondsToTime(rank.totalWatchSeconds)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CategoryBoard;
