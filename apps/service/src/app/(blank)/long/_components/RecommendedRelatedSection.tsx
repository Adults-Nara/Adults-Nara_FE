'use client';
import VideoLargeCardSkeleton from '@/components/skeleton/VideoLargeCardSkeleton';
import VideoLargeCard from '@/components/thumbnail/VideoLargeCard';
import { ROUTES } from '@/constant/routes';
import useObserver from '@/hooks/useObserver';
import { useRelatedVideosInfinite } from '@/lib/tanstack/query/recommendation.query';
import { RecommendationVideoItem } from '@/models/recommendations.model';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';
import { CircleX, Inbox } from 'lucide-react';
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isPending,
    refetch,
  } = useRelatedVideosInfinite(videoId ?? undefined, 10, 'LONG');

  const observerRef = useObserver({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  if (!videoId) {
    return;
  }

  const items = data?.pages.flatMap((page) => page.content) ?? [];
  const videos = items.map(mapRelatedToThumbnail);

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
          <div className="border-primary-500 mx-3 flex flex-col items-center justify-center gap-3 rounded-lg border py-15">
            <CircleX size={35} className="text-primary-500" />
            <span className="body2 text-primary-500">
              추천 영상을 가져오지 못했습니다.
            </span>
            <button
              onClick={() => refetch()}
              className="body3 underline opacity-60"
            >
              다시 시도하기
            </button>
          </div>
        ) : videos.length === 0 ? (
          <div className="mx-3 flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-300 py-12 text-gray-600">
            <Inbox size={35} />
            <span className="body2">추천 영상이 없습니다.</span>
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
        <div ref={observerRef} className="h-1" />
      </div>
    </div>
  );
};

export default RecommendedRelatedSection;
