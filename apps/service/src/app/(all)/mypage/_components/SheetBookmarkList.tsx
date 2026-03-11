'use client';
import VideoHorizontalCard from '@/components/thumbnail/VideoHorizontalCard';
import { useBookmarkListInfinite } from '@/lib/tanstack/query/bookmark.query';
import useObserver from '@/hooks/useObserver';
import Link from 'next/link';
import { ThumbnailData } from '@/types/video';
import { BookmarkListResponse } from '@/models/bookmark.model';
import { formatVideoTime } from '@/utils/format';
import { ROUTES } from '@/constant/routes';
import { useSheetStore } from '@/store/useSheetStore';

interface SheetBookmarkListProps {
  videoType: 'LONG' | 'SHORT';
}

export function mapBookmarkListToThumbnail(
  item: BookmarkListResponse,
  videoType: 'LONG' | 'SHORT',
): ThumbnailData {
  return {
    id: item.videoId,
    thumbnailSrc: item.thumbnailUrl,
    title: item.title,
    uploader: item.uploaderName,
    duration: formatVideoTime(item.duration),
    progress: item.watchProgressPercent,
    views: item.viewCount,
    date: item.uploadDate,
    type: videoType === 'LONG' ? 'long' : 'short',
  };
}

const SheetBookmarkList = ({ videoType }: SheetBookmarkListProps) => {
  const { close } = useSheetStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
  } = useBookmarkListInfinite(videoType);

  const observerRef = useObserver({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  //TODO: 추후 로딩에러페이지 구현
  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러</div>;

  const items = data?.pages.flatMap((page) => page.items) ?? [];
  const videos = items.map((item) =>
    mapBookmarkListToThumbnail(item, videoType),
  );

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {videos.map((video) => {
        return (
          <Link
            key={video.id}
            onClick={() => close()}
            href={
              video.type === 'short'
                ? `${ROUTES.SHORTS}?v=${video.id}&listType=bookmarkList`
                : `${ROUTES.LONG}?v=${video.id}&listType=bookmarkList`
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

export default SheetBookmarkList;
