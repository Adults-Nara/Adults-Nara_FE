'use client';
import VideoHorizontalCard from '@/components/thumbnail/VideoHorizontalCard';
import { useRecentWatchHistory } from '@/lib/tanstack/query/watch-history.query';
import { mapWatchHistoryToThumbnail } from './RecentHistory';
import useObserver from '@/hooks/useObserver';
import Link from 'next/link';

const SheetRecentHistory = () => {
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
          //TODO:추후 링크 href 변경
          <Link key={video.id} href={`/long/${video.id}`}>
            <VideoHorizontalCard data={video} />
          </Link>
        );
      })}

      <div ref={observerRef} />
    </div>
  );
};

export default SheetRecentHistory;
