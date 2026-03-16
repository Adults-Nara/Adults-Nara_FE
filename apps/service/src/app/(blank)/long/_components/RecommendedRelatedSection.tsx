'use client';
import VideoLargeCard from '@/components/thumbnail/VideoLargeCard';
import { ROUTES } from '@/constant/routes';
import useObserver from '@/hooks/useObserver';
import { useRelatedVideosInfinite } from '@/lib/tanstack/query/recommendation.query';
import { RecommendationVideoItem } from '@/models/recommendations.model';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function mapRelatedToThumbnail(
  item: RecommendationVideoItem,
): ThumbnailData {
  return {
    id: item.videoId,
    thumbnailSrc: item.thumbnailSrc,
    ProfileImageUrl: item.uploaderProfileImageUrl ?? undefined,
    title: item.title,
    uploader: item.uploader,
    duration: formatVideoTime(item.duration),
    progress: item.progress,
    views: item.views,
    date: item.date,
    type: item.videoType === 'LONG' ? 'long' : 'short',
  };
}

const RecommendedRelatedSection = () => {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');

  if (!videoId) {
    return <div>연관 영상을 불러올 수 없습니다.</div>;
  }
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
  } = useRelatedVideosInfinite(videoId, 10, 'LONG');

  const observerRef = useObserver({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  //TODO: 추후 로딩에러페이지 구현
  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러</div>;

  const items = data?.pages.flatMap((page) => page.content) ?? [];
  const videos = items.map(mapRelatedToThumbnail);

  return (
    <div className="flex flex-col gap-4">
      <span className="title1 pl-3">추천영상</span>

      <div className="flex flex-col">
        {videos.map((data) => {
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

export default RecommendedRelatedSection;
