'use client';
import VideoLargeCardSkeleton from '@/components/skeleton/VideoLargeCardSkeleton';
import VideoLargeCard from '@/components/thumbnail/VideoLargeCard';
import { ROUTES } from '@/constant/routes';
import useObserver from '@/hooks/useObserver';
import { useHomeFeedVideoInfinite } from '@/lib/tanstack/query/recommendation.query';
import { RecommendationVideoItem } from '@/models/recommendations.model';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';
import { Button } from '@repo/ui';
import Link from 'next/link';

export function mapHomeFeedToThumbnail(
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

const RecommendedSection = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
    refetch,
  } = useHomeFeedVideoInfinite();

  const observerRef = useObserver({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  const items = data?.pages.flatMap((page) => page.content) ?? [];
  const videos = items.map(mapHomeFeedToThumbnail);

  return (
    <div className="flex flex-col gap-4">
      <span className="title1 pl-3">추천영상</span>

      <div className="flex flex-col">
        {isPending ? (
          <div className="flex flex-col gap-1 overflow-hidden">
            {Array.from({ length: 2 }).map((_, i) => (
              <VideoLargeCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="border-primary-500 mx-3 flex flex-col items-center justify-center gap-5 rounded-lg border py-15">
            <span className="body2 text-primary-500">추천영상 에러</span>
            <Button size={'lg'} onClick={() => refetch()}>
              다시 시도하기
            </Button>
          </div>
        ) : (
          videos.map((data) => {
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
          })
        )}
      </div>
      <div ref={observerRef} />
    </div>
  );
};

export default RecommendedSection;
