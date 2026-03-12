'use client';
import VideoLargeCard from '@/components/thumbnail/VideoLargeCard';
import { MOCK_VIDEO_DATA } from '@/constant/mockData';
import { ROUTES } from '@/constant/routes';
import useObserver from '@/hooks/useObserver';
import { useHomeFeedVideoInfinite } from '@/lib/tanstack/query/recommendation.query';
import { RecommendationVideoItem } from '@/models/recommendations.model';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';
import Link from 'next/link';

export function mapHomeFeedToThumbnail(
  item: RecommendationVideoItem,
): ThumbnailData {
  return {
    id: item.videoId,
    thumbnailSrc: item.thumbnailSrc,
    title: item.title,
    uploader: item.uploader,
    duration: formatVideoTime(item.duration),
    progress: item.progress,
    views: item.views,
    date: item.date,
    type: item.videoType === 'LONG' ? 'long' : 'short',
  };
}

const RecommendedSection = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
  } = useHomeFeedVideoInfinite();

  const observerRef = useObserver({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  //TODO: 추후 로딩에러페이지 구현
  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러</div>;

  const items = data?.pages.flatMap((page) => page.content) ?? [];
  const videos = items.map(mapHomeFeedToThumbnail);

  return (
    <div className="flex flex-col gap-4">
      <span className="title1 pl-3">추천영상</span>

      <div className="flex flex-col">
        {videos.map((data, index) => {
          return (
            <Link
              key={data.id}
              href={
                data.type === 'short'
                  ? `${ROUTES.SHORTS}?v=${data.id}`
                  : `${ROUTES.LONG}?v=${data.id}`
              }
            >
              <VideoLargeCard data={data} />
            </Link>
          );
        })}
      </div>
      <div ref={observerRef} />
    </div>
  );
};

export default RecommendedSection;
