'use client';
import VideoHorizontalCard from '@/components/thumbnail/VideoHorizontalCard';
import { useRecentWatchHistory } from '@/lib/tanstack/query/watch-history.query';
import { mapWatchHistoryToThumbnail } from './RecentHistory';
import useObserver from '@/hooks/useObserver';
import Link from 'next/link';
import { ROUTES } from '@/constant/routes';
import { useSheetStore } from '@/store/useSheetStore';

const SheetRecentHistory = () => {
  const { close } = useSheetStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
  } = useRecentWatchHistory();

  const observerRef = useObserver({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  //TODO: 추후 로딩에러페이지 구현
  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러</div>;

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const videos = items.map(mapWatchHistoryToThumbnail);

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {videos.map((video) => {
        return (
          <Link
            key={video.id}
            onClick={() => close()}
            href={
              video.type === 'short'
                ? `${ROUTES.SHORTS}?v=${video.id})`
                : `${ROUTES.LONG}?v=${video.id})`
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
