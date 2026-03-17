'use client';

import VideoVerticalCardSkeleton from '@/components/skeleton/VideoVerticalCardSkeleton';
import VideoVerticalCard from '@/components/thumbnail/VideoVerticalCard';
import { ROUTES } from '@/constant/routes';
import { TagVideoResponse } from '@/models/tag.model';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';
import useEmblaCarousel from 'embla-carousel-react';
import { CircleX } from 'lucide-react';
import Link from 'next/link';

export function mapTagListToThumbnail(item: TagVideoResponse): ThumbnailData {
  return {
    id: item.videoId,
    thumbnailSrc: item.thumbnailUrl,
    title: item.title,
    uploader: item.uploaderName,
    duration: formatVideoTime(item.duration),
    progress: item.watchProgressPercent,
    views: item.viewCount,
    date: item.uploadedAt,
    type: 'long',
  };
}

interface CategoryVideoListProps {
  videos: TagVideoResponse[];
  isError: boolean;
  isPending: boolean;
  refetch: () => void;
}

const CategoryVideoList = ({
  videos,
  isError,
  isPending,
  refetch,
}: CategoryVideoListProps) => {
  const [videoListRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  if (isPending)
    return (
      <div className="flex flex-nowrap gap-4 overflow-hidden px-3 py-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-50 shrink-0">
            <VideoVerticalCardSkeleton />
          </div>
        ))}
      </div>
    );
  if (isError)
    return (
      <div className="border-primary-500 mx-3 flex flex-col items-center justify-center gap-3 rounded-lg border py-15">
        <CircleX size={35} className="text-primary-500" />
        <span className="body2 text-primary-500">
          주제별 인기영상을 불러오지못했습니다.
        </span>
        <button
          onClick={() => refetch()}
          className="body3 underline opacity-60"
        >
          다시 시도하기
        </button>
      </div>
    );
  if (videos.length === 0)
    return (
      <div className="mx-5 flex flex-col items-center justify-center rounded-lg border border-gray-400 py-15">
        <span className="body2 text-gray-600">
          해당 주제 영상이 없습니다...
        </span>
      </div>
    );

  return (
    <div className="overflow-hidden px-3 py-0.5" ref={videoListRef}>
      <div className="flex gap-4">
        {videos.map((data) => {
          return (
            <Link
              key={data.videoId}
              href={`${ROUTES.LONG}?v=${data.videoId}`}
              className="flex-[0_0_60%]"
            >
              <VideoVerticalCard data={mapTagListToThumbnail(data)} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryVideoList;
