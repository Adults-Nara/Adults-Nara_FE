'use client';
import VideoHorizontalCard from '@/components/thumbnail/VideoHorizontalCard';
import { useBookmarkList } from '@/lib/tanstack/query/bookmark.query';
import useObserver from '@/hooks/useObserver';
import Link from 'next/link';
import { ThumbnailData } from '@/types/video';
import { BookmarkListResponse } from '@/models/bookmark.model';
import { formatVideoTime } from '@/utils/format';

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
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
  } = useBookmarkList(videoType);

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

export default SheetBookmarkList;
