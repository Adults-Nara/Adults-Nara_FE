'use client';
import VideoHorizontalCard from '@/components/thumbnail/VideoHorizontalCard';
import { useRecentWatchHistory } from '@/lib/tanstack/query/watch-history.query';
import { mapWatchHistoryToThumbnail } from './RecentHistory';
import useObserver from '@/hooks/useObserver';
import Link from 'next/link';
import { ROUTES } from '@/constant/routes';
import { useSheetStore } from '@/store/useSheetStore';
import VideoHorizontalCardSkeleton from '@/components/skeleton/VideoHorizontalCardSkeleton';
import { CircleX, Inbox } from 'lucide-react';

const SheetRecentHistory = () => {
  const { close } = useSheetStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
    refetch,
  } = useRecentWatchHistory();

  const observerRef = useObserver({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  if (isPending)
    return (
      <div className="flex flex-col gap-2 px-4 py-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <VideoHorizontalCardSkeleton key={i} />
        ))}
      </div>
    );
  if (isError)
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 py-10">
        <CircleX size={35} className="text-primary-500" />
        <span className="body2 text-primary-500">
          최근 시청 이력을 불러오지 못했습니다.
        </span>
        <button
          onClick={() => refetch()}
          className="body3 mt-2 underline opacity-60"
        >
          다시 시도하기
        </button>
      </div>
    );

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const videos = items.map(mapWatchHistoryToThumbnail);

  if (videos.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg py-15 text-gray-600">
        <Inbox size={35} />
        <span className="body2">최근 시청 영상이 없습니다.</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {videos.map((video) => {
        return (
          <Link
            key={video.id}
            onClick={() => close()}
            href={
              video.type === 'short'
                ? `${ROUTES.SHORTS}?v=${video.id}`
                : `${ROUTES.LONG}?v=${video.id}`
            }
          >
            <VideoHorizontalCard data={video} />
          </Link>
        );
      })}

      <div ref={observerRef} />
    </div>
  );
};

export default SheetRecentHistory;
