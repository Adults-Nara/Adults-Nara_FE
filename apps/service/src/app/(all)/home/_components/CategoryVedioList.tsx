'use client';

import VideoVerticalCard from '@/components/thumbnail/VideoVerticalCard';
import { ROUTES } from '@/constant/routes';
import { TagVideoResponse } from '@/models/tag.model';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';
import useEmblaCarousel from 'embla-carousel-react';
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

interface CategoryVedioListProps {
  videos: TagVideoResponse[];
  isError: boolean;
  isPending: boolean;
}

const CategoryVedioList = ({
  videos,
  isError,
  isPending,
}: CategoryVedioListProps) => {
  const [videoListRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  //TODO: 추후 로딩 에러 UI구현
  if (isPending) return <span>태그비디오 로딩중,,,</span>;
  if (isError) return <span>태그비디오 에러,,,</span>;
  if (videos.length === 0) return <span>해당 주제의 영상이 없습니다..</span>;

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

export default CategoryVedioList;
