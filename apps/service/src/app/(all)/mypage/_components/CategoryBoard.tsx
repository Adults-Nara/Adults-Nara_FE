'use client';
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
  //TODO: 로딩 에러 페이지 추후 구현
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
          <div>선호주제 로딩중...</div>
        ) : tagError ? (
          <div>선호주제에러 발생</div>
        ) : tags.length === 0 ? (
          <div>선호주제없음...</div>
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
        {statsPending && <div>시청기록 로딩중...</div>}
        {statsError && <div>시청기록에러 발생</div>}
        {stats.length === 0 ? (
          <span>시청 기록이 없습니다 </span>
        ) : (
          stats.slice(0, 3).map((rank, index) => {
            return (
              <div key={rank.tagId} className="flex gap-4">
                <span className="title3 text-primary-500 w-5">{index + 1}</span>
                <span className="body2 w-20">{rank.tagName}</span>
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
