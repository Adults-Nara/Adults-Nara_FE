'use client';
import VideoVerticalCard from '@/components/thumbnail/VideoVerticalCard';
import useEmblaCarousel from 'embla-carousel-react';
import { useSheetStore } from '@/store/useSheetStore';
import { useRecentWatchHistory } from '@/lib/tanstack/query/watch-history.query';
import { WatchHistoryItemResponse } from '@/models/watch-history.model';
import { ThumbnailData } from '@/types/video';
import { formatVideoTime } from '@/utils/format';
import SheetRecentHistory from './SheetRecentHistory';
import { ROUTES } from '@/constant/routes';
import Link from 'next/link';
import VideoVerticalCardSkeleton from '@/components/skeleton/VideoVerticalCardSkeleton';
import { CircleX, Inbox } from 'lucide-react';

export function mapWatchHistoryToThumbnail(
  item: WatchHistoryItemResponse,
): ThumbnailData {
  return {
    id: item.videoId,
    thumbnailSrc: item.thumbnailUrl,
    title: item.title,
    uploader: item.uploaderName,
    duration: formatVideoTime(item.duration),
    progress: item.watchProgressPercent,
    views: item.viewCount,
    date: item.uploadedAt,
    type: item.videoType === 'LONG' ? 'long' : 'short',
  };
}

const RecentHistory = () => {
  const { open } = useSheetStore();
  const [videoListRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
  });

  const { data, isError, isPending, refetch } = useRecentWatchHistory();

  const items = data?.pages[0].items;
  const noneItems = items?.length === 0;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <span className="title1">최근 시청 이력</span>
        {!noneItems && (
          <button
            className="body3 text-primary-500 cursor-pointer"
            onClick={() => open('최근 시청 이력', <SheetRecentHistory />)}
          >
            모두보기{' >'}
          </button>
        )}
      </div>
      <div className="overflow-hidden px-0.5 py-0.5" ref={videoListRef}>
        <div className="flex gap-4">
          {isPending ? (
            <div className="flex flex-nowrap gap-4 overflow-hidden py-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-50 shrink-0">
                  <VideoVerticalCardSkeleton />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="border-primary-500 flex w-full flex-col items-center justify-center gap-3 rounded-lg border py-10">
              <CircleX size={35} className="text-primary-500" />
              <span className="body2 text-primary-500">
                최근 시청 이력을 불러오지 못했습니다.
              </span>
              <button
                onClick={() => refetch()}
                className="body3 underline opacity-60"
              >
                다시 시도하기
              </button>
            </div>
          ) : noneItems ? (
            <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-gray-400 py-10 text-gray-600">
              <Inbox size={35} />
              <span className="body2">최근 시청 영상이 없습니다.</span>
            </div>
          ) : (
            items?.map((data) => {
              const mapped = mapWatchHistoryToThumbnail(data);
              return (
                <Link
                  key={mapped.id}
                  className="flex-[0_0_60%]"
                  href={`${
                    mapped.type === 'short'
                      ? `${ROUTES.SHORTS}?v=${mapped.id}`
                      : `${ROUTES.LONG}?v=${mapped.id}`
                  }`}
                >
                  <VideoVerticalCard data={mapped} />
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentHistory;
